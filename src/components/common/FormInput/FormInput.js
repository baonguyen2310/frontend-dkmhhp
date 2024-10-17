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
  label,
  options = [],
  error
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`form-input ${error ? 'form-input-error' : ''}`}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`form-input ${error ? 'form-input-error' : ''}`}
          />
        );
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`form-input ${error ? 'form-input-error' : ''}`}
          />
        );
    }
  };

  return (
    <div className="form-input-container">
      {label && <label htmlFor={name}>{label}</label>}
      {renderInput()}
      {error && <span className="form-input-error-message">{error}</span>}
    </div>
  );
};

export default FormInput;
