import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ChatContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: var(--white);
  border-radius: 10px;
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 70vh;
`;

const ChatHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 12px 15px;
  border-radius: 10px;
  line-height: 1.4;
  position: relative;
  white-space: pre-line; /* This preserves line breaks in the text */

  ${props => props.isUser ? `
    align-self: flex-end;
    background-color: var(--primary-color);
    color: white;
    border-bottom-right-radius: 0;
  ` : `
    align-self: flex-start;
    background-color: #f0f0f0;
    color: var(--text-color);
    border-bottom-left-radius: 0;
  `}
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: var(--primary-color);
  }
`;

const SendButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--secondary-color);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TypingAnimation = styled.div`
  display: inline-block;
  align-self: flex-start;
  background-color: #f0f0f0;
  color: var(--text-color);
  padding: 12px 15px;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  margin-bottom: 10px;

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #888;
    margin-right: 3px;
    animation: wave 1.3s linear infinite;

    &:nth-child(2) {
      animation-delay: -1.1s;
    }

    &:nth-child(3) {
      animation-delay: -0.9s;
    }
  }

  @keyframes wave {
    0%, 60%, 100% {
      transform: initial;
    }
    30% {
      transform: translateY(-5px);
    }
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h3 {
    color: var(--primary-color);
    margin-bottom: 10px;
  }

  p {
    color: #666;
  }
`;

const SuggestedQueries = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const QueryButton = styled.button`
  background-color: #f0f0f0;
  color: var(--text-color);
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

function Chat({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQueries = [
    "I'd like to order food",
    "Can I book a table?",
    "What's on the menu?",
    "What are your opening hours?",
    "Do you have vegetarian options?"
  ];

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage = { text, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    // Clear input field
    setInput('');

    // Set loading state
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await axios.post('/api/chat', {
        message: text,
        session_id: sessionId
      });

      // Add bot response to chat
      const botMessage = {
        text: response.data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const handleSuggestedQuery = (query) => {
    handleSendMessage(query);
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h2>Chat with Green Delight Assistant</h2>
      </ChatHeader>

      <ChatMessages>
        {messages.length === 0 && (
          <WelcomeMessage>
            <h3>Welcome to Green Delight Restaurant!</h3>
            <p>How can I help you today? You can order food, book a table, or ask questions about our restaurant.</p>
            <SuggestedQueries>
              {suggestedQueries.map((query, index) => (
                <QueryButton
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                >
                  {query}
                </QueryButton>
              ))}
            </SuggestedQueries>
          </WelcomeMessage>
        )}

        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}

        {isLoading && (
          <TypingAnimation>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </TypingAnimation>
        )}

        <div ref={messagesEndRef} />
      </ChatMessages>

      <ChatInput>
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <SendButton
          onClick={() => handleSendMessage()}
          disabled={isLoading || !input.trim()}
        >
          Send
        </SendButton>
      </ChatInput>
    </ChatContainer>
  );
}

export default Chat;
