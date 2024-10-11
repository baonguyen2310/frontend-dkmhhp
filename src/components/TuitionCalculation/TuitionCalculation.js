// frontend-dkmhhp/src/components/TuitionCalculation/TuitionCalculation.js

import React, { useState } from 'react';
import './TuitionCalculation.css';
import { calculateTuition } from '../../services/api'; // Import hàm API

const TuitionCalculation = () => {
  const [studentId, setStudentId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [tuitionDetails, setTuitionDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculateTuition = async (e) => {
    e.preventDefault();
    try {
      const data = await calculateTuition(studentId, semesterId);
      setTuitionDetails(data);
      setError(null);
    } catch (error) {
      console.error('Error calculating tuition:', error);
      setError('Failed to calculate tuition.');
      setTuitionDetails(null);
    }
  };

  return (
    <div className="tuition-calculation-container">
      <h2>Tuition Calculation</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleCalculateTuition}>
        <input
          type="text"
          name="studentId"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="text"
          name="semesterId"
          placeholder="Semester ID"
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
          required
        />
        <button type="submit">Calculate Tuition</button>
      </form>
      {tuitionDetails && (
        <div className="tuition-details">
          <h3>Tuition Details</h3>
          <p>Total Credits: {tuitionDetails.totalCredits}</p>
          <p>Tuition Fee: {tuitionDetails.tuitionFee}</p>
          <p>Discount: {tuitionDetails.discount}</p>
          <p>Amount Due: {tuitionDetails.amountDue}</p>
        </div>
      )}
    </div>
  );
};

export default TuitionCalculation;