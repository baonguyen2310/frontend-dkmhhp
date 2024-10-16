// frontend-dkmhhp/src/pages/Dashboard/Dashboard.js

import React, { useState } from 'react';
import './Dashboard.css';
import StudentManagement from '../../components/StudentManagement';
import CourseManagement from '../../components/CourseManagement';
import CourseRegistrationManagement from '../../components/CourseRegistrationManagement';
import FeeManagement from '../../components/FeeManagement';
import UnpaidStudentsReport from '../../components/UnpaidStudentsReport';
import Layout from '../../components/Layout';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('StudentManagement');

  const renderSection = () => {
    switch (activeSection) {
      case 'StudentManagement':
        return <StudentManagement />;
      case 'CourseManagement':
        return <CourseManagement />;
      case 'CourseRegistrationManagement':
        return <CourseRegistrationManagement />;
      case 'FeeManagement':
        return <FeeManagement />;
      case 'UnpaidStudentsReport':
        return <UnpaidStudentsReport />;
      default:
        return <StudentManagement />;
    }
  };

  return (
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <ul>
            <li onClick={() => setActiveSection('StudentManagement')}>Student Management</li>
            <li onClick={() => setActiveSection('CourseManagement')}>Course Management</li>
            <li onClick={() => setActiveSection('CourseRegistrationManagement')}>Course Registration Management</li>
            <li onClick={() => setActiveSection('FeeManagement')}>Fee Management</li>
            <li onClick={() => setActiveSection('UnpaidStudentsReport')}>Unpaid Students Report</li>
          </ul>
        </aside>
        <section className="dashboard-content">
          {renderSection()}
        </section>
      </div>
  );
};

export default Dashboard;