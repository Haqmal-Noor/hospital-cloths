import { useAuth } from "../contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  ShoppingBag,
  Scissors,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  Settings,
  User,
  Briefcase,
} from "lucide-react";

import ConfirmLogout from "./ConfirmLogout";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { user } = useAuth();
  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        return [
          { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
          { id: "all-orders", label: "تمام سفارشات", icon: ShoppingBag },
          { id: "manage-emp", label: "مدریت کارمندان", icon: Briefcase },
          { id: "pending-orders", label: "سفارشات در انتظار", icon: Clock },
          { id: "tailors", label: "خیاطان", icon: Scissors },
          { id: "analytics", label: "تحلیل‌ها", icon: BarChart3 },
          { id: "setting", label: "تنظیمات", icon: Settings },
          { id: "profile", label: "پروفایل من", icon: User },
        ];
      case "visitor":
        return [
          { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
          { id: "create-order", label: "ایجاد سفارش", icon: Plus },
          { id: "my-orders", label: "سفارشات من", icon: ShoppingBag },
          { id: "commissions", label: "کمیسیون‌ها", icon: BarChart3 },
          { id: "setting", label: "تنظیمات", icon: Settings },
          { id: "profile", label: "پروفایل من", icon: User },
        ];
      case "customer":
        return [
          { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
          { id: "manage-emp", label: "مدریت کارمندان", icon: Briefcase },
          { id: "place-order", label: "ثبت سفارش", icon: Plus },
          { id: "my-orders", label: "سفارشات من", icon: ShoppingBag },
          { id: "completed", label: "تکمیل‌شده", icon: CheckCircle },
          { id: "setting", label: "تنظیمات", icon: Settings },
          { id: "profile", label: "پروفایل من", icon: User },
        ];
      case "tailor":
        return [
          { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
          {
            id: "assigned-orders",
            label: "سفارشات اختصاص یافته",
            icon: ShoppingBag,
          },
          { id: "in-progress", label: "در حال اجرا", icon: Clock },
          { id: "completed", label: "تکمیل‌شده", icon: CheckCircle },
          { id: "setting", label: "تنظیمات", icon: Settings },
          { id: "profile", label: "پروفایل من", icon: User },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Header title based on role
  const getHeaderTitle = () => {
    switch (user?.role) {
      case "admin":
        return "پنل مدیر";
      case "visitor":
        return "داشبورد بازدیدکننده";
      case "customer":
        return "پرتال مشتری";
      case "tailor":
        return "محیط کاری خیاط";
      default:
        return "";
    }
  };

  return (
    <Sidebar side="right" className="w-64 min-h-screen bg-white shadow-lg">
      <SidebarHeader>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 mt-3 mr-3">
          {getHeaderTitle()}
        </h2>
      </SidebarHeader>

      <SidebarSeparator></SidebarSeparator>

      <SidebarContent>
        {/* If you want to group items, you can split them into SidebarGroup components */}
        <SidebarGroup>
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex gap-2 items-center space-x-3 px-4 py-3 rounded-sm text-sm transition-colors duration-150 ${
                activeTab === id
                  ? "bg-blue-100 hover:bg-blue-200 transition text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </SidebarGroup>

        {/* You can add more SidebarGroup components here if needed */}
      </SidebarContent>

      <SidebarFooter>
        {/* <button
          onClick={logout}
          className="flex justify-center items-center gap-2 px-4 py-2 bg-red-300 font-bold text-red-700 rounded-sm text-sm shadow-sm hover:bg-red-400 transition duration-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button> */}
        <ConfirmLogout />
      </SidebarFooter>
    </Sidebar>
  );
}
