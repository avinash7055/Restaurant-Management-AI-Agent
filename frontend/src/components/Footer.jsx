import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--primary-color);
  color: white;
  padding: 20px 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  
  a {
    color: white;
    font-size: 1.2rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--accent-color);
    }
  }
  
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>&copy; {year} Green Delight Restaurant. All rights reserved.</Copyright>
        <SocialLinks>
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="Twitter">TW</a>
        </SocialLinks>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
