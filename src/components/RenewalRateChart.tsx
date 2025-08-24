import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { RenewalConversionData } from "../data/MRS_BRANCH";
import { getConversionRate } from "../utils/calculations";

interface RenewalRateChartProps {
  data: RenewalConversionData[];
  title: string;
  height?: number;
}

const RenewalRateChart: React.FC<RenewalRateChartProps> = ({
  data,
  title,
  height = 400,
}) => {
  const chartData = data.map((item) => ({
    company: item.company,
    พฤษภาคม: getConversionRate(item.may.renewClosed, item.may.renewReceived),
    มิถุนายน: getConversionRate(item.june.renewClosed, item.june.renewReceived),
    กรกฎาคม: getConversionRate(item.july.renewClosed, item.july.renewReceived),
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
    <div className="mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-600 mt-1">
            แสดงการเปรียบเทียบอัตราการซื้อซ้ำในรูปแบบ Radar Chart
          </p>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="company"
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  color: "#64748b",
                  paddingTop: "20px",
                }}
              />
              <Radar
                name="พฤษภาคม"
                dataKey="พฤษภาคม"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="มิถุนายน"
                dataKey="มิถุนายน"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="กรกฎาคม"
                dataKey="กรกฎาคม"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RenewalRateChart;
