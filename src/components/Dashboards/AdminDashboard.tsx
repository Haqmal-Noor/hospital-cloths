import React, { useState, useEffect } from 'react';
import { orderAPI, userAPI } from '../../services/api';
import { Users, ShoppingBag, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import OrdersTable from '../Orders/OrdersTable';
import DashboardStats from '../Dashboard/DashboardStats';

interface AdminDashboardProps {
  activeTab: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const [orders, setOrders] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, tailorsData, statsData] = await Promise.all([
        orderAPI.getOrders({ 
          status: activeTab === 'pending-orders' ? 'pending' : 'all',
          limit: 20 
        }),
        userAPI.getTailors(),
        userAPI.getDashboardStats()
      ]);

      setOrders(ordersData.orders);
      setTailors(tailorsData.tailors);
      setStats(statsData.stats);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTailor = async (orderId: string, tailorId: string) => {
    try {
      await orderAPI.assignTailor(orderId, tailorId);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to assign tailor:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome to the admin control panel
        </div>
      </div>

      <DashboardStats 
        stats={[
          { 
            title: 'Total Orders', 
            value: stats.totalOrders || 0, 
            icon: ShoppingBag, 
            color: 'blue',
            trend: '+12%'
          },
          { 
            title: 'Pending Orders', 
            value: stats.pendingOrders || 0, 
            icon: Clock, 
            color: 'amber',
            trend: '+3%'
          },
          { 
            title: 'Completed Orders', 
            value: stats.completedOrders || 0, 
            icon: CheckCircle, 
            color: 'green',
            trend: '+8%'
          },
          { 
            title: 'Active Tailors', 
            value: stats.totalTailors || 0, 
            icon: Users, 
            color: 'purple',
            trend: '+2'
          }
        ]}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        </div>
        <OrdersTable 
          orders={orders.slice(0, 5)} 
          tailors={tailors}
          onAssignTailor={handleAssignTailor}
          showActions={true}
        />
      </div>
    </div>
  );

  const renderAllOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
        <div className="text-sm text-gray-500">
          Total: {orders.length} orders
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <OrdersTable 
          orders={orders} 
          tailors={tailors}
          onAssignTailor={handleAssignTailor}
          showActions={true}
        />
      </div>
    </div>
  );

  const renderPendingOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pending Orders</h1>
        <div className="text-sm text-gray-500">
          {orders.length} orders awaiting assignment
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <OrdersTable 
          orders={orders} 
          tailors={tailors}
          onAssignTailor={handleAssignTailor}
          showActions={true}
        />
      </div>
    </div>
  );

  const renderTailors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tailors Management</h1>
        <div className="text-sm text-gray-500">
          {tailors.length} active tailors
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tailors.map((tailor: any) => (
          <div key={tailor._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{tailor.name}</h3>
                <p className="text-sm text-gray-500">{tailor.email}</p>
                {tailor.phone && (
                  <p className="text-sm text-gray-500">{tailor.phone}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="text-sm text-gray-500">
          Business insights and metrics
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium">{stats.pendingOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium">{stats.completedOrders || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Tailors</span>
              <span className="text-sm font-medium">{stats.totalTailors || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-medium">
                {stats.totalOrders ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
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
    case 'dashboard':
      return renderDashboard();
    case 'all-orders':
      return renderAllOrders();
    case 'pending-orders':
      return renderPendingOrders();
    case 'tailors':
      return renderTailors();
    case 'analytics':
      return renderAnalytics();
    default:
      return renderDashboard();
  }
};

export default AdminDashboard;