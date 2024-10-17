// frontend-dkmhhp/src/components/StudentManagement/StudentManagement.js

import React, { useState, useEffect } from 'react';
import DataManagement from '../common/DataManagement/DataManagement';
import { fetchStudents, addStudent, updateStudent, deleteStudent, fetchClasses, fetchFeeDiscounts } from '../../services/api';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialStudentState = {
  student_id: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  hometown: '',
  discount_id: '',
  contact_address: '',
  class_id: ''
};

const handleError = (error) => {
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.message || 'An error occurred';
    // Hiển thị thông báo lỗi cho người dùng (ví dụ: sử dụng một component Toast hoặc Alert)
    console.error(errorMessage);
  } else {
    console.error('An unexpected error occurred');
  }
};

const StudentManagement = () => {
  const [classes, setClasses] = useState([]);
  const [feeDiscounts, setFeeDiscounts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedClasses, fetchedFeeDiscounts] = await Promise.all([
          fetchClasses(),
          fetchFeeDiscounts()
        ]);
        setClasses(fetchedClasses);
        setFeeDiscounts(fetchedFeeDiscounts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadData();
  }, []);

  const columns = [
    { key: 'student_id', title: 'Student ID' },
    { key: 'first_name', title: 'First Name' },
    { key: 'last_name', title: 'Last Name' },
    { key: 'date_of_birth', title: 'Date of Birth', render: (student) => new Date(student.date_of_birth).toLocaleDateString() },
    { key: 'gender', title: 'Gender' },
    { 
      key: 'discount_id', 
      title: 'Fee Discount', 
      render: (student) => {
        const discount = feeDiscounts.find(d => d.discount_id === student.discount_id);
        return discount ? `${discount.discount_type} (${discount.discount_percent}%)` : 'N/A';
      }
    },
    { 
      key: 'class_id', 
      title: 'Class', 
      render: (student) => {
        const classObj = classes.find(c => c.class_id === student.class_id);
        return classObj ? classObj.class_name : 'N/A';
      }
    }
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
        type="select"
        name="gender"
        placeholder="Gender"
        value={selectedItem.gender}
        onChange={handleChange}
        options={[
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' }
        ]}
        required
      />
      <FormInput
        type="text"
        name="hometown"
        placeholder="Hometown"
        value={selectedItem.hometown}
        onChange={handleChange}
      />
      <FormInput
        type="select"
        name="discount_id"
        placeholder="Fee Discount"
        value={selectedItem.discount_id}
        onChange={handleChange}
        options={feeDiscounts.map(d => ({ value: d.discount_id, label: `${d.discount_type} (${d.discount_percent}%)` }))}
      />
      <FormInput
        type="text"
        name="contact_address"
        placeholder="Contact Address"
        value={selectedItem.contact_address}
        onChange={handleChange}
      />
      <FormInput
        type="select"
        name="class_id"
        placeholder="Class"
        value={selectedItem.class_id}
        onChange={handleChange}
        options={classes.map(c => ({ value: c.class_id, label: c.class_name }))}
        required
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
      idField="student_id"
      handleError={handleError}
    />
  );
};

export default StudentManagement;
