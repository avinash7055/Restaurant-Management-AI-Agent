from flask import Blueprint, request, jsonify

# Use absolute imports when running as a script
try:
    from ..agent.agent import run_agent
    from ..database.db import get_db, get_menu_items, get_table_availability
except ImportError:
    from backend.agent.agent import run_agent
    from backend.database.db import get_db, get_menu_items, get_table_availability

api = Blueprint('api', __name__)

# Store chat histories in memory (in a real app, this would be in a database)
chat_histories = {}

@api.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    session_id = data.get('session_id', 'default')

    # Get chat history for this session
    if session_id not in chat_histories:
        chat_histories[session_id] = []

    # Run the agent
    result = run_agent(user_input, chat_histories[session_id])

    # Update chat history
    chat_histories[session_id] = result['chat_history']

    return jsonify({
        'response': result['response'],
        'session_id': session_id
    })

@api.route('/menu', methods=['GET'])
def menu():
    db = get_db()
    menu_items = get_menu_items(db)
    return jsonify([item.to_dict() for item in menu_items])

@api.route('/availability', methods=['GET'])
def availability():
    date = request.args.get('date')
    db = get_db()
    availability = get_table_availability(db, date)

    result = {}
    for item in availability:
        if item.date not in result:
            result[item.date] = {}

        result[item.date][item.time] = {"available": item.available}

    return jsonify(result)
