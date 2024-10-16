// frontend-dkmhhp/src/components/CourseManagement/CourseManagement.js

import React, { useState, useEffect } from 'react';
import './CourseManagement.css';
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Notification from '../common/Notification/Notification';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import Spinner from '../common/Spinner';
import Table from '../common/Table';
import ConfirmationDialog from '../common/ConfirmationDialog';

const initialCourseState = {
  course_id: '',
  course_name: '',
  credits_num: '',
  lesson_num: '',
  course_type: '',
  department_id: ''
};

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(initialCourseState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showNotification('Failed to load courses.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCourse(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (course = null) => {
    if (course) {
      setSelectedCourse(course);
      setIsEditing(true);
    } else {
      setSelectedCourse(initialCourseState);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateCourse(selectedCourse.course_id, selectedCourse);
        showNotification('Course updated successfully!', 'success');
      } else {
        await addCourse(selectedCourse);
        showNotification('Course added successfully!', 'success');
      }
      await loadCourses();
      setIsModalOpen(false);
      setSelectedCourse(initialCourseState);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving course:', error);
      showNotification('Failed to save course.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (courseToDelete) {
      setIsLoading(true);
      try {
        await deleteCourse(courseToDelete);
        await loadCourses();
        showNotification('Course deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting course:', error);
        showNotification('Failed to delete course. The course may have related data.', 'error');
      } finally {
        setIsLoading(false);
        setIsConfirmDialogOpen(false);
        setCourseToDelete(null);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(initialCourseState);
    setIsEditing(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const renderCourseForm = () => (
    <form onSubmit={handleSubmit}>
      <FormInput
        type="text"
        name="course_id"
        placeholder="Course ID"
        value={selectedCourse.course_id}
        onChange={handleChange}
        required
        disabled={isEditing}
      />
      <FormInput
        type="text"
        name="course_name"
        placeholder="Course Name"
        value={selectedCourse.course_name}
        onChange={handleChange}
        required
      />
      <FormInput
        type="number"
        name="credits_num"
        placeholder="Credits"
        value={selectedCourse.credits_num}
        onChange={handleChange}
        required
      />
      <FormInput
        type="number"
        name="lesson_num"
        placeholder="Lesson"
        value={selectedCourse.lesson_num}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="course_type"
        placeholder="Course Type"
        value={selectedCourse.course_type}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="department_id"
        placeholder="Department ID"
        value={selectedCourse.department_id}
        onChange={handleChange}
        required
      />
      <div className="form-actions">
        <Button type="submit" className="submit-btn">
          {isEditing ? 'Update Course' : 'Add Course'}
        </Button>
        <Button onClick={closeModal} className="cancel-btn">
          Cancel
        </Button>
      </div>
    </form>
  );

  const columns = [
    { key: 'course_id', title: 'Course ID' },
    { key: 'course_name', title: 'Course Name' },
    { key: 'credits_num', title: 'Credits' },
    { key: 'lesson_num', title: 'Lesson' },
    { key: 'course_type', title: 'Course Type' },
    { key: 'department_id', title: 'Department ID' },
  ];

  return (
    <div className="course-management-container">
      {isLoading && <Spinner />}
      <div className="course-management-content">
        <div className="course-list">
          <div className="list-header">
            <h3>Course List</h3>
            <Button icon={faPlus} className="add-btn" onClick={() => openModal()}>
              Add Course
            </Button>
          </div>
          <Table
            columns={columns}
            data={courses}
            onEdit={openModal}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Edit Course' : 'Add New Course'}
      >
        {renderCourseForm()}
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
        onConfirm={confirmDeleteCourse}
        message="Are you sure you want to delete this course?"
        title="Confirm Deletion"
      />
    </div>
  );
};

export default CourseManagement;
