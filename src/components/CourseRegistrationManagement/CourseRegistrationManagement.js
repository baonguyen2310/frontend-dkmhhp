import React from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import {
  fetchCourseRegistrations,
  addCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration
} from '../../services/api';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialRegistrationState = {
  student_id: '',
  course_id: '',
  semester_id: '',
  registration_date: ''
};

const CourseRegistrationManagement = () => {
  const columns = [
    { key: 'registration_id', title: 'ID' },
    { key: 'student_id', title: 'Student ID' },
    { key: 'first_name', title: 'First Name' },
    { key: 'last_name', title: 'Last Name' },
    { key: 'course_id', title: 'Course ID' },
    { key: 'course_name', title: 'Course Name' },
    { key: 'semester_id', title: 'Semester ID' },
    { key: 'registration_date', title: 'Date', render: (registration) => new Date(registration.registration_date).toLocaleDateString() },
  ];

  const renderForm = ({ handleSubmit, handleChange, selectedItem, isEditing, closeModal }) => (
    <form onSubmit={handleSubmit}>
      <FormInput
        type="text"
        name="student_id"
        placeholder="Student ID"
        value={selectedItem.student_id}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="course_id"
        placeholder="Course ID"
        value={selectedItem.course_id}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="semester_id"
        placeholder="Semester ID"
        value={selectedItem.semester_id}
        onChange={handleChange}
        required
      />
      <FormInput
        type="date"
        name="registration_date"
        placeholder="Registration Date"
        value={selectedItem.registration_date}
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

  const handleUpdateRegistration = async (registrationId, newStatus) => {
    try {
      const response = await updateCourseRegistration(registrationId, { registration_status: newStatus });
      return {
        success: true,
        message: response.data.message,
        feeDetails: response.data.feeDetails
      };
    } catch (error) {
      console.error('Error updating registration:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update registration.'
      };
    }
  };

  return (
    <DataManagement
      title="Course Registration"
      fetchData={fetchCourseRegistrations}
      addData={addCourseRegistration}
      updateData={updateCourseRegistration}
      deleteData={deleteCourseRegistration}
      initialDataState={initialRegistrationState}
      columns={columns}
      renderForm={renderForm}
      onCustomAction={handleUpdateRegistration}
    />
  );
};

export default CourseRegistrationManagement;
