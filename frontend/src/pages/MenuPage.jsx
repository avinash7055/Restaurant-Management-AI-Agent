import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const MenuPageContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const MenuItem = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const MenuItemContent = styled.div`
  padding: 15px;
`;

const MenuItemName = styled.h3`
  color: var(--primary-color);
  margin: 0 0 10px 0;
  font-size: 1.1rem;
`;

const MenuItemPrice = styled.div`
  font-weight: 600;
  color: var(--accent-color);
  font-size: 1.2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #d32f2f;
  
  button {
    margin-top: 15px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
`;

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/menu');
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMenu();
  }, []);
  
  return (
    <MenuPageContainer>
      <PageHeader>
        <h1>Our Menu</h1>
        <p>
          Explore our delicious vegetarian dishes. All items are made with fresh, locally sourced ingredients.
        </p>
      </PageHeader>
      
      {loading ? (
        <LoadingMessage>Loading menu items...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>
          {error}
          <div>
            <button onClick={fetchMenu}>Try Again</button>
          </div>
        </ErrorMessage>
      ) : (
        <MenuGrid>
          {menuItems.map((item) => (
            <MenuItem key={item.id}>
              <MenuItemContent>
                <MenuItemName>{item.name}</MenuItemName>
                <MenuItemPrice>${item.price.toFixed(2)}</MenuItemPrice>
              </MenuItemContent>
            </MenuItem>
          ))}
        </MenuGrid>
      )}
    </MenuPageContainer>
  );
}

export default MenuPage;
