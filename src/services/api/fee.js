import axiosInstance from './axiosConfig';

export const fetchFees = async () => {
  try {
    const response = await axiosInstance.get('/fees');
    return response.data;
  } catch (error) {
    console.error('Error fetching fees:', error);
    throw error;
  }
};

// Xóa các hàm addFee, updateFee, và deleteFee vì Fee Management chỉ cho phép xem

export const getUnpaidStudents = async () => {
  try {
    const response = await axiosInstance.get('/fees/unpaid-students');
    return response.data;
  } catch (error) {
    console.error('Error fetching unpaid students:', error);
    throw error;
  }
};

export const sendUnpaidStudentsReport = async (semesterId) => {
  try {
    const response = await axiosInstance.post(`/fees/send-unpaid-report/${semesterId}`);
    return response.data;
  } catch (error) {
    console.error('Error sending unpaid students report:', error);
    throw error;
  }
};

export const getFeePaymentHistory = async (feeId) => {
  try {
    const response = await axiosInstance.get(`/fees/${feeId}/payment-history`);
    return response.data;
  } catch (error) {
    console.error('Error getting fee payment history:', error);
    throw error;
  }
};
