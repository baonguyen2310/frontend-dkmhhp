import React, { useState, useEffect } from 'react';
import './FeeManagement.css';
import {
  fetchFees,
  addFee,
  updateFee,
  deleteFee,
  makePayment,
  getFeePaymentHistory
} from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Notification from '../common/Notification/Notification';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import Spinner from '../common/Spinner';
import Table from '../common/Table';
import ConfirmationDialog from '../common/ConfirmationDialog';

const initialFeeState = {
  student_id: '',
  semester_id: '',
  tuition_fee: '',
  amount_paid: '',
  payment_status: '',
  payment_deadline: '',
  early_payment_deadline: ''
};

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(initialFeeState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFees();
      setFees(data);
    } catch (error) {
      console.error('Error fetching fees:', error);
      showNotification('Failed to load fees.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedFee(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (fee = null) => {
    if (fee) {
      setSelectedFee({
        ...fee
      });
      setIsEditing(true);
    } else {
      setSelectedFee(initialFeeState);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateFee(selectedFee.fee_id, selectedFee);
        showNotification('Fee updated successfully!', 'success');
      } else {
        await addFee(selectedFee);
        showNotification('Fee added successfully!', 'success');
      }
      await loadFees();
      setIsModalOpen(false);
      setSelectedFee(initialFeeState);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving fee:', error);
      showNotification(error.response?.data?.message || 'Failed to save fee.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (feeId) => {
    setFeeToDelete(feeId);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteFee = async () => {
    if (feeToDelete) {
      setIsLoading(true);
      try {
        await deleteFee(feeToDelete);
        await loadFees();
        showNotification('Fee deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting fee:', error);
        showNotification('Failed to delete fee.', 'error');
      } finally {
        setIsLoading(false);
        setIsConfirmDialogOpen(false);
        setFeeToDelete(null);
      }
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await makePayment(selectedFee.fee_id, parseFloat(paymentAmount));
      showNotification('Payment processed successfully', 'success');
      if (response.isEarlyPayment) {
        showNotification('Early payment discount applied!', 'success');
      }
      setPaymentAmount('');
      await loadFees();
      await loadPaymentHistory(selectedFee.fee_id);
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      showNotification('Error processing payment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPaymentHistory = async (feeId) => {
    try {
      const history = await getFeePaymentHistory(feeId);
      setPaymentHistory(history);
    } catch (error) {
      console.error('Error loading payment history:', error);
      showNotification('Error loading payment history', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFee(initialFeeState);
    setIsEditing(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const renderFeeForm = () => (
    <form onSubmit={handleSubmit}>
      <FormInput
        type="text"
        name="student_id"
        placeholder="Student ID"
        value={selectedFee.student_id}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="semester_id"
        placeholder="Semester ID"
        value={selectedFee.semester_id}
        onChange={handleChange}
        required
      />
      <FormInput
        type="number"
        name="tuition_fee"
        placeholder="Tuition Fee"
        value={selectedFee.tuition_fee}
        onChange={handleChange}
        required
      />
      <FormInput
        type="number"
        name="amount_paid"
        placeholder="Amount Paid"
        value={selectedFee.amount_paid}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="payment_status"
        placeholder="Payment Status"
        value={selectedFee.payment_status}
        onChange={handleChange}
        required
      />
      <div className="form-actions">
        <Button type="submit" className="submit-btn">
          {isEditing ? 'Update Fee' : 'Add Fee'}
        </Button>
        <Button onClick={closeModal} className="cancel-btn">
          Cancel
        </Button>
      </div>
    </form>
  );

  const columns = [
    { key: 'fee_id', title: 'Fee ID' },
    { key: 'student_id', title: 'Student ID' },
    { key: 'semester_id', title: 'Semester ID' },
    { key: 'tuition_fee', title: 'Tuition Fee', render: (fee) => `$${fee.tuition_fee.toFixed(2)}` },
    { key: 'amount_paid', title: 'Amount Paid', render: (fee) => `$${fee.amount_paid.toFixed(2)}` },
    { key: 'payment_status', title: 'Payment Status' }
  ];

  const renderPaymentForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
      <FormInput
        type="number"
        name="payment_amount"
        placeholder="Payment Amount"
        value={paymentAmount}
        onChange={(e) => setPaymentAmount(e.target.value)}
        required
      />
      <div className="form-actions">
        <Button type="submit" className="submit-btn">
          Make Payment
        </Button>
        <Button onClick={() => setIsPaymentModalOpen(false)} className="cancel-btn">
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div className="fee-management-container">
      {isLoading && <Spinner />}
      <div className="fee-management-content">
        <div className="fee-list">
          <div className="list-header">
            <h3>Fee List</h3>
            <Button icon={faPlus} className="add-btn" onClick={() => openModal()}>
              Add Fee
            </Button>
          </div>
          <Table
            columns={columns}
            data={fees}
            onEdit={openModal}
            onDelete={handleDeleteClick}
            onAction={(fee) => { setSelectedFee(fee); setIsPaymentModalOpen(true); }}
            actionLabel="Make Payment"
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Edit Fee' : 'Add New Fee'}
      >
        {renderFeeForm()}
      </Modal>
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Make Payment"
      >
        {renderPaymentForm()}
      </Modal>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDeleteFee}
        message="Are you sure you want to delete this fee?"
        title="Confirm Deletion"
      />
    </div>
  );
};

export default FeeManagement;
