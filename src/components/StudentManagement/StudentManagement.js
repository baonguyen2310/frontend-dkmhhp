// frontend-dkmhhp/src/components/StudentManagement/StudentManagement.js

import React, { useState, useEffect } from 'react';
import './StudentManagement.css';
import { fetchStudents, addStudent, updateStudent, deleteStudent } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Notification from '../common/Notification/Notification';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import Spinner from '../common/Spinner';
import Table from '../common/Table';
import ConfirmationDialog from '../common/ConfirmationDialog';

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
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(initialStudentState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      showNotification('Failed to load students.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent(prev => ({ ...prev, [name]: value }));
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const openModal = (student = null) => {
    if (student) {
      setSelectedStudent({
        ...student,
        date_of_birth: formatDateForInput(student.date_of_birth)
      });
      setIsEditing(true);
    } else {
      setSelectedStudent(initialStudentState);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const studentData = {
        ...selectedStudent,
        date_of_birth: new Date(selectedStudent.date_of_birth).toISOString()
      };
      if (isEditing) {
        await updateStudent(studentData.student_id, studentData);
        showNotification('Student updated successfully!', 'success');
      } else {
        await addStudent(studentData);
        showNotification('Student added successfully!', 'success');
      }
      await loadStudents();
      setIsModalOpen(false);
      setSelectedStudent(initialStudentState);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving student:', error);
      showNotification('Failed to save student.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (studentId) => {
    setStudentToDelete(studentId);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (studentToDelete) {
      setIsLoading(true);
      try {
        await deleteStudent(studentToDelete);
        await loadStudents();
        showNotification('Student deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting student:', error);
        showNotification('Failed to delete student. The student may have related data.', 'error');
      } finally {
        setIsLoading(false);
        setIsConfirmDialogOpen(false);
        setStudentToDelete(null);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(initialStudentState);
    setIsEditing(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const renderStudentForm = () => (
    <form onSubmit={handleSubmit}>
      <FormInput
        type="text"
        name="student_id"
        placeholder="Student ID"
        value={selectedStudent.student_id}
        onChange={handleChange}
        required
        disabled={isEditing}
      />
      <FormInput
        type="text"
        name="first_name"
        placeholder="First Name"
        value={selectedStudent.first_name}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={selectedStudent.last_name}
        onChange={handleChange}
        required
      />
      <FormInput
        type="date"
        name="date_of_birth"
        placeholder="Date of Birth"
        value={selectedStudent.date_of_birth}
        onChange={handleChange}
        required
      />
      <FormInput
        type="text"
        name="gender"
        placeholder="Gender"
        value={selectedStudent.gender}
        onChange={handleChange}
      />
      <FormInput
        type="text"
        name="hometown"
        placeholder="Hometown"
        value={selectedStudent.hometown}
        onChange={handleChange}
      />
      <FormInput
        type="text"
        name="priority"
        placeholder="Priority"
        value={selectedStudent.priority}
        onChange={handleChange}
      />
      <FormInput
        type="text"
        name="contact_address"
        placeholder="Contact Address"
        value={selectedStudent.contact_address}
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

  return (
    <div className="student-management-container">
      {isLoading && <Spinner />}
      <div className="student-management-content">
        <div className="student-list">
          <div className="list-header">
            <h3>Student List</h3>
            <Button icon={faPlus} className="add-btn" onClick={() => openModal()}>
              Add Student
            </Button>
          </div>
          <Table
            columns={columns}
            data={students}
            onEdit={openModal}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Edit Student' : 'Add New Student'}
      >
        {renderStudentForm()}
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
        onConfirm={confirmDeleteStudent}
        message="Are you sure you want to delete this student?"
        title="Confirm Deletion"
      />
    </div>
  );
};

export default StudentManagement;