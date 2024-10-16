import axiosInstance from './axiosConfig';

export const fetchCourseRegistrations = async () => {
  try {
    const response = await axiosInstance.get('/course-registrations');
    return response.data;
  } catch (error) {
    console.error('Error fetching course registrations:', error);
    throw error;
  }
};

export const addCourseRegistration = async (registrationData) => {
  try {
    const response = await axiosInstance.post('/course-registrations', registrationData);
    return response.data;
  } catch (error) {
    console.error('Error adding course registration:', error);
    throw error;
  }
};

export const updateCourseRegistration = async (registrationId, registrationData) => {
  try {
    const response = await axiosInstance.put(`/course-registrations/${registrationId}`, registrationData);
    return response.data;
  } catch (error) {
    console.error('Error updating course registration:', error);
    throw error;
  }
};

export const deleteCourseRegistration = async (registrationId) => {
  try {
    const response = await axiosInstance.delete(`/course-registrations/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course registration:', error);
    throw error;
  }
};
