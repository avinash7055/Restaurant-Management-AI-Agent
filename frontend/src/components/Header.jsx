import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 20px 0;
  box-shadow: var(--shadow);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;

  a {
    color: white;
    text-decoration: none;
  }

  span {
    color: var(--accent-color);
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;

    li {
      margin-left: 20px;

      a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;

        &:hover, &.active {
          color: var(--accent-color);
        }
      }
    }
  }
`;

function Header() {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <Link to="/">Green <span>Delight</span></Link>
        </Logo>
        <Nav>
          <ul>
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>
                Menu
              </Link>
            </li>
            <li>
              <Link to="/reservations" className={location.pathname === '/reservations' ? 'active' : ''}>
                Reservations
              </Link>
            </li>
            <li>
              <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
                Orders
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                About
              </Link>
            </li>
          </ul>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
