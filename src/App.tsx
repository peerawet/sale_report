import { useState } from "react";
import {
  branchesData,
  formatCurrency,
  formatPercent,
  getBranchTotalRevenue,
  getAllBranchesMTD,
  getAllBranchesTotalTarget,
  type BranchData,
  type StaffData,
} from "./data/november2025";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

// Color palette - Deep ocean theme
const COLORS = {
  primary: "#0f172a",
  secondary: "#1e293b",
  accent: "#f59e0b",
  success: "#10b981",
  danger: "#ef4444",
  info: "#3b82f6",
  purple: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
  branches: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899"],
};

function App() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const totalMTD = getAllBranchesMTD();
  const totalTarget = getAllBranchesTotalTarget();
  const overallAchieve = (totalMTD / totalTarget) * 100;

  // Prepare chart data
  const branchChartData = branchesData.map((b, i) => ({
    name: b.code,
    revenue: getBranchTotalRevenue(b),
    mtd: b.mtdRevenue,
    target: b.targetRevenue,
    achieve: b.achievePercent,
    fill: COLORS.branches[i],
  }));

  const pieData = branchesData.map((b, i) => ({
    name: b.code,
    value: b.mtdRevenue,
    fill: COLORS.branches[i],
  }));

  const selectedBranchData = selectedBranch
    ? branchesData.find((b) => b.code === selectedBranch)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                    Sales Performance
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base font-medium">
                    November 2025 Report
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-slate-800/50 rounded-full text-sm font-medium text-slate-300 border border-slate-700/50">
                  🗓️ พฤศจิกายน 2568
                </span>
                <span className="px-4 py-2 bg-emerald-500/20 rounded-full text-sm font-medium text-emerald-400 border border-emerald-500/30">
                  ⚡ Live Data
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="เป้าหมายรวม"
              value={`฿${formatCurrency(totalTarget)}`}
              icon="🎯"
              color="amber"
            />
            <StatCard
              title="ยอด MTD รวม"
              value={`฿${formatCurrency(totalMTD)}`}
              icon="💰"
              color="emerald"
            />
            <StatCard
              title="% บรรลุเป้า"
              value={formatPercent(overallAchieve)}
              icon="📈"
              color="blue"
              progress={overallAchieve}
            />
            <StatCard
              title="ยังขาดอีก"
              value={`฿${formatCurrency(totalTarget - totalMTD)}`}
              icon="🔥"
              color="pink"
            />
          </div>

          {/* Branch Cards */}
          <h2 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
            สาขาทั้งหมด
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {branchesData.map((branch, i) => (
              <BranchCard
                key={branch.code}
                branch={branch}
                color={COLORS.branches[i]}
                isSelected={selectedBranch === branch.code}
                onClick={() =>
                  setSelectedBranch(
                    selectedBranch === branch.code ? null : branch.code
                  )
                }
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Bar Chart */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50">
              <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                <span className="text-amber-500">📊</span>
                ยอด MTD แต่ละสาขา
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [
                      `฿${formatCurrency(value)}`,
                      "MTD",
                    ]}
                  />
                  <Bar dataKey="mtd" radius={[8, 8, 0, 0]}>
                    {branchChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50">
              <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                <span className="text-emerald-500">🥧</span>
                สัดส่วนยอดขายแต่ละสาขา
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [
                      `฿${formatCurrency(value)}`,
                      "MTD",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 mb-8">
            <h3 className="text-lg font-semibold mb-6 text-slate-200 flex items-center gap-2">
              <span className="text-blue-500">🎯</span>
              เปรียบเทียบเป้าหมาย vs. ยอดจริง
            </h3>
            <div className="space-y-6">
              {branchesData.map((branch, i) => (
                <div key={branch.code} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS.branches[i] }}
                      />
                      <span className="font-medium text-slate-300">
                        {branch.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-400">
                        ฿{formatCurrency(branch.mtdRevenue)} / ฿
                        {formatCurrency(branch.targetRevenue)}
                      </span>
                      <span
                        className={`text-sm font-bold px-2 py-1 rounded-lg ${
                          branch.achievePercent >= 70
                            ? "bg-emerald-500/20 text-emerald-400"
                            : branch.achievePercent >= 50
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {formatPercent(branch.achievePercent)}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(branch.achievePercent, 100)}%`,
                        backgroundColor: COLORS.branches[i],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Branch Detail */}
          {selectedBranchData && (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-purple-500">👥</span>
                  พนักงาน {selectedBranchData.name}
                </h3>
                <button
                  onClick={() => setSelectedBranch(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Staff Performance */}
              <div className="grid gap-4">
                {selectedBranchData.staff.map((staff) => (
                  <StaffRow key={staff.name} staff={staff} />
                ))}
              </div>

              {/* Branch Conversion Rates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-sm mb-1">
                    Closed Ratio NEW
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatPercent(selectedBranchData.closedRatioNew)}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-sm mb-1">
                    Closed Ratio RENEW
                  </p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatPercent(selectedBranchData.closedRatioRenew)}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-sm mb-1">Add-on Rate</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatPercent(selectedBranchData.addOnPercent)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conversion Analysis */}
          <h2 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            การวิเคราะห์ Conversion Rate
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Conversion Chart */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50">
              <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                <span className="text-cyan-500">📈</span>
                อัตราปิด NEW vs RENEW
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={branchesData.map((b) => ({
                    name: b.code,
                    new: b.closedRatioNew,
                    renew: b.closedRatioRenew,
                  }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`]}
                  />
                  <Legend />
                  <Bar
                    dataKey="new"
                    name="NEW"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="renew"
                    name="RENEW"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Add-on Rate */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50">
              <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                <span className="text-pink-500">🎁</span>
                Add-on Rate แต่ละสาขา
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart
                  innerRadius="20%"
                  outerRadius="90%"
                  data={branchesData.map((b, i) => ({
                    name: b.code,
                    value: Math.min(b.addOnPercent, 100),
                    fill: COLORS.branches[i],
                  }))}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    label={{ fill: "#fff", position: "insideStart" }}
                  />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                    }}
                    formatter={(_value: number, _name: string, props: any) => [
                      `${branchesData
                        .find((b) => b.code === props.payload.name)
                        ?.addOnPercent.toFixed(1)}%`,
                      props.payload.name,
                    ]}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* All Staff Table */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50">
            <h3 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
              <span className="text-amber-500">🏆</span>
              รายละเอียดพนักงานทุกสาขา
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      สาขา
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      ชื่อ
                    </th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">
                      Revenue
                    </th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">
                      New
                    </th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">
                      Renew
                    </th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">
                      PT+BS
                    </th>
                    <th className="text-center py-3 px-4 text-slate-400 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {branchesData.flatMap((branch, branchIdx) =>
                    branch.staff.map((staff, staffIdx) => (
                      <tr
                        key={`${branch.code}-${staff.name}`}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      >
                        {staffIdx === 0 && (
                          <td
                            rowSpan={branch.staff.length}
                            className="py-3 px-4"
                          >
                            <span
                              className="px-3 py-1 rounded-lg text-sm font-medium"
                              style={{
                                backgroundColor: `${COLORS.branches[branchIdx]}20`,
                                color: COLORS.branches[branchIdx],
                              }}
                            >
                              {branch.code}
                            </span>
                          </td>
                        )}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                staff.role === "PT"
                                  ? "bg-emerald-500"
                                  : "bg-blue-500"
                              }`}
                            />
                            <span className="text-slate-200">{staff.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-300">
                          ฿{formatCurrency(staff.totalRevenue)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-400">
                          ฿{formatCurrency(staff.newSales)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-blue-400">
                          ฿{formatCurrency(staff.renewSales)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-400">
                          {staff.ptBs}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {staff.totalRevenue > 200000 ? (
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                              🌟 Top
                            </span>
                          ) : staff.totalRevenue > 100000 ? (
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium">
                              ⚡ Good
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-lg text-xs font-medium">
                              📊 Active
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              📊 Sales Performance Report • November 2025 • Last updated:{" "}
              {new Date().toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Components
function StatCard({
  title,
  value,
  icon,
  color,
  progress,
}: {
  title: string;
  value: string;
  icon: string;
  color: "amber" | "emerald" | "blue" | "pink";
  progress?: number;
}) {
  const colorStyles = {
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "shadow-amber-500/10",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      glow: "shadow-blue-500/10",
    },
    pink: {
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      text: "text-pink-400",
      glow: "shadow-pink-500/10",
    },
  };

  const style = colorStyles[color];

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-2xl p-5 backdrop-blur-sm shadow-lg ${style.glow} hover:scale-[1.02] transition-transform duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium ${style.text}`}>NOV 2025</span>
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className={`text-2xl font-bold ${style.text}`}>{value}</p>
      {progress !== undefined && (
        <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              color === "amber"
                ? "bg-amber-500"
                : color === "emerald"
                ? "bg-emerald-500"
                : color === "blue"
                ? "bg-blue-500"
                : "bg-pink-500"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function BranchCard({
  branch,
  color,
  isSelected,
  onClick,
}: {
  branch: BranchData;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 cursor-pointer transition-all duration-300 border ${
        isSelected
          ? "bg-slate-800/80 border-slate-600 scale-[1.02]"
          : "bg-slate-900/50 border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-10 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div>
          <h3 className="font-bold text-slate-200">{branch.name}</h3>
          <p className="text-sm text-slate-400">
            {branch.staff.length} พนักงาน
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">MTD</span>
          <span className="font-bold text-slate-200">
            ฿{formatCurrency(branch.mtdRevenue)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">เป้า</span>
          <span className="text-slate-400">
            ฿{formatCurrency(branch.targetRevenue)}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(branch.achievePercent, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span
            className={`text-lg font-bold ${
              branch.achievePercent >= 70
                ? "text-emerald-400"
                : branch.achievePercent >= 50
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {formatPercent(branch.achievePercent)}
          </span>
          <span className="text-xs text-slate-500">
            {isSelected ? "คลิกเพื่อปิด" : "คลิกดูรายละเอียด"}
          </span>
        </div>
      </div>
    </div>
  );
}

function StaffRow({ staff }: { staff: StaffData }) {
  return (
    <div className="bg-slate-800/30 rounded-xl p-4 hover:bg-slate-800/50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              staff.role === "PT"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            <span className="text-lg">{staff.role === "PT" ? "🏋️" : "💆"}</span>
          </div>
          <div>
            <p className="font-semibold text-slate-200">{staff.name}</p>
            <p className="text-sm text-slate-400">
              {staff.role === "PT" ? "Personal Trainer" : "Beauty Therapist"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-400 mb-1">Revenue</p>
            <p className="font-bold text-amber-400">
              ฿{formatCurrency(staff.totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">New</p>
            <p className="font-bold text-emerald-400">
              ฿{formatCurrency(staff.newSales)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Renew</p>
            <p className="font-bold text-blue-400">
              ฿{formatCurrency(staff.renewSales)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">PT+BS</p>
            <p className="font-bold text-slate-300">{staff.ptBs}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">SW</p>
            <p className="font-bold text-slate-300">{staff.sw}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
