import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ConversionRateData } from "../data/MRS_BRANCH";
import { getConversionRate } from "../utils/calculations";

interface ConversionRateChartProps {
  data: ConversionRateData[];
  title: string;
  height?: number;
}

const ConversionRateChart: React.FC<ConversionRateChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const chartData = data.map((item) => ({
    company: item.company,
    พฤษภาคม: getConversionRate(item.may.newClosed, item.may.newReceived),
    มิถุนายน: getConversionRate(item.june.newClosed, item.june.newReceived),
    กรกฎาคม: getConversionRate(item.july.newClosed, item.july.newReceived),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value.toFixed(1)}%
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
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            แสดงเทรนด์อัตราการปิดการขายในแต่ละเดือน
          </p>
        </div>

        <div className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="company"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  color: "#64748b",
                  paddingTop: "20px",
                }}
              />
              <Line
                type="monotone"
                dataKey="พฤษภาคม"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#ef4444", strokeWidth: 2 }}
                name="พฤษภาคม"
              />
              <Line
                type="monotone"
                dataKey="มิถุนายน"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                name="มิถุนายน"
              />
              <Line
                type="monotone"
                dataKey="กรกฎาคม"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
                name="กรกฎาคม"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ConversionRateChart;
