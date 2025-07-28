import React, { useState, useEffect } from 'react';
import { orderAPI, userAPI } from '../../services/api';
import { Plus, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import OrderForm from '../Orders/OrderForm';
import OrdersTable from '../Orders/OrdersTable';
import DashboardStats from '../Dashboard/DashboardStats';
import { useAuth } from '../../contexts/AuthContext';

interface VisitorDashboardProps {
  activeTab: string;
}

const VisitorDashboard: React.FC<VisitorDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, customersData, statsData] = await Promise.all([
        orderAPI.getOrders(),
        userAPI.getCustomers(),
        userAPI.getDashboardStats()
      ]);

      setOrders(ordersData.orders);
      setCustomers(customersData.customers);
      setStats(statsData.stats);
    } catch (error) {
      console.error('Failed to fetch visitor data:', error);
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
      console.error('Failed to create order:', error);
      return false;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Visitor Dashboard</h1>
        <div className="text-sm text-gray-500">
          Commission Rate: {user?.commissionRate}%
        </div>
      </div>

      <DashboardStats 
        stats={[
          { 
            title: 'Total Orders', 
            value: stats.totalOrders || 0, 
            icon: ShoppingBag, 
            color: 'blue',
            trend: '+5%'
          },
          { 
            title: 'Completed Orders', 
            value: stats.completedOrders || 0, 
            icon: TrendingUp, 
            color: 'green',
            trend: '+8%'
          },
          { 
            title: 'Total Commission', 
            value: `$${(stats.totalCommission || 0).toFixed(2)}`, 
            icon: DollarSign, 
            color: 'emerald',
            trend: '+15%'
          },
          { 
            title: 'Active Customers', 
            value: customers.length, 
            icon: Plus, 
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
          showActions={false}
        />
      </div>
    </div>
  );

  const renderCreateOrder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
        <div className="text-sm text-gray-500">
          Create orders for customers
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <OrderForm 
          customers={customers}
          onSubmit={handleOrderCreate}
          isVisitor={true}
        />
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
        <OrdersTable 
          orders={orders} 
          showActions={false}
        />
      </div>
    </div>
  );

  const renderCommissions = () => {
    const completedOrders = orders.filter((order: any) => order.status === 'completed');
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Commission Summary</h1>
          <div className="text-sm text-gray-500">
            Rate: {user?.commissionRate}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(stats.totalCommission || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Commission</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${completedOrders.length ? ((stats.totalCommission || 0) / completedOrders.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Commission Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedOrders.map((order: any) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.itemDetails.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerId?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${order.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ${(order.price * ((user?.commissionRate || 0) / 100)).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(order.completedAt || order.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    case 'dashboard':
      return renderDashboard();
    case 'create-order':
      return renderCreateOrder();
    case 'my-orders':
      return renderMyOrders();
    case 'commissions':
      return renderCommissions();
    default:
      return renderDashboard();
  }
};

export default VisitorDashboard;