// frontend-dkmhhp/src/components/PaymentManagement/PaymentManagement.js

import React, { useState, useEffect } from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import { fetchPayments, addPayment, fetchStudents, fetchFees } from '../../services/api';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialPaymentState = {
  fee_id: '',
  amount_paid: ''
};

const handleError = (error) => {
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.message || 'An error occurred';
    console.error(errorMessage);
  } else {
    console.error('An unexpected error occurred');
  }
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
        handleError(error);
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
    { key: 'is_early_payment', title: 'Early Payment', render: (payment) => payment.is_early_payment ? 'Yes' : 'No' }
  ];

  const renderForm = ({ handleSubmit, handleChange, selectedItem, closeModal }) => {
    // Lọc ra các khoản phí chưa được thanh toán đầy đủ
    const unpaidFees = fees.filter(fee => fee.amount_paid < (fee.tuition_fee - fee.discount));

    const selectedFee = unpaidFees.find(fee => fee.fee_id === selectedItem.fee_id);
    const remainingBalance = selectedFee ? selectedFee.tuition_fee - selectedFee.discount - selectedFee.amount_paid : 0;

    return (
      <form onSubmit={handleSubmit}>
        <FormInput
          type="select"
          name="fee_id"
          placeholder="Fee"
          value={selectedItem.fee_id}
          onChange={handleChange}
          options={unpaidFees.map(fee => ({ 
            value: fee.fee_id, 
            label: `${fee.fee_id} - ${students.find(s => s.student_id === fee.student_id)?.first_name} ${students.find(s => s.student_id === fee.student_id)?.last_name} - Remaining: $${(fee.tuition_fee - fee.discount - fee.amount_paid).toFixed(2)}`
          }))}
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
          max={remainingBalance}
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
  };

  const handleAddPayment = async (paymentData) => {
    try {
      const formattedPaymentData = {
        ...paymentData,
        amount_paid: parseFloat(paymentData.amount_paid)
      };
      
      const result = await addPayment(formattedPaymentData);
      
      // Hiển thị thông báo kết quả thanh toán
      if (result.payment.is_early_payment) {
        alert(`Payment successful! 
               Amount paid: $${result.payment.amount_paid.toFixed(2)}
               Early payment discount applied: Yes
               Total amount paid: $${result.payment.total_amount_paid.toFixed(2)}
               Remaining balance: $${(result.payment.tuition_fee - result.payment.discount - result.payment.total_amount_paid).toFixed(2)}`);
      } else {
        alert(`Payment successful! 
               Amount paid: $${result.payment.amount_paid.toFixed(2)}
               Total amount paid: $${result.payment.total_amount_paid.toFixed(2)}
               Remaining balance: $${(result.payment.tuition_fee - result.payment.discount - result.payment.total_amount_paid).toFixed(2)}`);
      }
      
      // Refresh data
      // Giả sử DataManagement component có prop onDataChange để trigger refresh
      // Nếu không, bạn có thể cần implement logic refresh riêng
    } catch (error) {
      handleError(error);
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
      idField="payments_id"
      handleError={handleError}
      disableDelete={true}
      disableEdit={true}
    />
  );
};

export default PaymentManagement;
