import React, { useState, useEffect } from 'react';
import { getUnpaidStudents, sendUnpaidStudentsReport } from '../../services/api/fee';
import { fetchStudents } from '../../services/api/students';
import './UnpaidStudentsReport.css';
// ... other imports ...

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const UnpaidStudentsReport = () => {
  const [unpaidStudents, setUnpaidStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      // Fetch both unpaid students and all students data
      const [unpaidData, studentsData] = await Promise.all([
        getUnpaidStudents(),
        fetchStudents()
      ]);

      // Create a map of students for faster lookup
      const studentMap = new Map(
        studentsData.map(student => [student.student_id, student])
      );

      // Combine the data
      const combinedData = unpaidData.map(unpaidStudent => {
        const studentInfo = studentMap.get(unpaidStudent.student_id);
        return {
          ...unpaidStudent,
          class_id: studentInfo ? studentInfo.class_id : 'N/A'
        };
      });

      setUnpaidStudents(combinedData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReport = async () => {
    try {
      setIsLoading(true);
      await sendUnpaidStudentsReport();
      alert('Report sent successfully to the finance department.');
    } catch (error) {
      console.error('Error sending report:', error);
      setError('Failed to send report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="unpaid-students-report">
      <h2>Unpaid Students Report</h2>
      <button 
        onClick={handleSendReport} 
        disabled={isLoading} 
        className="action-button send-report-btn"
      >
        <FontAwesomeIcon icon={faPaperPlane} /> Send Report to Finance Department
      </button>
      <table className="unpaid-students-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Semester</th>
            <th>Tuition Fee</th>
            <th>Amount Paid</th>
            <th>Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {unpaidStudents.map(student => (
            <tr key={`${student.student_id}-${student.semester_id}`}>
              <td>{student.student_id}</td>
              <td>{`${student.last_name} ${student.first_name}`}</td>
              <td>{student.class_id}</td>
              <td>{student.semester_id}</td>
              <td>${student.tuition_fee.toFixed(2)}</td>
              <td>${student.amount_paid.toFixed(2)}</td>
              <td>${student.remaining_balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnpaidStudentsReport;
