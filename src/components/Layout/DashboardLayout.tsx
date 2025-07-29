import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminDashboard from "../Dashboards/AdminDashboard";
import VisitorDashboard from "../Dashboards/VisitorDashboard";
import CustomerDashboard from "../Dashboards/CustomerDashboard";
import TailorDashboard from "../Dashboards/TailorDashboard";

import Navbar from "./Navbar";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderDashboard = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard activeTab={activeTab} />;
      case "visitor":
        return <VisitorDashboard activeTab={activeTab} />;
      case "customer":
        return <CustomerDashboard activeTab={activeTab} />;
      case "tailor":
        return <TailorDashboard activeTab={activeTab} />;
      default:
        return <div>Unauthorized access</div>;
    }
  };

  return (
    <SidebarProvider>
      {/* Main content first */}
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">
        {/* <TriggerButton /> */}
        <Navbar />
        {renderDashboard()}
      </main>

      {/* Sidebar fixed on the right */}
    </SidebarProvider>
  );
};

export default DashboardLayout;
