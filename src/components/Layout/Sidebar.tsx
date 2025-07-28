import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Scissors, 
  Plus,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'all-orders', label: 'All Orders', icon: ShoppingBag },
          { id: 'pending-orders', label: 'Pending Orders', icon: Clock },
          { id: 'tailors', label: 'Tailors', icon: Scissors },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
        ];
      case 'visitor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'create-order', label: 'Create Order', icon: Plus },
          { id: 'my-orders', label: 'My Orders', icon: ShoppingBag },
          { id: 'commissions', label: 'Commissions', icon: BarChart3 }
        ];
      case 'customer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'place-order', label: 'Place Order', icon: Plus },
          { id: 'my-orders', label: 'My Orders', icon: ShoppingBag },
          { id: 'completed', label: 'Completed', icon: CheckCircle }
        ];
      case 'tailor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'assigned-orders', label: 'Assigned Orders', icon: ShoppingBag },
          { id: 'in-progress', label: 'In Progress', icon: Clock },
          { id: 'completed', label: 'Completed', icon: CheckCircle }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {user?.role === 'admin' && 'Admin Panel'}
          {user?.role === 'visitor' && 'Visitor Dashboard'}
          {user?.role === 'customer' && 'Customer Portal'}
          {user?.role === 'tailor' && 'Tailor Workspace'}
        </h2>

        <nav className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-150 ${
                activeTab === id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;