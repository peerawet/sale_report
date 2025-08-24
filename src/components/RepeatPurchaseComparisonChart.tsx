import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RepeatPurchaseData, SalesData } from "../data/MRS_BRANCH";
import { formatCurrency, getRepeatPurchaseRate } from "../utils/calculations";

interface RepeatPurchaseComparisonChartProps {
  repeatData: RepeatPurchaseData[];
  salesData: SalesData[];
  title: string;
  height?: number;
}

const RepeatPurchaseComparisonChart: React.FC<
  RepeatPurchaseComparisonChartProps
> = ({ repeatData, salesData, title, height = 350 }) => {
  const chartData = repeatData.map((item, index) => {
    const salesItem = salesData[index];
    return {
      company: item.company,
      repeatMay: item.may,
      repeatJune: item.june,
      repeatJuly: item.july,
      salesTotalMay: salesItem.may,
      salesTotalJune: salesItem.june,
      salesTotalJuly: salesItem.july,
      repeatRateMay: getRepeatPurchaseRate(item.may, salesItem.may),
      repeatRateJune: getRepeatPurchaseRate(item.june, salesItem.june),
      repeatRateJuly: getRepeatPurchaseRate(item.july, salesItem.july),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-amber-600">
              ซื้อซ้ำ พ.ค.: {formatCurrency(data.repeatMay)} (
              {data.repeatRateMay.toFixed(1)}%)
            </p>
            <p className="text-sm text-teal-600">
              ซื้อซ้ำ มิ.ย.: {formatCurrency(data.repeatJune)} (
              {data.repeatRateJune.toFixed(1)}%)
            </p>
            <p className="text-sm text-indigo-600">
              ซื้อซ้ำ ก.ค.: {formatCurrency(data.repeatJuly)} (
              {data.repeatRateJuly.toFixed(1)}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            เปรียบเทียบยอดซื้อซ้ำและอัตราเปอร์เซ็นต์ของแต่ละบริษัท
          </p>
        </div>

        <div className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
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
                yAxisId="left"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
                tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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

              {/* Bars for repeat purchase amounts */}
              <Bar
                yAxisId="left"
                dataKey="repeatMay"
                fill="#f59e0b"
                name="ซื้อซ้ำ พ.ค."
                radius={[2, 2, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="repeatJune"
                fill="#14b8a6"
                name="ซื้อซ้ำ มิ.ย."
                radius={[2, 2, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="repeatJuly"
                fill="#6366f1"
                name="ซื้อซ้ำ ก.ค."
                radius={[2, 2, 0, 0]}
              />

              {/* Lines for repeat purchase rates */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="repeatRateMay"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 5 }}
                name="อัตรา % พ.ค."
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="repeatRateJune"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 5 }}
                name="อัตรา % มิ.ย."
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="repeatRateJuly"
                stroke="#059669"
                strokeWidth={3}
                dot={{ fill: "#059669", strokeWidth: 2, r: 5 }}
                name="อัตรา % ก.ค."
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RepeatPurchaseComparisonChart;
