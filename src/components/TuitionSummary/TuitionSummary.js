// frontend-dkmhhp/src/components/TuitionSummary/TuitionSummary.js

import React, { useState, useEffect } from 'react';
import './TuitionSummary.css';
import { fetchTuitionSummary } from '../../services/api'; // Import hàm API

const TuitionSummary = () => {
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchTuitionSummary();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching tuition summary:', error);
        setError('Failed to load tuition summary.');
      }
    };

    loadSummary();
  }, []);

  return (
    <div className="tuition-summary-container">
      <h2>Tuition Summary</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="summary-list">
        {summary.length > 0 ? (
          summary.map((item, index) => (
            <div key={index} className="summary-item">
              <h3>{item.studentName}</h3>
              <p>Student ID: {item.studentId}</p>
              <p>Total Paid: {item.totalPaid}</p>
              <p>Outstanding: {item.outstanding}</p>
            </div>
          ))
        ) : (
          <p>No tuition summary available.</p>
        )}
      </div>
    </div>
  );
};

export default TuitionSummary;