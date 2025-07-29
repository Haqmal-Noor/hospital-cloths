import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import TriggerButton from "../TriggerButton";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "visitor":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-green-100 text-green-800";
      case "tailor":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return null; // or some fallback
  }

  return (
    <nav className="bg-white border-b border-gray-200 mb-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <TriggerButton />
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition">
                  {/* <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span> */}
                  <span className="flex gap-1 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 text-gray-600" />
                    {user.name.toUpperCase()}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="bg-white rounded-md shadow-lg w-48 py-1"
              >
                <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <User className="h-4 w-4 text-gray-600" />
                  <span>{user.name}</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Settings className="h-4 w-4 text-gray-600" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
