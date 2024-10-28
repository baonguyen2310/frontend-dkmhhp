import React from 'react';
import './FilterRow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const FilterRow = ({ columns, filters, onFilterChange, onClearFilters }) => {
  // Hàm helper để lấy placeholder text
  const getPlaceholderText = (column) => {
    if (!column || !column.label) {
      return `Filter ${column?.key || ''}`;
    }
    return column.label;
  };

  return (
    <div className="filter-row">
      <div className="filter-header">
        <FontAwesomeIcon icon={faFilter} /> Filters
        {Object.values(filters).some(value => value) && (
          <button className="clear-filters" onClick={onClearFilters}>
            <FontAwesomeIcon icon={faTimes} /> Clear All
          </button>
        )}
      </div>
      <div className="filter-inputs">
        {columns?.map(column => (
          <div key={column.key} className="filter-item">
            <input
              type="text"
              placeholder={getPlaceholderText(column)}
              value={filters[column.key] || ''}
              onChange={(e) => onFilterChange(column.key, e.target.value)}
              className="filter-input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterRow;
