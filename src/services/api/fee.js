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

export const addFee = async (feeData) => {
  try {
    const response = await axiosInstance.post('/fees', feeData);
    return response.data;
  } catch (error) {
    console.error('Error adding fee:', error);
    throw error;
  }
};

export const updateFee = async (feeId, feeData) => {
  try {
    const response = await axiosInstance.put(`/fees/${feeId}`, feeData);
    return response.data;
  } catch (error) {
    console.error('Error updating fee:', error);
    throw error;
  }
};

export const deleteFee = async (feeId) => {
  try {
    const response = await axiosInstance.delete(`/fees/${feeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting fee:', error);
    throw error;
  }
};

export const getUnpaidStudents = async (semesterId) => {
  try {
    const response = await axiosInstance.get(`/fees/unpaid-students/${semesterId}`);
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

// Thêm hai hàm mới này
export const makePayment = async (feeId, paymentData) => {
  try {
    const response = await axiosInstance.post(`/fees/${feeId}/payments`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error making payment:', error);
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
