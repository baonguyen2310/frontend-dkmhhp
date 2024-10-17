import React, { useState, useEffect } from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import {
  fetchCourseRegistrations,
  addCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration,
  fetchStudents,
  fetchCourses
} from '../../services/api';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialRegistrationState = {
  student_id: '',
  course_id: '',
  semester_id: '',
  registration_date: new Date().toISOString().split('T')[0],
  registration_status: 'Pending'
};

const handleError = (error) => {
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.message || 'An error occurred';
    console.error(errorMessage);
  } else {
    console.error('An unexpected error occurred');
  }
};

const CourseRegistrationManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedStudents, fetchedCourses] = await Promise.all([
          fetchStudents(),
          fetchCourses()
        ]);
        setStudents(fetchedStudents);
        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
        handleError(error);
      }
    };
    loadData();
  }, []);

  const columns = [
    { key: 'registration_id', title: 'Registration ID' },
    { 
      key: 'student_id', 
      title: 'Student', 
      render: (registration) => {
        const student = students.find(s => s.student_id === registration.student_id);
        return student ? `${student.first_name} ${student.last_name}` : registration.student_id;
      }
    },
    { 
      key: 'course_id', 
      title: 'Course', 
      render: (registration) => {
        const course = courses.find(c => c.course_id === registration.course_id);
        return course ? course.course_name : registration.course_id;
      }
    },
    { key: 'semester_id', title: 'Semester ID' },
    { key: 'registration_date', title: 'Registration Date', render: (registration) => new Date(registration.registration_date).toLocaleDateString() },
    { key: 'registration_status', title: 'Status' }
  ];

  const renderForm = ({ handleSubmit, handleChange, selectedItem, isEditing, closeModal }) => (
    <form onSubmit={handleSubmit}>
      <FormInput
        type="select"
        name="student_id"
        placeholder="Student"
        value={selectedItem.student_id}
        onChange={handleChange}
        options={students.map(s => ({ value: s.student_id, label: `${s.first_name} ${s.last_name}` }))}
        required
      />
      <FormInput
        type="select"
        name="course_id"
        placeholder="Course"
        value={selectedItem.course_id}
        onChange={handleChange}
        options={courses.map(c => ({ value: c.course_id, label: c.course_name }))}
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
      <FormInput
        type="select"
        name="registration_status"
        placeholder="Status"
        value={selectedItem.registration_status}
        onChange={handleChange}
        options={[
          { value: 'Pending', label: 'Pending' },
          { value: 'Confirmed', label: 'Confirmed' },
          { value: 'Cancelled', label: 'Cancelled' }
        ]}
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
      idField="registration_id"
      handleError={handleError}
    />
  );
};

export default CourseRegistrationManagement;
