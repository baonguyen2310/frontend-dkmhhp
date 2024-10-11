// frontend-dkmhhp/src/services/api.js

import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:5004/api';

// Function to get the stored token
const getToken = () => {
  return localStorage.getItem('accessToken'); // Adjust based on where you store the token
};

// Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle invalid tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle invalid token, e.g., log out the user
      localStorage.removeItem('accessToken'); // Clear the token
      localStorage.removeItem('user'); // Clear user data
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { username, password });
    const { token } = response.data;
    localStorage.setItem('accessToken', token); // Store token for future requests
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// Course Management APIs
export const fetchCourses = async () => {
  try {
    const response = await axiosInstance.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const addCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axiosInstance.put(`/courses/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await axiosInstance.delete(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Student Management APIs
export const fetchStudents = async () => {
  try {
    const response = await axiosInstance.get('/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await axiosInstance.post('/students', studentData);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await axiosInstance.put(`/students/${studentId}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    const response = await axiosInstance.delete(`/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    // Ném lỗi với thông báo từ server nếu có
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Course Registration APIs
export const registerCourse = async (registrationData) => {
  try {
    const response = await axiosInstance.post('/course-registration', registrationData);
    return response.data;
  } catch (error) {
    console.error('Error registering course:', error);
    throw error;
  }
};

// Tuition Management APIs
export const calculateTuition = async (studentId, semesterId) => {
  try {
    const response = await axiosInstance.get('/tuition-fees/calculate', {
      params: { studentId, semesterId }
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating tuition:', error);
    throw error;
  }
};

export const payTuition = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/tuition-fees/pay', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error paying tuition:', error);
    throw error;
  }
};

export const fetchTuitionSummary = async (studentId) => {
  try {
    const response = await axiosInstance.get('/tuition-fees/summary', {
      params: { studentId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tuition summary:', error);
    throw error;
  }
};

// Debt Management APIs
export const fetchDebtList = async () => {
  try {
    const response = await axiosInstance.get('/students/debt-list');
    return response.data;
  } catch (error) {
    console.error('Error fetching debt list:', error);
    throw error;
  }
};