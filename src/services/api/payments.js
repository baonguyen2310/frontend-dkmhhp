// frontend-dkmhhp/src/services/api/payments.js

import axiosInstance from './axiosConfig';

export const fetchPayments = async () => {
  try {
    const response = await axiosInstance.get('/payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const addPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await axiosInstance.put(`/payments/${paymentId}`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

export const deletePayment = async (paymentId) => {
  try {
    const response = await axiosInstance.delete(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};

export const fetchPaymentsByStudent = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/payments/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payments by student:', error);
    throw error;
  }
};

export const fetchPaymentsBySemester = async (semesterId) => {
  try {
    const response = await axiosInstance.get(`/payments/semester/${semesterId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payments by semester:', error);
    throw error;
  }
};

