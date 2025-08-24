import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import type { ConversionRateData } from "../data/MRS_BRANCH";
import { getConversionRate } from "../utils/calculations";

interface ConversionScatterChartProps {
  data: ConversionRateData[];
  title: string;
  height?: number;
}

const ConversionScatterChart: React.FC<ConversionScatterChartProps> = ({
  data,
  title,
  height = 350,
}) => {
  const months = ["may", "june", "july"] as const;
  const monthLabels = ["พฤษภาคม", "มิถุนายน", "กรกฎาคม"];
  const colors = ["#ef4444", "#3b82f6", "#10b981"];

  const scatterData = months.map((month, monthIndex) => ({
    month: monthLabels[monthIndex],
    data: data.map((item, index) => ({
      company: item.company,
      received: item[month].newReceived,
      conversionRate: getConversionRate(item[month].newClosed, item[month].newReceived),
      closed: item[month].newClosed,
      color: colors[monthIndex],
      companyIndex: index,
    })),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{data.company}</p>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              ลีดรับเข้า: {data.received} ลีด
            </p>
            <p className="text-sm text-slate-600">
              ปิดได้: {data.closed} ลีด
            </p>
            <p className="text-sm font-medium" style={{ color: data.color }}>
              อัตราการปิด: {data.conversionRate.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    const size = Math.max(4, Math.min(12, payload.received / 5)); // Size based on leads received
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={payload.color}
        stroke={payload.color}
        strokeWidth={2}
        fillOpacity={0.7}
      />
    );
  };

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            ความสัมพันธ์ระหว่างจำนวนลีดที่รับเข้ากับอัตราการปิดการขาย
          </p>
          <p className="text-xs text-slate-500 mt-1">
            • ขนาดจุดแสดงปริมาณลีดที่รับเข้า • สีแสดงเดือน
          </p>
        </div>

        <div className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="received"
                name="ลีดรับเข้า"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
                label={{ value: "จำนวนลีดที่รับเข้า", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                type="number"
                dataKey="conversionRate"
                name="อัตราการปิด"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                domain={[0, 100]}
                label={{ value: "อัตราการปิดการขาย (%)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  color: "#64748b",
                  paddingTop: "20px",
                }}
              />

              {/* Reference lines */}
              <ReferenceLine 
                y={50} 
                stroke="#64748b" 
                strokeDasharray="3 3" 
                strokeOpacity={0.5}
                label={{ value: "50%", position: "right" }}
              />
              <ReferenceLine 
                y={25} 
                stroke="#64748b" 
                strokeDasharray="3 3" 
                strokeOpacity={0.3}
                label={{ value: "25%", position: "right" }}
              />

              {scatterData.map((monthData, index) => (
                <Scatter
                  key={monthData.month}
                  name={monthData.month}
                  data={monthData.data}
                  fill={colors[index]}
                  shape={<CustomizedDot />}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>

          {/* Legend for dot sizes */}
          <div className="mt-4 flex justify-center">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-600 mb-2 text-center">ขนาดจุด = จำนวนลีดที่รับเข้า</div>
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span>น้อย</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  <span>ปานกลาง</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
                  <span>มาก</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionScatterChart;
