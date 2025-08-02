"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

import { statsAPI } from "@/services/api";
import { formatDateLabel } from "@/utils/formatDateLabel";

type FormattedDataPoint = {
  count: number;
  label: string;
};

type Props = {
  intervalTime: string;
};

const OrdersOverTimeChart: React.FC<Props> = ({ intervalTime }) => {
  const [adminStats, setAdminStats] = useState<FormattedDataPoint[]>([]);

  useEffect(() => {
    fetchData();
  }, [intervalTime]);

  const fetchData = async () => {
    try {
      const response = await statsAPI.getOrdersOverTime(intervalTime);
      const data = response.map(({ count, label }: FormattedDataPoint) => ({
        count,
        label: formatDateLabel(label, intervalTime),
      }));
      setAdminStats(data);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Orders Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={adminStats}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis tickMargin={10} dataKey="label" />
            <YAxis tickMargin={15} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OrdersOverTimeChart;
