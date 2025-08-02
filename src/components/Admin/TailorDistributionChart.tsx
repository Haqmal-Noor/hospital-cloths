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

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6"];

type TailorData = {
  count: number;
  tailor: string;
};

type Props = {
  data: TailorData[];
};

const TailorDistributionChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(({ tailor, count }) => ({
    name: tailor,
    value: count,
  }));

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Tailor Order Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TailorDistributionChart;
