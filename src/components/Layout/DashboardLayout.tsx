import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AdminDashboard from '../Dashboards/AdminDashboard';
import VisitorDashboard from '../Dashboards/VisitorDashboard';
import CustomerDashboard from '../Dashboards/CustomerDashboard';
import TailorDashboard from '../Dashboards/TailorDashboard';

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard activeTab={activeTab} />;
      case 'visitor':
        return <VisitorDashboard activeTab={activeTab} />;
      case 'customer':
        return <CustomerDashboard activeTab={activeTab} />;
      case 'tailor':
        return <TailorDashboard activeTab={activeTab} />;
      default:
        return <div>Unauthorized access</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;