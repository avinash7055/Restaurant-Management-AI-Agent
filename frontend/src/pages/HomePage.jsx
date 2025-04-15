import React from 'react';
import styled from 'styled-components';
import Chat from '../components/Chat';

const HomeContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    max-width: 600px;
    line-height: 1.6;
  }
`;

function HomePage({ sessionId }) {
  return (
    <HomeContainer>
      <WelcomeSection>
        <h1>Welcome to Green Delight</h1>
        <p>
          Experience the finest vegetarian cuisine in town. Our AI assistant is here to help you
          order food or book a table. Just start chatting below!
        </p>
      </WelcomeSection>
      
      <Chat sessionId={sessionId} />
    </HomeContainer>
  );
}

export default HomePage;
