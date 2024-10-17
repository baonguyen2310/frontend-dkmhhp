// frontend-dkmhhp/src/components/PaymentManagement/PaymentManagement.js

import React, { useState, useEffect } from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import { fetchPayments, addPayment, fetchStudents, fetchFees } from '../../services/api';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialPaymentState = {
  fee_id: '',
  payment_date: new Date().toISOString().split('T')[0],
  amount_paid: ''
};

const PaymentManagement = () => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedStudents, fetchedFees] = await Promise.all([
          fetchStudents(),
          fetchFees()
        ]);
        setStudents(fetchedStudents);
        setFees(fetchedFees);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadData();
  }, []);

  const columns = [
    { key: 'payments_id', title: 'Payment ID' },
    { key: 'fee_id', title: 'Fee ID' },
    { key: 'student_id', title: 'Student ID' },
    { key: 'first_name', title: 'First Name' },
    { key: 'last_name', title: 'Last Name' },
    { key: 'payment_date', title: 'Payment Date', render: (payment) => new Date(payment.payment_date).toLocaleDateString() },
    { key: 'amount_paid', title: 'Amount Paid', render: (payment) => `$${payment.amount_paid.toFixed(2)}` },
    { key: 'semester_name', title: 'Semester' }
  ];

  const renderForm = ({ handleSubmit, handleChange, selectedItem, closeModal }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(selectedItem);
    }}>
      <FormInput
        type="select"
        name="fee_id"
        placeholder="Fee"
        value={selectedItem.fee_id}
        onChange={handleChange}
        options={fees.map(fee => ({ 
          value: fee.fee_id, 
          label: `${fee.fee_id} - ${students.find(s => s.student_id === fee.student_id)?.first_name} ${students.find(s => s.student_id === fee.student_id)?.last_name} - $${fee.total_amount}`
        }))}
        required
      />
      <FormInput
        type="date"
        name="payment_date"
        placeholder="Payment Date"
        value={selectedItem.payment_date}
        onChange={handleChange}
        required
      />
      <FormInput
        type="number"
        name="amount_paid"
        placeholder="Amount Paid"
        value={selectedItem.amount_paid}
        onChange={handleChange}
        required
        step="0.01"
      />
      <div className="form-actions">
        <Button type="submit" className="submit-btn">
          Add Payment
        </Button>
        <Button type="button" onClick={closeModal} className="cancel-btn">
          Cancel
        </Button>
      </div>
    </form>
  );

  const handleAddPayment = async (paymentData) => {
    console.log('Adding payment:', paymentData);
    try {
      const response = await addPayment(paymentData);
      console.log('Payment added successfully:', response);
      return { success: true, message: 'Payment added successfully', data: response };
    } catch (error) {
      console.error('Error adding payment:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add payment' };
    }
  };

  return (
    <DataManagement
      title="Payment"
      fetchData={fetchPayments}
      addData={handleAddPayment}
      initialDataState={initialPaymentState}
      columns={columns}
      renderForm={renderForm}
      disableEdit={true}
      disableDelete={true}
    />
  );
};

export default PaymentManagement;
