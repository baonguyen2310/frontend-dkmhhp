// frontend-dkmhhp/src/components/StudentManagement/StudentManagement.js

import React from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import { fetchStudents, addStudent, updateStudent, deleteStudent } from '../../services/api';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialStudentState = {
  student_id: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  hometown: '',
  priority: '',
  contact_address: ''
};

const StudentManagement = () => {
  const columns = [
    { key: 'student_id', title: 'Student ID' },
    { key: 'first_name', title: 'First Name' },
    { key: 'last_name', title: 'Last Name' },
    { key: 'date_of_birth', title: 'Date of Birth', render: (student) => new Date(student.date_of_birth).toLocaleDateString() },
    { key: 'gender', title: 'Gender' },
    { key: 'hometown', title: 'Hometown' },
    { key: 'priority', title: 'Priority' },
    { key: 'contact_address', title: 'Contact Address' },
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
        disabled={isEditing}
      />
      <FormInput
        type="text"
        name="first_name"
        placeholder="First Name"
        value={selectedItem.first_name}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={selectedItem.last_name}
        onChange={handleChange}
        required
      />
      <FormInput
        type="date"
        name="date_of_birth"
        placeholder="Date of Birth"
        value={selectedItem.date_of_birth}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="gender"
        placeholder="Gender"
        value={selectedItem.gender}
        onChange={handleChange}
      />
      <FormInput
        type="text"
        name="hometown"
        placeholder="Hometown"
        value={selectedItem.hometown}
        onChange={handleChange}
      />
      <FormInput
        type="text"
        name="priority"
        placeholder="Priority"
        value={selectedItem.priority}
        onChange={handleChange}
      />
      <FormInput
        type="text"
        name="contact_address"
        placeholder="Contact Address"
        value={selectedItem.contact_address}
        onChange={handleChange}
      />
      <div className="form-actions">
        <Button type="submit" className="submit-btn">
          {isEditing ? 'Update Student' : 'Add Student'}
        </Button>
        <Button onClick={closeModal} className="cancel-btn">
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <DataManagement
      title="Student"
      fetchData={fetchStudents}
      addData={addStudent}
      updateData={updateStudent}
      deleteData={deleteStudent}
      initialDataState={initialStudentState}
      columns={columns}
      renderForm={renderForm}
    />
  );
};

export default StudentManagement;
