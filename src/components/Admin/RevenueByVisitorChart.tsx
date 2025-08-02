"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type RevenueData = {
  visitor: string;
  revenue: number;
};

type Props = {
  data: RevenueData[];
};

const RevenueByVisitorChart: React.FC<Props> = ({ data }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Revenue by Visitor</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(val) => `$${val}`} />
            <YAxis type="category" dataKey="visitor" />
            <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#6366F1" radius={[0, 8, 8, 0]}>
              <LabelList
                dataKey="revenue"
                position="right"
                formatter={(val) => `$${val}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueByVisitorChart;
