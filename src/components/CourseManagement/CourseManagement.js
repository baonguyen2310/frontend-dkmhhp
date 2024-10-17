// frontend-dkmhhp/src/components/CourseManagement/CourseManagement.js

import React from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '../../services/api/courses';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialCourseState = {
  course_id: '',
  course_name: '',
  credits_num: '',
  lesson_num: '',
  course_type: ''
};

const courseTypes = [
  { value: 'Theory', label: 'Theory' },
  { value: 'Practice', label: 'Practice' }
];

const handleError = (error) => {
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.message || 'An error occurred';
    // Display error message to the user (e.g., using a Toast or Alert component)
    console.error(errorMessage);
  } else {
    console.error('An unexpected error occurred');
  }
};

const CourseManagement = () => {
  const columns = [
    { key: 'course_id', title: 'Course ID' },
    { key: 'course_name', title: 'Course Name' },
    { key: 'credits_num', title: 'Credits' },
    { key: 'lesson_num', title: 'Lessons' },
    { key: 'course_type', title: 'Course Type' }
  ];

  const renderForm = ({ handleSubmit, handleChange, selectedItem, isEditing, closeModal }) => (
    <form onSubmit={handleSubmit}>
      <FormInput
        type="text"
        name="course_id"
        placeholder="Course ID"
        value={selectedItem.course_id}
        onChange={handleChange}
        required
        disabled={isEditing}
      />
      <FormInput
        type="text"
        name="course_name"
        placeholder="Course Name"
        value={selectedItem.course_name}
        onChange={handleChange}
        required
      />
      <FormInput
        type="number"
        name="credits_num"
        placeholder="Credits"
        value={selectedItem.credits_num}
        onChange={handleChange}
        required
        min="1"
      />
      <FormInput
        type="number"
        name="lesson_num"
        placeholder="Lessons"
        value={selectedItem.lesson_num}
        onChange={handleChange}
        required
        min="1"
      />
      <FormInput
        type="select"
        name="course_type"
        placeholder="Course Type"
        value={selectedItem.course_type}
        onChange={handleChange}
        options={courseTypes}
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

  const convertToNumbers = (courseData) => {
    return {
      ...courseData,
      credits_num: Number(courseData.credits_num),
      lesson_num: Number(courseData.lesson_num)
    };
  };

  const handleAddCourse = async (courseData) => {
    try {
      const convertedData = convertToNumbers(courseData);
      const response = await addCourse(convertedData);
      return { success: true, message: 'Course added successfully', data: response };
    } catch (error) {
      handleError(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      const convertedData = convertToNumbers(courseData);
      const response = await updateCourse(courseId, convertedData);
      return { success: true, message: 'Course updated successfully', data: response };
    } catch (error) {
      handleError(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      return { success: true, message: 'Course deleted successfully' };
    } catch (error) {
      handleError(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return (
    <DataManagement
      title="Course"
      fetchData={fetchCourses}
      addData={handleAddCourse}
      updateData={handleUpdateCourse}
      deleteData={handleDeleteCourse}
      initialDataState={initialCourseState}
      columns={columns}
      renderForm={renderForm}
      idField="course_id"
      handleError={handleError}
    />
  );
};

export default CourseManagement;
