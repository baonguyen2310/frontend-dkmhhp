// frontend-dkmhhp/src/pages/Dashboard/Dashboard.js

import React, { useState } from 'react';
import './Dashboard.css';
import StudentManagement from '../../components/StudentManagement';
import CourseManagement from '../../components/CourseManagement';
import CourseRegistrationManagement from '../../components/CourseRegistrationManagement';
import FeeManagement from '../../components/FeeManagement/FeeManagement';
import PaymentManagement from '../../components/PaymentManagement';
import UnpaidStudentsReport from '../../components/UnpaidStudentsReport';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faClipboardList, faMoneyBill, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

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
      case 'PaymentManagement':
        return <PaymentManagement />;
      case 'UnpaidStudentsReport':
        return <UnpaidStudentsReport />;
      default:
        return <StudentManagement />;
    }
  };

  const menuItems = [
    { id: 'StudentManagement', icon: faUser, label: 'Student Management' },
    { id: 'CourseManagement', icon: faBook, label: 'Course Management' },
    { id: 'CourseRegistrationManagement', icon: faClipboardList, label: 'Course Registration' },
    { id: 'FeeManagement', icon: faMoneyBill, label: 'Fee Management' },
    { id: 'PaymentManagement', icon: faMoneyBill, label: 'Payment Management' },
    { id: 'UnpaidStudentsReport', icon: faExclamationTriangle, label: 'Unpaid Students' },
  ];

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={activeSection === item.id ? 'active' : ''}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>
      <main className="dashboard-content">
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;
