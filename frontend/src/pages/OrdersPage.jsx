import React from 'react';
import styled from 'styled-components';
import Orders from '../components/Orders';

const OrdersPageContainer = styled.div`
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

function OrdersPage() {
  return (
    <OrdersPageContainer>
      <PageHeader>
        <h1>Your Orders</h1>
        <p>
          View all your orders from Green Delight. You can track your order history and see details of each order.
        </p>
      </PageHeader>
      
      <Orders />
    </OrdersPageContainer>
  );
}

export default OrdersPage;
