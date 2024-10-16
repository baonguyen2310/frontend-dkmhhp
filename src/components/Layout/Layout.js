// frontend-dkmhhp/src/components/Layout/Layout.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTachometerAlt, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1>QLDKMHHP</h1>
        <nav className="navigation">
          <ul>
            <li className={isActive('/')}>
              <Link to="/"><FontAwesomeIcon icon={faHome} /> Home</Link>
            </li>
            <li className={isActive('/dashboard')}>
              <Link to="/dashboard"><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</Link>
            </li>
            <li className={isActive('/login')}>
              <Link to="/login"><FontAwesomeIcon icon={faSignInAlt} /> Login</Link>
            </li>
            <li className={isActive('/register')}>
              <Link to="/register"><FontAwesomeIcon icon={faUserPlus} /> Register</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
