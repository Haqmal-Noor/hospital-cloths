import React, { useState } from 'react';
import { Eye, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  _id: string;
  customerId: { name: string; email: string };
  visitorId?: { name: string; commissionRate: number };
  tailorId?: { name: string; email: string };
  status: string;
  itemDetails: {
    type: string;
    fabric: string;
    color: string;
    specialInstructions?: string;
  };
  price: number;
  priority: string;
  createdAt: string;
  estimatedDelivery?: string;
}

interface OrdersTableProps {
  orders: Order[];
  tailors?: Array<{ _id: string; name: string; email: string }>;
  onAssignTailor?: (orderId: string, tailorId: string) => void;
  onStatusUpdate?: (orderId: string, status: string, note?: string) => void;
  showActions?: boolean;
  userRole?: string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  tailors = [],
  onAssignTailor,
  onStatusUpdate,
  showActions = false,
  userRole
}) => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState('');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      assigned: { color: 'bg-blue-100 text-blue-800', label: 'Assigned' },
      'in-progress': { color: 'bg-purple-100 text-purple-800', label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
      medium: { color: 'bg-blue-100 text-blue-800', label: 'Medium' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
      urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(orderId, newStatus, statusNote);
      setStatusNote('');
      setSelectedOrder(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new order.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.itemDetails.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.itemDetails.fabric} - {order.itemDetails.color}
                    </div>
                    {order.tailorId && (
                      <div className="text-xs text-blue-600">
                        Tailor: {order.tailorId.name}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.customerId.name}</div>
                <div className="text-sm text-gray-500">{order.customerId.email}</div>
                {order.visitorId && (
                  <div className="text-xs text-purple-600">
                    Via: {order.visitorId.name} ({order.visitorId.commissionRate}%)
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(order.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getPriorityBadge(order.priority)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${order.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                {order.estimatedDelivery && (
                  <div className="text-xs text-gray-400">
                    Est: {format(new Date(order.estimatedDelivery), 'MMM dd')}
                  </div>
                )}
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {/* Admin can assign tailors */}
                    {userRole !== 'tailor' && order.status === 'pending' && onAssignTailor && (
                      <select
                        onChange={(e) => onAssignTailor(order._id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">Assign Tailor</option>
                        {tailors.map((tailor) => (
                          <option key={tailor._id} value={tailor._id}>
                            {tailor.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Tailor can update status */}
                    {userRole === 'tailor' && order.status !== 'completed' && onStatusUpdate && (
                      <div className="flex items-center space-x-1">
                        {order.status === 'assigned' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'in-progress')}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            Start Work
                          </button>
                        )}
                        {order.status === 'in-progress' && (
                          <div className="space-x-1">
                            <button
                              onClick={() => setSelectedOrder(order._id)}
                              className="text-green-600 hover:text-green-900 text-xs"
                            >
                              Complete
                            </button>
                            {selectedOrder === order._id && (
                              <div className="absolute z-10 bg-white border rounded shadow-lg p-2 mt-1">
                                <textarea
                                  placeholder="Completion note (optional)"
                                  value={statusNote}
                                  onChange={(e) => setStatusNote(e.target.value)}
                                  className="text-xs border rounded p-1 mb-2 w-48"
                                  rows={2}
                                />
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleStatusUpdate(order._id, 'completed')}
                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-xs bg-gray-400 text-white px-2 py-1 rounded"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;