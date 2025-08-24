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
import type { SalesData } from "../data/MRS_BRANCH";
import { formatCurrency, getTotalByMonth } from "../utils/calculations";

interface SalesTrendChartProps {
  data: SalesData[];
  title: string;
  height?: number;
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const chartData = [
    {
      month: "พฤษภาคม",
      total: getTotalByMonth(data, "may"),
      ...data.reduce((acc, item) => {
        acc[item.company] = item.may;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      month: "มิถุนายน",
      total: getTotalByMonth(data, "june"),
      ...data.reduce((acc, item) => {
        acc[item.company] = item.june;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      month: "กรกฎาคม",
      total: getTotalByMonth(data, "july"),
      ...data.reduce((acc, item) => {
        acc[item.company] = item.july;
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  const colors = [
    "#10b981", // emerald-500
    "#0ea5e9", // sky-500
    "#8b5cf6", // violet-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'total' ? 'รวมทั้งหมด' : entry.dataKey}: {formatCurrency(entry.value)}
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
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            แสดงเทรนด์การเปลี่ยนแปลงยอดขายของแต่ละบริษัทตามเวลา
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
                dataKey="month"
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
              <Line
                type="monotone"
                dataKey="total"
                stroke="#1f2937"
                strokeWidth={4}
                dot={{ fill: "#1f2937", strokeWidth: 2, r: 8 }}
                activeDot={{ r: 10, stroke: "#1f2937", strokeWidth: 2 }}
                name="รวมทั้งหมด"
              />
              {data.map((company, index) => (
                <Line
                  key={company.company}
                  type="monotone"
                  dataKey={company.company}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
                  name={company.company}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesTrendChart;
