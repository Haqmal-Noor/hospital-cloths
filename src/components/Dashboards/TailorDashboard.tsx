import React, { useState, useEffect } from "react";
import { orderAPI, userAPI } from "../../services/api";
import { Scissors, Clock, CheckCircle, AlertCircle } from "lucide-react";
import OrdersTable from "../Orders/OrdersTable";
import DashboardStats from "../Dashboard/DashboardStats";

interface TailorDashboardProps {
  activeTab: string;
}

const TailorDashboard: React.FC<TailorDashboardProps> = ({ activeTab }) => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let statusFilter = "all";
      if (activeTab === "in-progress") statusFilter = "in-progress";
      if (activeTab === "completed") statusFilter = "completed";
      if (activeTab === "assigned-orders") statusFilter = "assigned";

      const [ordersData, statsData] = await Promise.all([
        orderAPI.getOrders({ status: statusFilter }),
        userAPI.getDashboardStats(),
      ]);

      setOrders(ordersData.orders);
      setStats(statsData.stats);
    } catch (error) {
      console.error("Failed to fetch tailor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    status: string,
    note?: string
  ) => {
    try {
      await orderAPI.updateStatus(orderId, status, note);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">دشبور خیاط</h1>
        <div className="text-sm text-gray-500">سفارشات اختصاص یافته تان را اینجا مدیریت کنید</div>
      </div>

      <DashboardStats
        stats={[
          {
            title: "Total Orders",
            value: stats.totalOrders || 0,
            icon: Scissors,
            color: "blue",
            trend: "",
          },
          {
            title: "Pending Orders",
            value: stats.pendingOrders || 0,
            icon: Clock,
            color: "amber",
            trend: "",
          },
          {
            title: "Completed Orders",
            value: stats.completedOrders || 0,
            icon: CheckCircle,
            color: "green",
            trend: "",
          },
        ]}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">سفارشات اخیر</h2>
        </div>
        <OrdersTable
          orders={orders.slice(0, 5)}
          showActions={true}
          onStatusUpdate={handleStatusUpdate}
          userRole="tailor"
        />
      </div>
    </div>
  );

  const renderAssignedOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">سفارشات اختصاص شده</h1>
        <div className="text-sm text-gray-500">
          سفارش به شما اختصاص یافته {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <OrdersTable
          orders={orders}
          showActions={true}
          onStatusUpdate={handleStatusUpdate}
          userRole="tailor"
        />
      </div>
    </div>
  );

  const renderInProgress = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">سفارشات در حال جریان</h1>
        <div className="text-sm text-gray-500">
         سفارش در حال جریان {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <OrdersTable
          orders={orders}
          showActions={true}
          onStatusUpdate={handleStatusUpdate}
          userRole="tailor"
        />
      </div>
    </div>
  );

  const renderCompleted = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">سفارشات تکمیل شده</h1>
        <div className="text-sm text-gray-500">
         سفارش تکمیل شده {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <OrdersTable orders={orders} showActions={false} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  switch (activeTab) {
    case "dashboard":
      return renderDashboard();
    case "assigned-orders":
      return renderAssignedOrders();
    case "in-progress":
      return renderInProgress();
    case "completed":
      return renderCompleted();
    default:
      return renderDashboard();
  }
};

export default TailorDashboard;
