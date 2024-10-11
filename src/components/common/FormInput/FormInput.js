// src/components/common/FormInput.js
import React from 'react';
import './FormInput.css';

const FormInput = ({ 
  type = 'text', 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  label
}) => (
  <div className="form-input-container">
    {label && <label htmlFor={name}>{label}</label>}
    <input
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="form-input"
    />
  </div>
);

export default FormInput;