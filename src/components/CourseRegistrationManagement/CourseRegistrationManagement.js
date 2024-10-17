import React, { useState, useEffect } from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import Modal from '../common/Modal/Modal';
import {
  fetchCourseRegistrations,
  addCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration,
  finalizeCourseRegistration,
  fetchRegistrationSummary
} from '../../services/api/courseRegistration';
import { fetchStudents } from '../../services/api/students';
import { fetchCourses } from '../../services/api/courses';
import { fetchSemesters } from '../../services/api/semester';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const CourseRegistrationManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationSummary, setRegistrationSummary] = useState(null);

  const handleError = (error) => {
    console.error('An error occurred:', error);
    alert('An error occurred. Please try again.');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedStudents, fetchedCourses, fetchedSemesters] = await Promise.all([
          fetchStudents(),
          fetchCourses(),
          fetchSemesters()
        ]);
        setStudents(fetchedStudents);
        setCourses(fetchedCourses);
        setSemesters(fetchedSemesters);
      } catch (error) {
        console.error('Error fetching data:', error);
        handleError(error);
      }
    };
    loadData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleFetchSummary = async () => {
    if (!selectedStudentId || !selectedSemesterId) {
      alert('Please select both a student and a semester.');
      return;
    }

    try {
      const summary = await fetchRegistrationSummary(selectedStudentId, selectedSemesterId);
      setRegistrationSummary(summary);
    } catch (error) {
      console.error('Error fetching registration summary:', error);
      handleError(error);
      alert('Failed to fetch registration summary. Please try again.');
    }
  };

  const handleFinalize = async () => {
    if (!selectedStudentId || !selectedSemesterId) {
      alert('Please select both a student and a semester.');
      return;
    }

    try {
      const result = await finalizeCourseRegistration(selectedStudentId, selectedSemesterId);
      console.log('Course registration finalized:', result);
      alert('Course registration finalized successfully. Tuition fee has been calculated.');
      setIsModalOpen(false);
      // Refresh the course registrations data
      // You might want to call a function here to refresh the data in DataManagement
    } catch (error) {
      console.error('Error finalizing course registration:', error);
      handleError(error);
      alert('Failed to finalize course registration. Please try again.');
    }
  };

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
    <div>
      <h2>Course Registration Management</h2>
      <Button onClick={handleOpenModal} className="finalize-btn">
        Finalize Registration
      </Button>
      <DataManagement
        title="Course Registration"
        fetchData={fetchCourseRegistrations}
        addData={addCourseRegistration}
        updateData={updateCourseRegistration}
        deleteData={deleteCourseRegistration}
        initialDataState={{}} // Define your initial state here
        columns={columns}
        renderForm={renderForm}
        idField="registration_id"
        handleError={handleError}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Finalize Course Registration</h3>
        <FormInput
          type="select"
          name="student_id"
          placeholder="Select Student"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          options={students.map(s => ({ value: s.student_id, label: `${s.first_name} ${s.last_name}` }))}
        />
        <FormInput
          type="select"
          name="semester_id"
          placeholder="Select Semester"
          value={selectedSemesterId}
          onChange={(e) => setSelectedSemesterId(e.target.value)}
          options={semesters.map(s => ({ value: s.semester_id, label: s.semester_name }))}
        />
        <Button onClick={handleFetchSummary} className="fetch-summary-btn">
          Fetch Summary
        </Button>
        {registrationSummary && (
          <div>
            <h4>Registration Summary</h4>
            <p>Student: {registrationSummary.studentName}</p>
            <p>Semester: {registrationSummary.semesterName}</p>
            <p>Total Courses: {registrationSummary.totalCourses}</p>
            <p>Total Credits: {registrationSummary.totalCredits}</p>
            <p>Estimated Tuition Fee: ${registrationSummary.estimatedTuitionFee}</p>
          </div>
        )}
        <Button onClick={handleFinalize} className="confirm-btn" disabled={!registrationSummary}>
          Confirm and Finalize
        </Button>
        <Button onClick={() => setIsModalOpen(false)} className="cancel-btn">
          Cancel
        </Button>
      </Modal>
    </div>
  );
};

export default CourseRegistrationManagement;
