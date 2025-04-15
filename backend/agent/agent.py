from langchain_openai import ChatOpenAI
# from langchain_groq import ChatGroq 
from langchain_core.messages import HumanMessage, AIMessage
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langgraph.graph import StateGraph, END
from typing import Dict, List, Any, TypedDict, Annotated, Sequence
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# Use absolute imports when running as a script
try:
    from .prompts import AGENT_PROMPT
    from .tools import get_menu, check_availability, place_order, make_reservation, \
        get_order_history, get_reservation_history, get_current_order, get_current_reservation
except ImportError:
    from backend.agent.prompts import AGENT_PROMPT
    from backend.agent.tools import get_menu, check_availability, place_order, make_reservation, \
        get_order_history, get_reservation_history, get_current_order, get_current_reservation

# Define the state
class AgentState(TypedDict):
    input: str
    chat_history: Annotated[Sequence[Any], "The chat history"]
    agent_scratchpad: Annotated[List, "The agent's scratchpad"]
    memory: Annotated[Dict, "The agent's memory for tracking orders and reservations"]

# Initialize the LLM
def get_llm():
    # Get API key from environment variables
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set. Please check your .env file.")

    return ChatOpenAI(
        model="gpt-3.5-turbo-0125",
        temperature=0.7,
        api_key=api_key
    )
# def get_llm():
#     # Get API key from environment variables
#     api_key = os.getenv("GROQ_API_KEY")
#     if not api_key:
#         raise ValueError("GROQ_API_KEY environment variable is not set. Please check your .env file.")

#     return ChatGroq(
#         model="llama3-8b-8192",  # Using Llama 3 8B model
#         temperature=0.7,
#         api_key=api_key
#     )
# Create the tools list
tools = [
    get_menu,
    check_availability,
    place_order,
    make_reservation,
    get_order_history,
    get_reservation_history,
    get_current_order,
    get_current_reservation
]



def create_agent():
    llm = get_llm()
    agent = create_openai_tools_agent(llm, tools, AGENT_PROMPT)
    
    executor = AgentExecutor(agent=agent, tools=tools)
    return executor

# Define the main agent function
def agent_node(state: AgentState) -> AgentState:
    agent_executor = create_agent()
    input_text = state["input"]
    chat_history = state.get("chat_history", [])
    memory = state.get("memory", {
        "current_order": None,
        "order_history": [],
        "current_reservation": None,
        "reservation_history": []
    })

    # Execute the agent
    result = agent_executor.invoke({
        "input": input_text,
        "chat_history": chat_history,
        "agent_scratchpad": state.get("agent_scratchpad", []),
        "memory": memory
    })

    # Update the chat history
    chat_history.append(HumanMessage(content=input_text))
    chat_history.append(AIMessage(content=result["output"]))

    # Return the updated state (without the output field)
    return {
        "input": input_text,
        "chat_history": chat_history,
        "agent_scratchpad": [],
        "memory": memory
    }

# Create the graph
def build_graph():
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", agent_node)
    workflow.set_entry_point("agent")
    workflow.add_edge("agent", END)

    return workflow.compile()

# Initialize the agent graph
agent_graph = build_graph()

# Function to run the agent
def run_agent(user_input: str, chat_history: List = None, memory: Dict = None):
    if chat_history is None:
        chat_history = []

    if memory is None:
        memory = {
            "current_order": None,
            "order_history": [],
            "current_reservation": None,
            "reservation_history": []
        }

    # Run the agent
    result = agent_graph.invoke({
        "input": user_input,
        "chat_history": chat_history,
        "agent_scratchpad": [],
        "memory": memory
    })

    # Get the last AI message from the chat history
    response = result["chat_history"][-1].content if result["chat_history"] else ""

    return {
        "response": response,
        "chat_history": result["chat_history"],
        "memory": result.get("memory", memory)
    }
