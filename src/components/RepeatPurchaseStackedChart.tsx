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
import { formatCurrency, getRepeatPurchaseTotalByMonth } from "../utils/calculations";

interface RepeatPurchaseStackedChartProps {
  data: RepeatPurchaseData[];
  title: string;
  height?: number;
}

const RepeatPurchaseStackedChart: React.FC<RepeatPurchaseStackedChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const chartData = [
    {
      month: "พฤษภาคม",
      total: getRepeatPurchaseTotalByMonth(data, "may"),
      ...data.reduce((acc, item) => {
        acc[item.company] = item.may;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      month: "มิถุนายน",
      total: getRepeatPurchaseTotalByMonth(data, "june"),
      ...data.reduce((acc, item) => {
        acc[item.company] = item.june;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      month: "กรกฎาคม",
      total: getRepeatPurchaseTotalByMonth(data, "july"),
      ...data.reduce((acc, item) => {
        acc[item.company] = item.july;
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  const colors = [
    "#f59e0b", // amber-500
    "#14b8a6", // teal-500
    "#6366f1", // indigo-500
    "#f97316", // orange-500
    "#ef4444", // red-500
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalValue = payload.reduce((sum: number, entry: any) => 
        entry.dataKey !== 'total' ? sum + entry.value : sum, 0);
      
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload
              .filter((entry: any) => entry.dataKey !== 'total')
              .map((entry: any, index: number) => {
                const percentage = ((entry.value / totalValue) * 100).toFixed(1);
                return (
                  <p key={index} style={{ color: entry.color }} className="text-sm">
                    {entry.dataKey}: {formatCurrency(entry.value)} ({percentage}%)
                  </p>
                );
              })}
            <div className="pt-2 mt-2 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-800">
                รวม: {formatCurrency(totalValue)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            แสดงการสะสมยอดซื้อซ้ำของแต่ละบริษัทตามเวลา
          </p>
        </div>

        <div className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                {data.map((_, index) => (
                  <linearGradient key={`gradient-${index}`} id={`colorCompany${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.3} />
                  </linearGradient>
                ))}
              </defs>
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
              
              {data.map((company, index) => (
                <Area
                  key={company.company}
                  type="monotone"
                  dataKey={company.company}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={`url(#colorCompany${index})`}
                  name={company.company}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RepeatPurchaseStackedChart;
