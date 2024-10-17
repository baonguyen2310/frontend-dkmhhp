import React from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import { fetchFees } from '../../services/api';

const FeeManagement = () => {
  const columns = [
    { key: 'fee_id', title: 'Fee ID' },
    { key: 'student_id', title: 'Student ID' },
    { key: 'semester_id', title: 'Semester ID' },
    { key: 'tuition_fee', title: 'Tuition Fee', render: (fee) => `$${fee.tuition_fee.toFixed(2)}` },
    { key: 'discount', title: 'Discount', render: (fee) => `$${fee.discount.toFixed(2)}` },
    { key: 'amount_paid', title: 'Amount Paid', render: (fee) => `$${fee.amount_paid.toFixed(2)}` },
    { 
      key: 'remaining_balance', 
      title: 'Remaining Balance', 
      render: (fee) => `$${(fee.tuition_fee - fee.discount - fee.amount_paid).toFixed(2)}` 
    },
    { key: 'payment_status', title: 'Payment Status' }
  ];

  return (
    <DataManagement
      title="Fee"
      fetchData={fetchFees}
      columns={columns}
      disableAdd={true}
      disableEdit={true}
      disableDelete={true}
    />
  );
};

export default FeeManagement;
