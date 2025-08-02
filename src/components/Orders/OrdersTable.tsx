import React, { useState } from "react";
import { Eye, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

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
  userRole,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      assigned: { color: "bg-blue-100 text-blue-800", label: "Assigned" },
      "in-progress": {
        color: "bg-purple-100 text-purple-800",
        label: "In Progress",
      },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: "bg-gray-100 text-gray-800", label: "Low" },
      medium: { color: "bg-blue-100 text-blue-800", label: "Medium" },
      high: { color: "bg-orange-100 text-orange-800", label: "High" },
      urgent: { color: "bg-red-100 text-red-800", label: "Urgent" },
    };

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig.medium;
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(orderId, newStatus, statusNote);
      setStatusNote("");
      setSelectedOrder(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No orders found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new order.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">جزییات سفارش</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">وضیعت</TableHead>
              <TableHead className="text-right">اولویت</TableHead>
              <TableHead className="text-right">قیمت</TableHead>
              <TableHead className="text-right">تاریخ</TableHead>
              {showActions && (
                <TableHead className="text-right">اقدامات</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-gray-900">
                      {order.itemDetails.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.itemDetails.fabric} - {order.itemDetails.color}
                    </div>
                    {order.tailorId && (
                      <div className="text-xs text-blue-600">
                        خیاط: {order.tailorId.name}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">
                    {order.customerId.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customerId.email}
                  </div>
                  {order.visitorId && (
                    <div className="text-xs text-purple-600">
                      Via: {order.visitorId.name} (
                      {order.visitorId.commissionRate}%)
                    </div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                <TableCell className="text-sm text-gray-900">
                  ${order.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  {order.estimatedDelivery && (
                    <div className="text-xs text-gray-400">
                      Est: {format(new Date(order.estimatedDelivery), "MMM dd")}
                    </div>
                  )}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex items-center space-x-2">
                      {userRole !== "tailor" &&
                        order.status === "pending" &&
                        onAssignTailor && (
                          <Select
                            onValueChange={(value) =>
                              onAssignTailor(order._id, value)
                            }
                          >
                            <SelectTrigger className="w-[100px] text-xs">
                              <SelectValue placeholder="اختصاص خیاط" />
                            </SelectTrigger>
                            <SelectContent>
                              {tailors.map((tailor) => (
                                <SelectItem key={tailor._id} value={tailor._id}>
                                  {tailor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                      {userRole === "tailor" &&
                        order.status !== "completed" &&
                        onStatusUpdate && (
                          <div className="flex items-center space-x-1">
                            {order.status === "assigned" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order._id, "in-progress")
                                }
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                              >
                                شروع کردن کار
                              </button>
                            )}
                            {order.status === "in-progress" && (
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setSelectedOrder(
                                      selectedOrder === order._id
                                        ? null
                                        : order._id
                                    )
                                  }
                                  className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors"
                                >
                                  تکمیل
                                </button>
                                {selectedOrder === order._id && (
                                  <div className="absolute z-10 bg-white border rounded-lg shadow-lg p-3 mt-1 right-0 w-64">
                                    <textarea
                                      placeholder="Completion note (optional)"
                                      value={statusNote}
                                      onChange={(e) =>
                                        setStatusNote(e.target.value)
                                      }
                                      className="text-xs border rounded p-2 mb-2 w-full resize-none"
                                      rows={2}
                                    />
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate(
                                            order._id,
                                            "completed"
                                          )
                                        }
                                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                                      >
                                        تایید
                                      </button>
                                      <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-xs bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors"
                                      >
                                        رد
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                      <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {/* Card Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 ">
                      {order.itemDetails.type}
                    </h3>
                    {/* {getPriorityBadge(order.priority)} */}
                  </div>
                  <p className="text-xs text-gray-500">
                    {order.itemDetails.fabric} - {order.itemDetails.color}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(order.status)}
                  <button
                    onClick={() => toggleRowExpansion(order._id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {expandedRows.has(order._id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                    مشتری
                  </p>
                  <p className="font-medium text-gray-900">
                    {order.customerId.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.customerId.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                    قیمت
                  </p>
                  <p className="font-medium text-gray-900">
                    ${order.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedRows.has(order._id) && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  {order.tailorId && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                        اختصاص خیاط
                      </p>
                      <p className="text-sm text-blue-600">
                        {order.tailorId.name}
                      </p>
                    </div>
                  )}

                  {order.visitorId && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                        بازدیدکننده
                      </p>
                      <p className="text-sm text-purple-600">
                        {order.visitorId.name} ({order.visitorId.commissionRate}
                        %)
                      </p>
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                        تحویل تخمینی
                      </p>
                      <p className="text-sm text-gray-900">
                        {format(
                          new Date(order.estimatedDelivery),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                  )}

                  {order.itemDetails.specialInstructions && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                        دستورالعمل های ویژه
                      </p>
                      <p className="text-sm text-gray-700">
                        {order.itemDetails.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {showActions && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {/* Admin can assign tailors */}
                    {userRole !== "tailor" &&
                      order.status === "pending" &&
                      onAssignTailor && (
                        <select
                          onChange={(e) =>
                            onAssignTailor(order._id, e.target.value)
                          }
                          className="text-xs border rounded px-3 py-2 bg-white flex-1 min-w-0"
                          defaultValue=""
                        >
                          <option value="">اختصاص خیاط</option>
                          {tailors.map((tailor) => (
                            <option key={tailor._id} value={tailor._id}>
                              {tailor.name}
                            </option>
                          ))}
                        </select>
                      )}

                    {/* Tailor can update status */}
                    {userRole === "tailor" &&
                      order.status !== "completed" &&
                      onStatusUpdate && (
                        <div className="flex-1 space-y-2">
                          {order.status === "assigned" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "in-progress")
                              }
                              className="w-full text-blue-600 hover:text-blue-900 text-sm px-4 py-2 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                              شروع کار
                            </button>
                          )}
                          {order.status === "in-progress" && (
                            <div className="space-y-2">
                              <button
                                onClick={() =>
                                  setSelectedOrder(
                                    selectedOrder === order._id
                                      ? null
                                      : order._id
                                  )
                                }
                                className="w-full text-green-600 hover:text-green-900 text-sm px-4 py-2 rounded border border-green-200 hover:bg-green-50 transition-colors"
                              >
                                {selectedOrder === order._id
                                  ? "Cancel"
                                  : "Complete Order"}
                              </button>
                              {selectedOrder === order._id && (
                                <div className="space-y-2">
                                  <textarea
                                    placeholder="Completion note (optional)"
                                    value={statusNote}
                                    onChange={(e) =>
                                      setStatusNote(e.target.value)
                                    }
                                    className="w-full text-sm border rounded p-2 resize-none"
                                    rows={2}
                                  />
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          order._id,
                                          "completed"
                                        )
                                      }
                                      className="flex-1 text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                    >
                                      تایید تکمیل
                                    </button>
                                    <button
                                      onClick={() => setSelectedOrder(null)}
                                      className="flex-1 text-sm bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                                    >
                                      رد
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    <button className="text-indigo-600 hover:text-indigo-900 p-2 rounded border border-indigo-200 hover:bg-indigo-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTable;
