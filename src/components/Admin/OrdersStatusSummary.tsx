import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const COLORS: Record<string, string> = {
  completed: "#4CAF50", 
  assigned: "#2196F3", 
  in_progress: "#FFC107", 
  pending: "#F44336", 
};

const OrderStatusSummary: React.FC = ({ data }) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key.replace("_", " ").toUpperCase(),
    value,
    status: key,
  }));
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Order Status Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={16} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OrderStatusSummary;
