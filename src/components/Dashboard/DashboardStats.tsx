import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

interface DashboardStatsProps {
  stats: StatItem[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      amber: 'bg-amber-100 text-amber-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend.startsWith('-')) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.trend && (
                <div className="flex items-center mt-2 space-x-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-sm font-medium ${
                    stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend}
                  </span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;