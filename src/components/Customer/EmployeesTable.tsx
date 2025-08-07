import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, AlertCircle, Edit } from "lucide-react";

import ConfirmDelete from "./ConfirmDelete";
import EditEmployee from "./EditEmployee";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { employeesAPI } from "@/services/api";
import EmployeeDetails from "./EmployeeDetails";

interface Staff {
  _id: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  department: string;
  role: string;
  employmentStatus: string;
  measurements: {
    chest: string;
    waist: string;
    hip: string;
    inseam: string;
    sleeveLength: string;
    shoulderWidth: string;
    neck: string;
    height: string;
    weight: string;
    armLength: string;
    thigh: string;
    claf: string;
    wrist: string;
    ankle: string;
  };
  notes: string;
  createdAt: Date;
}

interface EmployeesTableProps {
  staffList: Staff[];
  fetchData?: () => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({
  staffList,
  fetchData,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (staffId: string) => {
    const updated = new Set(expandedRows);
    if (updated.has(staffId)) {
      updated.delete(staffId);
    } else {
      updated.add(staffId);
    }
    setExpandedRows(updated);
  };

  if (staffList.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          هیچ کارمندی یافت نشد
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          می‌توانید یک کارمند جدید اضافه کنید.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: "bg-green-100 text-green-800",
      "On Leave": "bg-yellow-100 text-yellow-800",
      resigned: "bg-red-100 text-red-800",
    };
    const badge = statusMap[status] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge}`}
      >
        {status === "active" ? "کارمند فعال" : "کارمند غیر فعال"}
      </span>
    );
  };

  const handleEmployeeDelete = async (id: string) => {
    try {
      const response = await employeesAPI.deleteEmployee(id);
      if (response.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="hidden sm:table">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">نام</TableHead>
            <TableHead className="text-center">جنسیت</TableHead>
            <TableHead className="text-center">سن</TableHead>
            <TableHead className="text-center">شماره تماس</TableHead>
            <TableHead className="text-center">دیپارتمنت</TableHead>
            <TableHead className="text-center">نقش</TableHead>
            <TableHead className="text-center">وضیعت</TableHead>
            <TableHead className="text-center">تاریخ ایجاد</TableHead>
            <TableHead className="text-center">اقدامات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffList.map((staff) => (
            <TableRow key={staff._id}>
              <TableCell className="text-sm text-center text-gray-900">
                {staff.name}
              </TableCell>
              <TableCell className="text-sm text-center text-gray-900">
                {staff.gender}
              </TableCell>
              <TableCell className="text-sm text-center text-gray-900">
                {staff.age}
              </TableCell>
              <TableCell className="text-sm text-center text-gray-900">
                {staff.phone}
              </TableCell>
              <TableCell className="text-sm text-center text-gray-500">
                {!staff.department ? "-" : staff.department}
              </TableCell>
              <TableCell className="text-sm text-center text-gray-500">
                {staff.role}
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(staff.employmentStatus)}
              </TableCell>
              <TableCell className="text-sm text-center text-gray-500">
                {new Date(staff.createdAt).toLocaleDateString("fa-IR")}
              </TableCell>
              <TableCell className="text-center">
                <EmployeeDetails employeeId={staff._id} />
                <EditEmployee id={staff._id} fetchData={fetchData} />
                <ConfirmDelete id={staff._id} onDelete={handleEmployeeDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="lg:hidden space-y-4">
        {staffList.map((staff) => (
          <div
            key={staff._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {/* Card Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-gray-500">شناسه: {staff._id}</p>
                </div>
                <button
                  onClick={() => toggleRowExpansion(staff._id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {expandedRows.has(staff._id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                    جنسیت
                  </p>
                  <p className="font-medium text-gray-900">
                    {staff.gender === "male" ? "مرد" : "زن"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                    نقش
                  </p>
                  <p className="font-medium text-gray-900">{staff.role}</p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRows.has(staff._id) && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                      دپارتمان
                    </p>
                    <p className="text-sm text-gray-900">{staff.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                      تاریخ ثبت
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(staff.created_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                <EmployeeDetails employeeId={staff._id} />
                <EditEmployee id={staff._id} fetchData={fetchData} />
                <ConfirmDelete id={staff._id} onDelete={handleEmployeeDelete} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesTable;
