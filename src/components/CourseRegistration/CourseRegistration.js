// frontend-dkmhhp/src/components/CourseRegistration/CourseRegistration.js

import React, { useState, useEffect } from 'react';
import './CourseRegistration.css';
import { fetchCourses, fetchStudents, registerCourse } from '../../services/api'; // Import các hàm API

const CourseRegistration = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [registrationData, setRegistrationData] = useState({
    studentId: '',
    courseId: '',
    semesterId: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [studentsData, coursesData] = await Promise.all([fetchStudents(), fetchCourses()]);
        setStudents(studentsData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load students or courses.');
      }
    };

    loadInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({
      ...registrationData,
      [name]: value
    });
  };

  const handleRegisterCourse = async (e) => {
    e.preventDefault();
    try {
      await registerCourse(registrationData);
      setSuccessMessage('Course registered successfully!');
      setError(null);
    } catch (error) {
      console.error('Error registering course:', error);
      setError('Failed to register course.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="course-registration-container">
      <h2>Course Registration</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleRegisterCourse}>
        <select name="studentId" value={registrationData.studentId} onChange={handleChange} required>
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.studentId} value={student.studentId}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>
        <select name="courseId" value={registrationData.courseId} onChange={handleChange} required>
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="semesterId"
          placeholder="Semester ID"
          value={registrationData.semesterId}
          onChange={handleChange}
          required
        />
        <button type="submit">Register Course</button>
      </form>
    </div>
  );
};

export default CourseRegistration;