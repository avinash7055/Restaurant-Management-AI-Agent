import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrdersContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: var(--white);
  border-radius: 10px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-top: 20px;
`;

const OrdersHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 15px 20px;

  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const OrdersList = styled.div`
  padding: 20px;
`;

const OrderItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-right: 80px; /* Add space for the edit button */

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--primary-color);
  }

  span {
    font-weight: 500;
  }
`;

const OrderItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OrderItemDetail = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .item-name {
    flex: 1;
  }

  .item-quantity {
    margin: 0 15px;
    color: #666;
  }

  .item-price {
    font-weight: 500;
  }
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  font-weight: 700;

  span {
    margin-left: 10px;
    color: var(--primary-color);
  }
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
`;

const RefreshButton = styled.button`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-color);
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
  z-index: 5; /* Ensure buttons appear above other content */
`;

const ActionButton = styled.button`
  background-color: ${props => props.danger ? '#f44336' : 'var(--primary-color)'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const EditForm = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: var(--text-color);
  }

  input, select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer_name: '',
    items: [],
    total_price: 0
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleEditClick = (order) => {
    setEditingOrder(order.id);
    setEditFormData({
      customer_name: order.customer_name,
      items: [...order.items],
      total_price: order.total_price
    });
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditFormData({
      customer_name: '',
      items: [],
      total_price: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'total_price' ? parseFloat(value) : value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editFormData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'price' ? parseFloat(value) : value
    };

    // Recalculate total price
    const newTotalPrice = updatedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    setEditFormData(prev => ({
      ...prev,
      items: updatedItems,
      total_price: newTotalPrice
    }));
  };

  const handleSubmitEdit = async (orderId) => {
    setSubmitting(true);
    try {
      const response = await axios.put(`/api/orders/${orderId}`, editFormData);

      if (response.data.success) {
        // Update the orders list with the edited order
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? response.data.order : order
          )
        );

        setEditingOrder(null);
        toast.success('Order updated successfully!');
      } else {
        toast.error('Failed to update order.');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('Error updating order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OrdersContainer>
      <OrdersHeader>
        <h2>Your Orders</h2>
      </OrdersHeader>

      <OrdersList>
        {loading ? (
          <NoOrders>Loading orders...</NoOrders>
        ) : error ? (
          <NoOrders>
            {error}
            <div>
              <RefreshButton onClick={fetchOrders}>Try Again</RefreshButton>
            </div>
          </NoOrders>
        ) : orders.length === 0 ? (
          <NoOrders>You haven't placed any orders yet.</NoOrders>
        ) : (
          orders.map((order) => (
            <OrderItem key={order.id}>
              <OrderHeader>
                <h3>Order #{order.id}</h3>
                <span>{formatDate(order.timestamp)}</span>
              </OrderHeader>

              <ActionButtons>
                {editingOrder === order.id ? (
                  <ActionButton
                    onClick={() => handleCancelEdit()}
                    danger
                  >
                    Cancel
                  </ActionButton>
                ) : (
                  <ActionButton onClick={() => handleEditClick(order)}>
                    Edit
                  </ActionButton>
                )}
              </ActionButtons>

              {editingOrder === order.id ? (
                <EditForm>
                  <FormGroup>
                    <label>Customer Name</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={editFormData.customer_name}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <h4>Items</h4>
                  {editFormData.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <FormGroup style={{ flex: 2 }}>
                        <label>Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup style={{ flex: 1 }}>
                        <label>Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup style={{ flex: 1 }}>
                        <label>Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        />
                      </FormGroup>
                    </div>
                  ))}

                  <OrderTotal>
                    Total: <span>${editFormData.total_price.toFixed(2)}</span>
                  </OrderTotal>

                  <FormActions>
                    <ActionButton
                      onClick={() => handleCancelEdit()}
                      danger
                    >
                      Cancel
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleSubmitEdit(order.id)}
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </ActionButton>
                  </FormActions>
                </EditForm>
              ) : (
                <>
                  <OrderItems>
                    {order.items.map((item, index) => (
                      <OrderItemDetail key={index}>
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </OrderItemDetail>
                    ))}
                  </OrderItems>

                  <OrderTotal>
                    Total: <span>${order.total_price.toFixed(2)}</span>
                  </OrderTotal>
                </>
              )}
            </OrderItem>
          ))
        )}
      </OrdersList>
    </OrdersContainer>
  );
}

export default Orders;
