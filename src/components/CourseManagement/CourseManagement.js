// frontend-dkmhhp/src/components/CourseManagement/CourseManagement.js

import React, { useState, useEffect } from 'react';
import './CourseManagement.css';
import { fetchCourses, addCourse } from '../../services/api'; // Import các hàm API

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    credits: '',
    courseType: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses.');
      }
    };

    loadCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const addedCourse = await addCourse(newCourse);
      setCourses([...courses, addedCourse]);
      setNewCourse({ courseName: '', credits: '', courseType: '' });
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course.');
    }
  };

  return (
    <div className="course-management-container">
      <h2>Course Management</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAddCourse}>
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={newCourse.courseName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="credits"
          placeholder="Credits"
          value={newCourse.credits}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="courseType"
          placeholder="Course Type"
          value={newCourse.courseType}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Course</button>
      </form>
      <div className="course-list">
        {courses.map((course, index) => (
          <div key={index} className="course-item">
            <h3>{course.courseName}</h3>
            <p>Credits: {course.credits}</p>
            <p>Type: {course.courseType}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;