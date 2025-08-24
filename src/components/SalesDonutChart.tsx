import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { SalesData } from "../data/MRS_BRANCH";
import {
  formatCurrency,
  getTotalByCompany,
  getMonthlyGrowth,
} from "../utils/calculations";

interface SalesDonutChartProps {
  data: SalesData[];
  title: string;
  height?: number;
}

const SalesDonutChart: React.FC<SalesDonutChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const chartData = data.map((item, index) => ({
    name: item.company,
    value: getTotalByCompany(item),
    growth: getMonthlyGrowth(item.july, item.june),
    color: [
      "#10b981", // emerald-500
      "#0ea5e9", // sky-500
      "#8b5cf6", // violet-500
      "#f59e0b", // amber-500
      "#ef4444", // red-500
    ][index % 5],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{data.name}</p>
          <p className="text-sm text-slate-600">
            ยอดขาย: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-slate-600">สัดส่วน: {percentage}%</p>
          <p
            className={`text-sm font-medium ${
              data.growth >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            การเติบโต: {data.growth >= 0 ? "+" : ""}
            {data.growth.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            แสดงสัดส่วนยอดขายและอัตราการเติบโต
          </p>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Donut Chart */}
            <div>
              <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Info */}
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  สรุปข้อมูล
                </h3>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {formatCurrency(total)}
                </div>
                <div className="text-sm text-slate-600">ยอดขายรวมทั้งหมด</div>
              </div>

              <div className="space-y-3">
                {chartData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {((item.value / total) * 100).toFixed(1)}%
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          item.growth >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {item.growth >= 0 ? "↗" : "↘"}{" "}
                        {Math.abs(item.growth).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDonutChart;
