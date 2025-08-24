import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { SalesData } from "../data/MRS_BRANCH";
import { formatCurrency, getTotalByCompany } from "../utils/calculations";

interface SalesPieChartProps {
  data: SalesData[];
  title: string;
  height?: number;
}

const SalesPieChart: React.FC<SalesPieChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const chartData = data.map((item, index) => ({
    name: item.company,
    value: getTotalByCompany(item),
    color: [
      "#10b981", // emerald-500
      "#0ea5e9", // sky-500
      "#8b5cf6", // violet-500
      "#f59e0b", // amber-500
      "#ef4444", // red-500
    ][index % 5],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{data.name}</p>
          <p className="text-sm text-slate-600">
            ยอดขาย: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-slate-600">สัดส่วน: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            แสดงสัดส่วนยอดขายของแต่ละบริษัท
          </p>
        </div>

        <div className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(1)}%`
                }
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  color: "#64748b",
                  paddingTop: "20px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesPieChart;
