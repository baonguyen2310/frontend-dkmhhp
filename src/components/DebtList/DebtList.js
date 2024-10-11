// frontend-dkmhhp/src/components/DebtList/DebtList.js

import React, { useState, useEffect } from 'react';
import './DebtList.css';
import { fetchDebtList } from '../../services/api'; // Import hàm API

const DebtList = () => {
  const [debtList, setDebtList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDebtList = async () => {
      try {
        const data = await fetchDebtList();
        setDebtList(data);
      } catch (error) {
        console.error('Error fetching debt list:', error);
        setError('Failed to load debt list.');
      }
    };

    loadDebtList();
  }, []);

  return (
    <div className="debt-list-container">
      <h2>Debt List</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="debt-list">
        {debtList.length > 0 ? (
          debtList.map((student, index) => (
            <div key={index} className="debt-item">
              <h3>{student.firstName} {student.lastName}</h3>
              <p>Student ID: {student.studentId}</p>
              <p>Outstanding Amount: {student.outstandingAmount}</p>
            </div>
          ))
        ) : (
          <p>No students with outstanding fees.</p>
        )}
      </div>
    </div>
  );
};

export default DebtList;