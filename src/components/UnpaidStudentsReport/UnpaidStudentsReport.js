import React, { useState, useEffect } from 'react';
import { getUnpaidStudents, sendUnpaidStudentsReport } from '../../services/api/fee';
import './UnpaidStudentsReport.css';
// ... other imports ...

const UnpaidStudentsReport = () => {
  const [unpaidStudents, setUnpaidStudents] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    // Fetch semesters list
    // This is a placeholder. You need to implement the API to fetch semesters.
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    // Implement this function to fetch semesters from your API
    // setSemesters(fetchedSemesters);
  };

  const handleFetchUnpaidStudents = async () => {
    try {
      const students = await getUnpaidStudents(selectedSemester);
      setUnpaidStudents(students);
    } catch (error) {
      console.error('Error fetching unpaid students:', error);
      // Show error notification
    }
  };

  const handleSendReport = async () => {
    try {
      await sendUnpaidStudentsReport(selectedSemester);
      // Show success notification
    } catch (error) {
      console.error('Error sending unpaid students report:', error);
      // Show error notification
    }
  };

  return (
    <div className="unpaid-students-report">
      <h2>Unpaid Students Report</h2>
      <div className="controls">
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {semesters.map(semester => (
            <option key={semester.semester_id} value={semester.semester_id}>
              {semester.semester_name}
            </option>
          ))}
        </select>
        <button onClick={handleFetchUnpaidStudents}>Fetch Unpaid Students</button>
        <button onClick={handleSendReport}>Send Report to Academic Affairs</button>
      </div>

      <table className="unpaid-students-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Tuition Fee</th>
            <th>Amount Paid</th>
            <th>Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {unpaidStudents.map(student => (
            <tr key={student.student_id}>
              <td>{student.student_id}</td>
              <td>{`${student.last_name} ${student.first_name}`}</td>
              <td>{student.tuition_fee}</td>
              <td>{student.amount_paid}</td>
              <td>{student.remaining_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnpaidStudentsReport;
