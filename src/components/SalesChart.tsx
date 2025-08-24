import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SalesData } from "../data/MRS_BRANCH";
import { formatCurrency } from "../utils/calculations";

interface SalesChartProps {
  data: SalesData[];
  title: string;
  height?: number;
}

const SalesChart: React.FC<SalesChartProps> = ({
  data,
  title,
  height = 400,
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
    <div className="mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-sky-50 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-600 mt-1">
            แสดงการเปรียบเทียบยอดขายในแต่ละเดือน
          </p>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
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
              <Bar
                dataKey="พฤษภาคม"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="พฤษภาคม"
              />
              <Bar
                dataKey="มิถุนายน"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                name="มิถุนายน"
              />
              <Bar
                dataKey="กรกฎาคม"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="กรกฎาคม"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
