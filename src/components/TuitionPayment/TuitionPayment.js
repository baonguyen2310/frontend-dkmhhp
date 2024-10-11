// frontend-dkmhhp/src/components/TuitionPayment/TuitionPayment.js

import React, { useState } from 'react';
import './TuitionPayment.css';
import { payTuition } from '../../services/api'; // Import hàm API

const TuitionPayment = () => {
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    semesterId: '',
    amountPaid: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  const handlePayTuition = async (e) => {
    e.preventDefault();
    try {
      await payTuition(paymentData);
      setSuccessMessage('Payment successful!');
      setError(null);
      setPaymentData({
        studentId: '',
        semesterId: '',
        amountPaid: ''
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="tuition-payment-container">
      <h2>Tuition Payment</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handlePayTuition}>
        <input
          type="text"
          name="studentId"
          placeholder="Student ID"
          value={paymentData.studentId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="semesterId"
          placeholder="Semester ID"
          value={paymentData.semesterId}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amountPaid"
          placeholder="Amount Paid"
          value={paymentData.amountPaid}
          onChange={handleChange}
          required
        />
        <button type="submit">Pay Tuition</button>
      </form>
    </div>
  );
};

export default TuitionPayment;