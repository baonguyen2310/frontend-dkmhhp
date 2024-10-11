// src/components/common/Button.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Button.css';

const Button = ({ onClick, icon, children, className, type = 'button', disabled = false }) => (
  <button 
    className={`btn ${className}`} 
    onClick={onClick} 
    type={type}
    disabled={disabled}
  >
    {icon && <FontAwesomeIcon icon={icon} />}
    {children && <span className="btn-text">{children}</span>}
  </button>
);

export default Button;