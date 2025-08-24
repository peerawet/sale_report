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
  Cell,
} from "recharts";
import type { RenewalConversionData } from "../data/MRS_BRANCH";
import { 
  getTotalRenewReceived, 
  getTotalRenewClosed,
  getOverallRenewalRate 
} from "../utils/calculations";

interface RenewalFunnelChartProps {
  data: RenewalConversionData[];
  title: string;
  height?: number;
}

const RenewalFunnelChart: React.FC<RenewalFunnelChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const months = [
    { key: "may" as const, label: "พฤษภาคม", color: "#a855f7" },
    { key: "june" as const, label: "มิถุนายน", color: "#ec4899" },
    { key: "july" as const, label: "กรกฎาคม", color: "#06b6d4" },
  ];

  const funnelData = months.map(month => {
    const received = getTotalRenewReceived(data, month.key);
    const closed = getTotalRenewClosed(data, month.key);
    const rate = getOverallRenewalRate(data, month.key);
    const lost = received - closed;
    
    return {
      month: month.label,
      received,
      closed,
      lost,
      rate,
      color: month.color,
      efficiency: rate >= 50 ? 'ดีเยี่ยม' : rate >= 30 ? 'ดี' : rate >= 20 ? 'ปานกลาง' : 'ต้องปรับปรุง'
    };
  });

  const maxReceived = Math.max(...funnelData.map(d => d.received));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              รับเข้า: {data.received} Renewal
            </p>
            <p className="text-sm text-emerald-600">
              ปิดได้: {data.closed} Renewal
            </p>
            <p className="text-sm text-red-600">
              หลุด: {data.lost} Renewal
            </p>
            <p className="text-sm font-semibold" style={{ color: data.color }}>
              อัตราสำเร็จ: {data.rate.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500">
              ประเมิน: {data.efficiency}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom funnel shape component
  const FunnelBar = (props: any) => {
    const { fill, payload, x, y, width, height } = props;
    const funnelWidth = (payload.received / maxReceived) * width;
    const xOffset = (width - funnelWidth) / 2;
    
    return (
      <rect
        x={x + xOffset}
        y={y}
        width={funnelWidth}
        height={height}
        fill={fill}
        rx={4}
        ry={4}
      />
    );
  };

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            แสดงกระบวนการซื้อซ้ำตั้งแต่รับเข้าจนถึงการปิดได้สำเร็จ
          </p>
        </div>

        <div className="p-4 md:p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {funnelData.map((item) => (
              <div key={item.month} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">{item.month}</h3>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">รับเข้า:</span>
                    <span className="font-medium">{item.received}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">ปิดได้:</span>
                    <span className="font-medium text-emerald-600">{item.closed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">อัตราสำเร็จ:</span>
                    <span className="font-bold" style={{ color: item.color }}>
                      {item.rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Funnel Chart */}
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={funnelData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis 
                type="category"
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#cbd5e1" }}
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
                dataKey="received" 
                name="รับเข้าทั้งหมด"
                shape={<FunnelBar />}
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`${entry.color}40`} />
                ))}
              </Bar>
              <Bar 
                dataKey="closed" 
                name="ปิดได้สำเร็จ"
                radius={[0, 4, 4, 0]}
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Process Flow Visualization */}
          <div className="mt-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              กระบวนการซื้อซ้ำ (Renewal Funnel)
            </h3>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-slate-400 rounded"></div>
                <span>ลูกค้าติดต่อมา</span>
              </div>
              <span className="text-slate-400">→</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span>เจรจาต่อรอง</span>
              </div>
              <span className="text-slate-400">→</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-emerald-400 rounded"></div>
                <span>ปิดการขายสำเร็จ</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="font-semibold text-slate-800">รวมรับเข้า</div>
                <div className="text-lg font-bold text-slate-600">
                  {funnelData.reduce((sum, item) => sum + item.received, 0)}
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800">รวมปิดได้</div>
                <div className="text-lg font-bold text-emerald-600">
                  {funnelData.reduce((sum, item) => sum + item.closed, 0)}
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800">อัตราเฉลี่ย</div>
                <div className="text-lg font-bold text-blue-600">
                  {(funnelData.reduce((sum, item) => sum + item.rate, 0) / funnelData.length).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalFunnelChart;
