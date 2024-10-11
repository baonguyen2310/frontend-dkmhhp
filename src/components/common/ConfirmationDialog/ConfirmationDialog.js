// src/components/common/ConfirmationDialog.js
import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message, title = 'Confirm Action' }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="confirmation-dialog">
      <p>{message}</p>
      <div className="confirmation-actions">
        <Button onClick={onConfirm} className="confirm-btn">Confirm</Button>
        <Button onClick={onClose} className="cancel-btn">Cancel</Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmationDialog;