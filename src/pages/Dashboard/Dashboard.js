// frontend-dkmhhp/src/pages/Dashboard/Dashboard.js

import React, { useState } from 'react';
import './Dashboard.css';
import StudentManagement from '../../components/StudentManagement';
import CourseManagement from '../../components/CourseManagement';
import CourseRegistration from '../../components/CourseRegistration';
import TuitionCalculation from '../../components/TuitionCalculation';
import TuitionPayment from '../../components/TuitionPayment';
import TuitionSummary from '../../components/TuitionSummary';
import DebtList from '../../components/DebtList';
import Layout from '../../components/Layout';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('StudentManagement');

  const renderSection = () => {
    switch (activeSection) {
      case 'StudentManagement':
        return <StudentManagement />;
      case 'CourseManagement':
        return <CourseManagement />;
      case 'CourseRegistration':
        return <CourseRegistration />;
      case 'TuitionCalculation':
        return <TuitionCalculation />;
      case 'TuitionPayment':
        return <TuitionPayment />;
      case 'TuitionSummary':
        return <TuitionSummary />;
      case 'DebtList':
        return <DebtList />;
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
            <li onClick={() => setActiveSection('CourseRegistration')}>Course Registration</li>
            <li onClick={() => setActiveSection('TuitionCalculation')}>Tuition Calculation</li>
            <li onClick={() => setActiveSection('TuitionPayment')}>Tuition Payment</li>
            <li onClick={() => setActiveSection('TuitionSummary')}>Tuition Summary</li>
            <li onClick={() => setActiveSection('DebtList')}>Debt List</li>
          </ul>
        </aside>
        <section className="dashboard-content">
          {renderSection()}
        </section>
      </div>
  );
};

export default Dashboard;