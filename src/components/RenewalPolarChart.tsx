import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RenewalConversionData } from "../data/MRS_BRANCH";
import { getConversionRate } from "../utils/calculations";

interface RenewalPolarChartProps {
  data: RenewalConversionData[];
  title: string;
  height?: number;
}

const RenewalPolarChart: React.FC<RenewalPolarChartProps> = ({
  data,
  title,
  height = 350,
}) => {
  const colors = ["#a855f7", "#ec4899", "#06b6d4", "#f59e0b", "#ef4444"];

  const chartData = data
    .map((item, index) => {
      const mayRate = getConversionRate(
        item.may.renewClosed,
        item.may.renewReceived
      );
      const juneRate = getConversionRate(
        item.june.renewClosed,
        item.june.renewReceived
      );
      const julyRate = getConversionRate(
        item.july.renewClosed,
        item.july.renewReceived
      );
      const avgRate = (mayRate + juneRate + julyRate) / 3;

      return {
        name: item.company,
        value: avgRate,
        fill: colors[index % colors.length],
        mayRate,
        juneRate,
        julyRate,
        mayData: `${item.may.renewClosed}/${item.may.renewReceived}`,
        juneData: `${item.june.renewClosed}/${item.june.renewReceived}`,
        julyData: `${item.july.renewClosed}/${item.july.renewReceived}`,
      };
    })
    .sort((a, b) => b.value - a.value); // Sort by renewal rate descending

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-purple-600">
              พฤษภาคม: {data.mayRate.toFixed(1)}% ({data.mayData})
            </p>
            <p className="text-sm text-pink-600">
              มิถุนายน: {data.juneRate.toFixed(1)}% ({data.juneData})
            </p>
            <p className="text-sm text-cyan-600">
              กรกฎาคม: {data.julyRate.toFixed(1)}% ({data.julyData})
            </p>
            <div className="pt-2 mt-2 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-800">
                เฉลี่ย: {data.value.toFixed(1)}%
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
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            {title}
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            แสดงอัตราการซื้อซ้ำเฉลี่ยของแต่ละบริษัทในรูปแบบ Radial Chart
          </p>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Radial Chart */}
            <div>
              <ResponsiveContainer width="100%" height={height}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  data={chartData}
                >
                  <RadialBar
                    label={{
                      position: "insideStart",
                      fill: "#fff",
                      fontSize: 12,
                    }}
                    background
                    dataKey="value"
                    cornerRadius={10}
                    fill="#8884d8"
                  />
                  <Legend
                    iconSize={10}
                    wrapperStyle={{
                      top: "50%",
                      right: "0%",
                      transform: "translate(0, -50%)",
                      lineHeight: "24px",
                      fontSize: "12px",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Rankings */}
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  อันดับประสิทธิภาพ
                </h3>
                <div className="text-sm text-slate-600">
                  เรียงตามอัตราการซื้อซ้ำเฉลี่ย
                </div>
              </div>

              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        ></div>
                        <span className="text-sm font-medium text-slate-700">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">
                        {item.value.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.value >= 50
                          ? "🏆 ดีเยี่ยม"
                          : item.value >= 30
                          ? "👍 ดี"
                          : item.value >= 20
                          ? "📈 ปานกลาง"
                          : "⚠️ ต้องปรับปรุง"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Metrics */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mt-4">
                <div className="text-sm font-semibold text-slate-800 mb-2">
                  สรุปประสิทธิภาพ
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-600">สูงสุด:</span>
                    <span className="font-bold text-emerald-600 ml-1">
                      {Math.max(...chartData.map((d) => d.value)).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">ต่ำสุด:</span>
                    <span className="font-bold text-red-600 ml-1">
                      {Math.min(...chartData.map((d) => d.value)).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">เฉลี่ย:</span>
                    <span className="font-bold text-slate-800 ml-1">
                      {(
                        chartData.reduce((sum, d) => sum + d.value, 0) /
                        chartData.length
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">ส่วนเบี่ยงเบน:</span>
                    <span className="font-bold text-slate-800 ml-1">
                      {(
                        Math.max(...chartData.map((d) => d.value)) -
                        Math.min(...chartData.map((d) => d.value))
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalPolarChart;
