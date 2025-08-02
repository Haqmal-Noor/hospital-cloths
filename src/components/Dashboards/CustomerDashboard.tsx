import React, { useState, useEffect } from "react";
import { orderAPI, userAPI } from "../../services/api";
import { ShoppingBag, Clock, CheckCircle } from "lucide-react";
import OrderForm from "../Orders/OrderForm";
import OrdersTable from "../Orders/OrdersTable";
import DashboardStats from "../Dashboard/DashboardStats";

interface CustomerDashboardProps {
  activeTab: string;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ activeTab }) => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statusFilter = activeTab === "completed" ? "completed" : "all";
      const [ordersData, statsData] = await Promise.all([
        orderAPI.getOrders({ status: statusFilter }),
        userAPI.getDashboardStats(),
      ]);

      setOrders(ordersData.orders);
      setStats(statsData.stats);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCreate = async (orderData: any) => {
    try {
      await orderAPI.createOrder(orderData);
      fetchData(); // Refresh data
      return true;
    } catch (error) {
      console.error("Failed to create order:", error);
      return false;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">دشبورد مشتری</h1>
        <div className="text-sm text-gray-500">سفارشات کالای تان را اینجا تعقیب کنید</div>
      </div>

      <DashboardStats
        stats={[
          {
            title: "سفارشات مجموعی",
            value: stats.totalOrders || 0,
            icon: ShoppingBag,
            color: "blue",
            trend: ""
          },
          {
            title: "سفارشات در حال جریان",
            value: stats.pendingOrders || 0,
            icon: Clock,
            color: "amber",
            trend: "",
          },
          {
            title: "سفارشات تکمیل شده",
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
        <OrdersTable orders={orders.slice(0, 5)} showActions={false} />
      </div>
    </div>
  );

  const renderPlaceOrder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Place New Order</h1>
        <div className="text-sm text-gray-500">
          Create a custom clothing order
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <OrderForm onSubmit={handleOrderCreate} isVisitor={false} />
      </div>
    </div>
  );

  const renderMyOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <div className="text-sm text-gray-500">
          Total: {orders.length} orders
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <OrdersTable orders={orders} showActions={false} />
      </div>
    </div>
  );

  const renderCompleted = () => {
    const completedOrders = orders.filter(
      (order: any) => order.status === "completed"
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Completed Orders</h1>
          <div className="text-sm text-gray-500">
            {completedOrders.length} completed orders
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <OrdersTable orders={completedOrders} showActions={false} />
        </div>
      </div>
    );
  };

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
    case "place-order":
      return renderPlaceOrder();
    case "my-orders":
      return renderMyOrders();
    case "completed":
      return renderCompleted();
    default:
      return renderDashboard();
  }
};

export default CustomerDashboard;
