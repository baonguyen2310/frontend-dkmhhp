import React, { useState, useEffect } from 'react';
import './CourseRegistrationManagement.css';
import {
  fetchCourseRegistrations,
  addCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration
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

const initialRegistrationState = {
  student_id: '',
  course_id: '',
  semester_id: '',
  registration_date: ''
};

const CourseRegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(initialRegistrationState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCourseRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching course registrations:', error);
      showNotification('Failed to load course registrations.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedRegistration(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (registration = null) => {
    if (registration) {
      setSelectedRegistration({
        ...registration,
        registration_date: registration.registration_date.split('T')[0]
      });
      setIsEditing(true);
    } else {
      setSelectedRegistration(initialRegistrationState);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateCourseRegistration(selectedRegistration.registration_id, selectedRegistration);
        showNotification('Course registration updated successfully!', 'success');
      } else {
        await addCourseRegistration(selectedRegistration);
        showNotification('Course registration added successfully!', 'success');
      }
      await loadRegistrations();
      setIsModalOpen(false);
      setSelectedRegistration(initialRegistrationState);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving course registration:', error);
      showNotification(error.response?.data?.message || 'Failed to save course registration.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (registrationId) => {
    setRegistrationToDelete(registrationId);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteRegistration = async () => {
    if (registrationToDelete) {
      setIsLoading(true);
      try {
        await deleteCourseRegistration(registrationToDelete);
        await loadRegistrations();
        showNotification('Course registration deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting course registration:', error);
        showNotification('Failed to delete course registration.', 'error');
      } finally {
        setIsLoading(false);
        setIsConfirmDialogOpen(false);
        setRegistrationToDelete(null);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegistration(initialRegistrationState);
    setIsEditing(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const renderRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <FormInput
        type="text"
        name="student_id"
        placeholder="Student ID"
        value={selectedRegistration.student_id}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="course_id"
        placeholder="Course ID"
        value={selectedRegistration.course_id}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="semester_id"
        placeholder="Semester ID"
        value={selectedRegistration.semester_id}
        onChange={handleChange}
        required
      />
      <FormInput
        type="date"
        name="registration_date"
        placeholder="Registration Date"
        value={selectedRegistration.registration_date}
        onChange={handleChange}
        required
      />
      <div className="form-actions">
        <Button type="submit" className="submit-btn">
          {isEditing ? 'Update Registration' : 'Add Registration'}
        </Button>
        <Button onClick={closeModal} className="cancel-btn">
          Cancel
        </Button>
      </div>
    </form>
  );

  const columns = [
    { key: 'registration_id', title: 'Registration ID' },
    { key: 'student_id', title: 'Student ID' },
    { key: 'first_name', title: 'First Name' },
    { key: 'last_name', title: 'Last Name' },
    { key: 'course_id', title: 'Course ID' },
    { key: 'course_name', title: 'Course Name' },
    { key: 'semester_id', title: 'Semester ID' },
    { key: 'registration_date', title: 'Registration Date', render: (registration) => new Date(registration.registration_date).toLocaleDateString() },
  ];

  const handleUpdateRegistration = async (registrationId, newStatus) => {
    try {
      const response = await updateCourseRegistration(registrationId, { registration_status: newStatus });
      showNotification(response.data.message, 'success');
      
      if (response.data.feeDetails) {
        showFeeDetails(response.data.feeDetails);
      }
      
      await loadRegistrations();
    } catch (error) {
      console.error('Error updating registration:', error);
      showNotification(error.response?.data?.message || 'Failed to update registration.', 'error');
    }
  };

  const showFeeDetails = (feeDetails) => {
    setNotification({
      message: `Tuition fee calculated: $${feeDetails.tuitionFee.toFixed(2)}`,
      type: 'info'
    });
    // Có thể hiển thị thêm chi tiết trong một modal nếu cần
  };

  return (
    <div className="course-registration-management-container">
      {isLoading && <Spinner />}
      <div className="course-registration-management-content">
        <div className="registration-list">
          <div className="list-header">
            <h3>Course Registration List</h3>
            <Button icon={faPlus} className="add-btn" onClick={() => openModal()}>
              Add Registration
            </Button>
          </div>
          <Table
            columns={columns}
            data={registrations}
            onEdit={openModal}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Edit Course Registration' : 'Add New Course Registration'}
      >
        {renderRegistrationForm()}
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
        onConfirm={confirmDeleteRegistration}
        message="Are you sure you want to delete this course registration?"
        title="Confirm Deletion"
      />
    </div>
  );
};

export default CourseRegistrationManagement;
