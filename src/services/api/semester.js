import axiosInstance from './axiosConfig';

export const fetchSemesters = async () => {
  try {
    const response = await axiosInstance.get('/semesters');
    return response.data;
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw error;
  }
};
