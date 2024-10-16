// frontend-dkmhhp/src/components/CourseManagement/CourseManagement.js

import React from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '../../services/api';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialCourseState = {
  course_id: '',
  course_name: '',
  credits_num: '',
  lesson_num: '',
  course_type: '',
  department_id: ''
};

const CourseManagement = () => {
  const columns = [
    { key: 'course_id', title: 'Course ID' },
    { key: 'course_name', title: 'Course Name' },
    { key: 'credits_num', title: 'Credits' },
    { key: 'lesson_num', title: 'Lesson' },
    { key: 'course_type', title: 'Course Type' },
    { key: 'department_id', title: 'Department ID' },
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
      />
      <FormInput
        type="number"
        name="lesson_num"
        placeholder="Lesson"
        value={selectedItem.lesson_num}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="course_type"
        placeholder="Course Type"
        value={selectedItem.course_type}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="department_id"
        placeholder="Department ID"
        value={selectedItem.department_id}
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

  return (
    <DataManagement
      title="Course"
      fetchData={fetchCourses}
      addData={addCourse}
      updateData={updateCourse}
      deleteData={deleteCourse}
      initialDataState={initialCourseState}
      columns={columns}
      renderForm={renderForm}
      disableAdd={true}
    />
  );
};

export default CourseManagement;
