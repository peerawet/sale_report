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
  ReferenceLine,
} from "recharts";
import type { ConversionRateData } from "../data/MRS_BRANCH";
import {
  getConversionRate,
  getOverallConversionRate,
} from "../utils/calculations";

interface ConversionRateBarChartProps {
  data: ConversionRateData[];
  title: string;
  height?: number;
}

const ConversionRateBarChart: React.FC<ConversionRateBarChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const chartData = data.map((item) => ({
    company: item.company,
    พฤษภาคม: getConversionRate(item.may.newClosed, item.may.newReceived),
    มิถุนายน: getConversionRate(item.june.newClosed, item.june.newReceived),
    กรกฎาคม: getConversionRate(item.july.newClosed, item.july.newReceived),
    mayData: `${item.may.newClosed}/${item.may.newReceived}`,
    juneData: `${item.june.newClosed}/${item.june.newReceived}`,
    julyData: `${item.july.newClosed}/${item.july.newReceived}`,
  }));

  // Calculate average conversion rates for reference lines
  const avgMay = getOverallConversionRate(data, "may");
  const avgJune = getOverallConversionRate(data, "june");
  const avgJuly = getOverallConversionRate(data, "july");
  const overallAvg = (avgMay + avgJune + avgJuly) / 3;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-rose-600">
              พฤษภาคม: {data.พฤษภาคม.toFixed(1)}% ({data.mayData} ลีด)
            </p>
            <p className="text-sm text-blue-600">
              มิถุนายน: {data.มิถุนายน.toFixed(1)}% ({data.juneData} ลีด)
            </p>
            <p className="text-sm text-emerald-600">
              กรกฎาคม: {data.กรกฎาคม.toFixed(1)}% ({data.julyData} ลีด)
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
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            เปรียบเทียบอัตราการปิดการขายของแต่ละบริษัทโดยละเอียด
          </p>
        </div>

        <div className="p-4 md:p-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-600">เฉลี่ย พ.ค.</div>
              <div className="text-lg font-bold text-rose-600">
                {avgMay.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-600">เฉลี่ย มิ.ย.</div>
              <div className="text-lg font-bold text-blue-600">
                {avgJune.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-600">เฉลี่ย ก.ค.</div>
              <div className="text-lg font-bold text-emerald-600">
                {avgJuly.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-600">เฉลี่ยรวม</div>
              <div className="text-lg font-bold text-slate-900">
                {overallAvg.toFixed(1)}%
              </div>
            </div>
          </div>

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

              {/* Reference line for overall average */}
              <ReferenceLine
                y={overallAvg}
                stroke="#64748b"
                strokeDasharray="5 5"
                label={{
                  value: `เฉลี่ย ${overallAvg.toFixed(1)}%`,
                  position: "top",
                }}
              />

              <Bar
                dataKey="พฤษภาคม"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="พฤษภาคม"
              />
              <Bar
                dataKey="มิถุนายน"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="มิถุนายน"
              />
              <Bar
                dataKey="กรกฎาคม"
                fill="#10b981"
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

export default ConversionRateBarChart;
