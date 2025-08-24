import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RepeatPurchaseData } from "../data/MRS_BRANCH";
import { formatCurrency } from "../utils/calculations";

interface RepeatPurchaseChartProps {
  data: RepeatPurchaseData[];
  title: string;
  height?: number;
}

const RepeatPurchaseChart: React.FC<RepeatPurchaseChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const chartData = data.map((item) => ({
    company: item.company,
    พฤษภาคม: item.may,
    มิถุนายน: item.june,
    กรกฎาคม: item.july,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            แสดงเทรนด์ยอดซื้อซ้ำในแต่ละเดือน
          </p>
        </div>

        <div className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorMay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorJune" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorJuly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="company"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
                tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  color: "#64748b",
                  paddingTop: "20px",
                }}
              />
              <Area
                type="monotone"
                dataKey="พฤษภาคม"
                stackId="1"
                stroke="#f59e0b"
                fill="url(#colorMay)"
                name="พฤษภาคม"
              />
              <Area
                type="monotone"
                dataKey="มิถุนายน"
                stackId="1"
                stroke="#14b8a6"
                fill="url(#colorJune)"
                name="มิถุนายน"
              />
              <Area
                type="monotone"
                dataKey="กรกฎาคม"
                stackId="1"
                stroke="#6366f1"
                fill="url(#colorJuly)"
                name="กรกฎาคม"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RepeatPurchaseChart;
