import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ReservationsPage from './pages/ReservationsPage';
import OrdersPage from './pages/OrdersPage';
import AboutPage from './pages/AboutPage';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  const [sessionId, setSessionId] = useState(() => {
    // Generate a random session ID or use one from localStorage if it exists
    const savedSessionId = localStorage.getItem('sessionId');
    return savedSessionId || `session_${Math.random().toString(36).substring(2, 9)}`;
  });

  useEffect(() => {
    // Save session ID to localStorage
    localStorage.setItem('sessionId', sessionId);
  }, [sessionId]);

  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage sessionId={sessionId} />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </MainContent>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </AppContainer>
    </Router>
  );
}

export default App;
