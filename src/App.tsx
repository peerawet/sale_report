import { useState, useRef } from "react";
import {
  branchesData as initialBranchesData,
  formatCurrency,
  formatPercent,
  getBranchTotalRevenue,
  type BranchData,
  type StaffData,
} from "./data/november2025";
import { DataInputModal, exportData, importData } from "./components/DataInput";
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
  branches: [
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
    "#06b6d4",
    "#ef4444",
    "#84cc16",
  ],
};

function App() {
  const [branchesData, setBranchesData] =
    useState<BranchData[]>(initialBranchesData);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
  const [reportTitle, setReportTitle] = useState("November 2025 Report");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [managerName, setManagerName] = useState("นิรมล แทนละคร");
  const [isEditingManager, setIsEditingManager] = useState(false);
  const [tempManagerName, setTempManagerName] = useState("");
  const [showNotification, setShowNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const managerInputRef = useRef<HTMLInputElement>(null);

  // Sorting state for staff table
  const [sortKey, setSortKey] = useState<
    "name" | "totalRevenue" | "newSales" | "renewSales" | "ptBs"
  >("totalRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortMode, setSortMode] = useState<"all" | "byBranch">("all");

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalMTD = branchesData.reduce((sum, b) => sum + b.mtdRevenue, 0);
  const totalTarget = branchesData.reduce((sum, b) => sum + b.targetRevenue, 0);
  const overallAchieve = totalTarget > 0 ? (totalMTD / totalTarget) * 100 : 0;

  // Prepare chart data
  const branchChartData = branchesData.map((b, i) => ({
    name: b.code,
    revenue: getBranchTotalRevenue(b),
    mtd: b.mtdRevenue,
    target: b.targetRevenue,
    achieve: b.achievePercent,
    fill: COLORS.branches[i % COLORS.branches.length],
  }));

  const pieData = branchesData.map((b, i) => ({
    name: b.code,
    value: b.mtdRevenue,
    fill: COLORS.branches[i % COLORS.branches.length],
  }));

  const selectedBranchData = selectedBranch
    ? branchesData.find((b) => b.code === selectedBranch)
    : null;

  const showToast = (message: string, type: "success" | "error") => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleAddBranch = () => {
    setEditingBranch(null);
    setIsDataModalOpen(true);
  };

  const handleEditBranch = (branch: BranchData) => {
    setEditingBranch(branch);
    setIsDataModalOpen(true);
  };

  const handleSaveBranch = (branch: BranchData) => {
    if (editingBranch) {
      // Update existing branch
      setBranchesData((prev) =>
        prev.map((b) => (b.code === editingBranch.code ? branch : b))
      );
      showToast("อัปเดตข้อมูลสาขาเรียบร้อย!", "success");
    } else {
      // Check for duplicate code
      if (branchesData.some((b) => b.code === branch.code)) {
        showToast("รหัสสาขานี้มีอยู่แล้ว!", "error");
        return;
      }
      setBranchesData((prev) => [...prev, branch]);
      showToast("เพิ่มสาขาใหม่เรียบร้อย!", "success");
    }
    setEditingBranch(null);
  };

  const handleDeleteBranch = (code: string) => {
    if (confirm(`ต้องการลบสาขา ${code} หรือไม่?`)) {
      setBranchesData((prev) => prev.filter((b) => b.code !== code));
      if (selectedBranch === code) {
        setSelectedBranch(null);
      }
      showToast("ลบสาขาเรียบร้อย!", "success");
    }
  };

  const handleExport = () => {
    exportData(branchesData, reportTitle, managerName);
    showToast("ส่งออกข้อมูลเรียบร้อย!", "success");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importData(
      file,
      (data, title, manager) => {
        setBranchesData(data);
        if (title) setReportTitle(title);
        if (manager) setManagerName(manager);
        setSelectedBranch(null);
        showToast("นำเข้าข้อมูลเรียบร้อย!", "success");
      },
      (error) => {
        showToast(`เกิดข้อผิดพลาด: ${error}`, "error");
      }
    );

    // Reset input
    e.target.value = "";
  };

  const handleClearData = () => {
    if (
      confirm(
        "ต้องการล้างข้อมูลทั้งหมดหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้"
      )
    ) {
      setBranchesData([]);
      setSelectedBranch(null);
      showToast("ล้างข้อมูลทั้งหมดเรียบร้อย!", "success");
    }
  };

  const handleResetToDefault = () => {
    if (confirm("ต้องการรีเซ็ตเป็นข้อมูลเริ่มต้นหรือไม่?")) {
      setBranchesData(initialBranchesData);
      setReportTitle("November 2025 Report");
      setManagerName("นิรมล แทนละคร");
      setSelectedBranch(null);
      showToast("รีเซ็ตข้อมูลเรียบร้อย!", "success");
    }
  };

  const handleStartEditTitle = () => {
    setTempTitle(reportTitle);
    setIsEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setReportTitle(tempTitle.trim());
      showToast("อัปเดตชื่อรายงานเรียบร้อย!", "success");
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setTempTitle("");
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEditTitle();
    }
  };

  const handleStartEditManager = () => {
    setTempManagerName(managerName);
    setIsEditingManager(true);
    setTimeout(() => managerInputRef.current?.focus(), 0);
  };

  const handleSaveManager = () => {
    if (tempManagerName.trim()) {
      setManagerName(tempManagerName.trim());
      showToast("อัปเดตชื่อผู้จัดการเรียบร้อย!", "success");
    }
    setIsEditingManager(false);
  };

  const handleCancelEditManager = () => {
    setTempManagerName("");
    setIsEditingManager(false);
  };

  const handleManagerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveManager();
    } else if (e.key === "Escape") {
      handleCancelEditManager();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* Notification Toast */}
      {showNotification && (
        <div
          className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm border animate-slide-in ${
            showNotification.type === "success"
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              : "bg-red-500/20 border-red-500/50 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{showNotification.type === "success" ? "✅" : "❌"}</span>
            <span className="font-medium">{showNotification.message}</span>
          </div>
        </div>
      )}

      {/* Data Input Modal */}
      <DataInputModal
        isOpen={isDataModalOpen}
        onClose={() => {
          setIsDataModalOpen(false);
          setEditingBranch(null);
        }}
        onSave={handleSaveBranch}
        editingBranch={editingBranch}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        {/* Header - Mobile Optimized */}
        <header className="border-b border-slate-800/50 backdrop-blur-xl bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 sticky top-0 z-50">
          {/* Animated top accent line */}
          <div className="h-0.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 animate-shimmer" />

          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2">
              {/* Left: Logo & Title */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <span className="text-sm sm:text-lg">📊</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                    <span className="text-[6px] sm:text-[8px]">✓</span>
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <h1 className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent leading-tight truncate">
                    Sales Report
                  </h1>
                  {/* Desktop: Show inline info */}
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    {isEditingTitle ? (
                      <div className="flex items-center gap-1">
                        <input
                          ref={titleInputRef}
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onBlur={handleSaveTitle}
                          onKeyDown={handleTitleKeyDown}
                          className="bg-slate-800/80 border border-amber-500/50 rounded px-2 py-0.5 text-xs text-white focus:border-amber-500 focus:outline-none w-28"
                        />
                        <button
                          onClick={handleSaveTitle}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEditTitle}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={handleStartEditTitle}
                        className="text-slate-400 hover:text-amber-400 cursor-pointer transition-colors truncate"
                      >
                        📅 {reportTitle}
                      </span>
                    )}
                    <span className="text-slate-600 hidden md:inline">|</span>
                    {isEditingManager ? (
                      <div className="hidden md:flex items-center gap-1">
                        <input
                          ref={managerInputRef}
                          type="text"
                          value={tempManagerName}
                          onChange={(e) => setTempManagerName(e.target.value)}
                          onBlur={handleSaveManager}
                          onKeyDown={handleManagerKeyDown}
                          className="bg-slate-800/80 border border-blue-500/50 rounded px-2 py-0.5 text-xs text-white focus:border-blue-500 focus:outline-none w-24"
                        />
                        <button
                          onClick={handleSaveManager}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEditManager}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={handleStartEditManager}
                        className="hidden md:inline text-blue-400 hover:text-blue-300 cursor-pointer transition-colors truncate"
                      >
                        👤 {managerName}
                      </span>
                    )}
                  </div>
                  {/* Mobile: Show compact info */}
                  <p className="sm:hidden text-[10px] text-slate-500 truncate">
                    {reportTitle} • {managerName}
                  </p>
                </div>
              </div>

              {/* Desktop: Actions */}
              <div className="hidden md:flex items-center gap-1.5">
                <button
                  onClick={handleAddBranch}
                  className="group px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg text-xs font-medium text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 flex items-center gap-1"
                >
                  <span className="group-hover:rotate-90 transition-transform">
                    ➕
                  </span>
                  <span className="hidden lg:inline">เพิ่มสาขา</span>
                </button>
                <button
                  onClick={handleImportClick}
                  className="group px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-xs font-medium text-white transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 flex items-center gap-1"
                >
                  <span className="group-hover:translate-y-0.5 transition-transform">
                    📥
                  </span>
                  <span className="hidden lg:inline">นำเข้า</span>
                </button>
                <button
                  onClick={handleExport}
                  disabled={branchesData.length === 0}
                  className="group px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-lg text-xs font-medium text-white transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 disabled:hover:scale-100 flex items-center gap-1"
                >
                  <span className="group-hover:-translate-y-0.5 transition-transform">
                    📤
                  </span>
                  <span className="hidden lg:inline">ส่งออก</span>
                </button>
                <div className="relative group">
                  <button className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-all hover:rotate-45">
                    ⚙️
                  </button>
                  <div className="absolute right-0 mt-2 w-44 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                    <button
                      onClick={handleResetToDefault}
                      className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                      🔄 รีเซ็ตข้อมูลเริ่มต้น
                    </button>
                    <button
                      onClick={handleClearData}
                      className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      🗑️ ล้างข้อมูลทั้งหมด
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile: Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-white rounded transition-all ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-white rounded transition-all ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-white rounded transition-all ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="px-3 py-3 space-y-2 bg-slate-900/95 border-t border-slate-800">
              {/* Edit Title/Manager on Mobile */}
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                    รายงาน
                  </label>
                  {isEditingTitle ? (
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        ref={titleInputRef}
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={handleTitleKeyDown}
                        className="flex-1 bg-slate-800 border border-amber-500/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p
                      onClick={handleStartEditTitle}
                      className="text-xs text-amber-400 truncate cursor-pointer hover:text-amber-300"
                    >
                      📅 {reportTitle}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                    ผู้จัดการ
                  </label>
                  {isEditingManager ? (
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        ref={managerInputRef}
                        type="text"
                        value={tempManagerName}
                        onChange={(e) => setTempManagerName(e.target.value)}
                        onBlur={handleSaveManager}
                        onKeyDown={handleManagerKeyDown}
                        className="flex-1 bg-slate-800 border border-blue-500/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p
                      onClick={handleStartEditManager}
                      className="text-xs text-blue-400 truncate cursor-pointer hover:text-blue-300"
                    >
                      👤 {managerName}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleAddBranch();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl text-xs font-medium text-white shadow-lg"
                >
                  <span>➕</span>
                  <span>เพิ่มสาขา</span>
                </button>
                <button
                  onClick={() => {
                    handleImportClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-xs font-medium text-white shadow-lg"
                >
                  <span>📥</span>
                  <span>นำเข้า</span>
                </button>
                <button
                  onClick={() => {
                    handleExport();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={branchesData.length === 0}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-xl text-xs font-medium text-white shadow-lg"
                >
                  <span>📤</span>
                  <span>ส่งออก</span>
                </button>
                <button
                  onClick={() => {
                    handleResetToDefault();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-medium text-white"
                >
                  <span>🔄</span>
                  <span>รีเซ็ต</span>
                </button>
              </div>

              {/* Clear Data */}
              <button
                onClick={() => {
                  handleClearData();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-medium text-red-400"
              >
                <span>🗑️</span>
                <span>ล้างข้อมูลทั้งหมด</span>
              </button>
            </div>
          </div>

          {/* Bottom shimmer effect */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Empty State */}
          {branchesData.length === 0 ? (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-12 border border-slate-800/50 text-center">
              <div className="text-4xl sm:text-6xl mb-4">📭</div>
              <h2 className="text-xl font-bold text-slate-200 mb-2">
                ยังไม่มีข้อมูล
              </h2>
              <p className="text-slate-400 mb-6">
                เพิ่มสาขาใหม่หรือนำเข้าข้อมูลเพื่อเริ่มต้น
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleAddBranch}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>เพิ่มสาขาใหม่</span>
                </button>
                <button
                  onClick={handleImportClick}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
                >
                  <span>📥</span>
                  <span>นำเข้าข้อมูล</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Overall Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
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
                  value={`฿${formatCurrency(
                    Math.max(0, totalTarget - totalMTD)
                  )}`}
                  icon="🔥"
                  color="pink"
                />
              </div>

              {/* Branch Cards */}
              <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-slate-200 flex items-center gap-2">
                <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-amber-500 rounded-full"></span>
                สาขาทั้งหมด ({branchesData.length})
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                {branchesData.map((branch, i) => (
                  <BranchCard
                    key={branch.code}
                    branch={branch}
                    color={COLORS.branches[i % COLORS.branches.length]}
                    isSelected={selectedBranch === branch.code}
                    onClick={() =>
                      setSelectedBranch(
                        selectedBranch === branch.code ? null : branch.code
                      )
                    }
                    onEdit={() => handleEditBranch(branch)}
                    onDelete={() => handleDeleteBranch(branch.code)}
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
                            style={{
                              backgroundColor:
                                COLORS.branches[i % COLORS.branches.length],
                            }}
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
                            backgroundColor:
                              COLORS.branches[i % COLORS.branches.length],
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
              <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-slate-200 flex items-center gap-2">
                <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-emerald-500 rounded-full"></span>
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
                        fill: COLORS.branches[i % COLORS.branches.length],
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
                        formatter={(
                          _value: number,
                          _name: string,
                          props: any
                        ) => [
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
              <SortableStaffTable
                branchesData={branchesData}
                sortKey={sortKey}
                sortDirection={sortDirection}
                sortMode={sortMode}
                onSortKeyChange={setSortKey}
                onSortDirectionChange={setSortDirection}
                onSortModeChange={setSortMode}
                colors={COLORS.branches}
              />
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              📊 Sales Performance Report • {reportTitle} • Last updated:{" "}
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
      className={`${style.bg} ${style.border} border rounded-xl sm:rounded-2xl p-3 sm:p-5 backdrop-blur-sm shadow-lg ${style.glow} hover:scale-[1.02] transition-transform duration-300`}
    >
      <div className="flex items-center justify-between mb-1 sm:mb-3">
        <span className="text-lg sm:text-2xl">{icon}</span>
        <span
          className={`text-[10px] sm:text-xs font-medium ${style.text} hidden sm:inline`}
        >
          LIVE
        </span>
      </div>
      <p className="text-slate-400 text-[10px] sm:text-sm mb-0.5 sm:mb-1 truncate">
        {title}
      </p>
      <p className={`text-sm sm:text-2xl font-bold ${style.text} truncate`}>
        {value}
      </p>
      {progress !== undefined && (
        <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
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
  onEdit,
  onDelete,
}: {
  branch: BranchData;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all duration-300 border ${
        isSelected
          ? "bg-slate-800/80 border-slate-600 scale-[1.02]"
          : "bg-slate-900/50 border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1 min-w-0"
          onClick={onClick}
        >
          <div
            className="w-2 sm:w-4 h-8 sm:h-10 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-200 text-xs sm:text-base truncate">
              {branch.name}
            </h3>
            <p className="text-[10px] sm:text-sm text-slate-400">
              {branch.staff.length} คน
            </p>
          </div>
        </div>
        <div className="flex gap-0.5 sm:gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 sm:p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-amber-400 text-xs sm:text-base"
            title="แก้ไข"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 sm:p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-red-400 text-xs sm:text-base"
            title="ลบ"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-center">
          <span className="text-[10px] sm:text-sm text-slate-400">MTD</span>
          <span className="font-bold text-slate-200 text-xs sm:text-base">
            ฿{formatCurrency(branch.mtdRevenue)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] sm:text-sm text-slate-400">เป้า</span>
          <span className="text-slate-400 text-xs sm:text-base">
            ฿{formatCurrency(branch.targetRevenue)}
          </span>
        </div>
        <div className="h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
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
            className={`text-sm sm:text-lg font-bold ${
              branch.achievePercent >= 70
                ? "text-emerald-400"
                : branch.achievePercent >= 50
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {formatPercent(branch.achievePercent)}
          </span>
          <span className="text-[9px] sm:text-xs text-slate-500 hidden sm:inline">
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

// Sortable Staff Table Component
type SortKey = "name" | "totalRevenue" | "newSales" | "renewSales" | "ptBs";

function SortableStaffTable({
  branchesData,
  sortKey,
  sortDirection,
  sortMode,
  onSortKeyChange,
  onSortDirectionChange,
  onSortModeChange,
  colors,
}: {
  branchesData: BranchData[];
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
  sortMode: "all" | "byBranch";
  onSortKeyChange: (key: SortKey) => void;
  onSortDirectionChange: (dir: "asc" | "desc") => void;
  onSortModeChange: (mode: "all" | "byBranch") => void;
  colors: string[];
}) {
  // Handle column header click
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSortKeyChange(key);
      onSortDirectionChange("desc");
    }
  };

  // Sort function
  const sortStaff = (staffList: StaffData[]) => {
    return [...staffList].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (sortKey === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else {
        aVal = a[sortKey];
        bVal = b[sortKey];
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Prepare data based on sort mode
  const prepareData = () => {
    if (sortMode === "all") {
      // Flatten all staff with branch info, then sort
      const allStaff = branchesData.flatMap((branch, branchIdx) =>
        branch.staff.map((staff) => ({
          ...staff,
          branchCode: branch.code,
          branchIdx,
        }))
      );
      return sortStaff(allStaff as StaffData[]).map((s) => ({
        staff: s,
        branchCode: (s as StaffData & { branchCode: string }).branchCode,
        branchIdx: (s as StaffData & { branchIdx: number }).branchIdx,
      }));
    } else {
      // Sort within each branch
      return branchesData.flatMap((branch, branchIdx) =>
        sortStaff(branch.staff).map((staff, staffIdx) => ({
          staff,
          branchCode: branch.code,
          branchIdx,
          isFirstInBranch: staffIdx === 0,
          branchStaffCount: branch.staff.length,
        }))
      );
    }
  };

  const sortedData = prepareData();

  // Sort indicator component
  const SortIndicator = ({ columnKey }: { columnKey: SortKey }) => (
    <span className="ml-1 inline-flex flex-col text-xs leading-none">
      <span
        className={
          sortKey === columnKey && sortDirection === "asc"
            ? "text-amber-400"
            : "text-slate-600"
        }
      >
        ▲
      </span>
      <span
        className={
          sortKey === columnKey && sortDirection === "desc"
            ? "text-amber-400"
            : "text-slate-600"
        }
      >
        ▼
      </span>
    </span>
  );

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50">
      {/* Header with title and controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
          <span className="text-amber-500">🏆</span>
          รายละเอียดพนักงานทุกสาขา
        </h3>

        {/* Sort Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">เรียงลำดับ:</span>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => onSortModeChange("all")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                sortMode === "all"
                  ? "bg-amber-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔀 รวมทั้งหมด
            </button>
            <button
              onClick={() => onSortModeChange("byBranch")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                sortMode === "byBranch"
                  ? "bg-amber-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📁 แยกตามสาขา
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">
                สาขา
              </th>
              <th
                onClick={() => handleSort("name")}
                className="text-left py-3 px-4 text-slate-400 font-medium cursor-pointer hover:text-amber-400 transition-colors select-none"
              >
                <div className="flex items-center">
                  ชื่อ
                  <SortIndicator columnKey="name" />
                </div>
              </th>
              <th
                onClick={() => handleSort("totalRevenue")}
                className="text-right py-3 px-4 text-slate-400 font-medium cursor-pointer hover:text-amber-400 transition-colors select-none"
              >
                <div className="flex items-center justify-end">
                  Revenue
                  <SortIndicator columnKey="totalRevenue" />
                </div>
              </th>
              <th
                onClick={() => handleSort("newSales")}
                className="text-right py-3 px-4 text-slate-400 font-medium cursor-pointer hover:text-amber-400 transition-colors select-none"
              >
                <div className="flex items-center justify-end">
                  New
                  <SortIndicator columnKey="newSales" />
                </div>
              </th>
              <th
                onClick={() => handleSort("renewSales")}
                className="text-right py-3 px-4 text-slate-400 font-medium cursor-pointer hover:text-amber-400 transition-colors select-none"
              >
                <div className="flex items-center justify-end">
                  Renew
                  <SortIndicator columnKey="renewSales" />
                </div>
              </th>
              <th
                onClick={() => handleSort("ptBs")}
                className="text-right py-3 px-4 text-slate-400 font-medium cursor-pointer hover:text-amber-400 transition-colors select-none"
              >
                <div className="flex items-center justify-end">
                  PT+BS
                  <SortIndicator columnKey="ptBs" />
                </div>
              </th>
              <th className="text-center py-3 px-4 text-slate-400 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortMode === "all"
              ? // All mode - show branch badge for each row
                sortedData.map((item, idx) => (
                  <tr
                    key={`${item.branchCode}-${item.staff.name}-${idx}`}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span
                        className="px-3 py-1 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: `${
                            colors[item.branchIdx % colors.length]
                          }20`,
                          color: colors[item.branchIdx % colors.length],
                        }}
                      >
                        {item.branchCode}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.staff.role === "PT"
                              ? "bg-emerald-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="text-slate-200">
                          {item.staff.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      ฿{formatCurrency(item.staff.totalRevenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400">
                      ฿{formatCurrency(item.staff.newSales)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-400">
                      ฿{formatCurrency(item.staff.renewSales)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {item.staff.ptBs}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StaffStatusBadge revenue={item.staff.totalRevenue} />
                    </td>
                  </tr>
                ))
              : // By branch mode - group with rowSpan
                sortedData.map((item, idx) => (
                  <tr
                    key={`${item.branchCode}-${item.staff.name}-${idx}`}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    {(item as { isFirstInBranch?: boolean })
                      .isFirstInBranch && (
                      <td
                        rowSpan={
                          (item as { branchStaffCount?: number })
                            .branchStaffCount
                        }
                        className="py-3 px-4 align-top"
                      >
                        <span
                          className="px-3 py-1 rounded-lg text-sm font-medium"
                          style={{
                            backgroundColor: `${
                              colors[item.branchIdx % colors.length]
                            }20`,
                            color: colors[item.branchIdx % colors.length],
                          }}
                        >
                          {item.branchCode}
                        </span>
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.staff.role === "PT"
                              ? "bg-emerald-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="text-slate-200">
                          {item.staff.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      ฿{formatCurrency(item.staff.totalRevenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400">
                      ฿{formatCurrency(item.staff.newSales)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-400">
                      ฿{formatCurrency(item.staff.renewSales)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {item.staff.ptBs}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StaffStatusBadge revenue={item.staff.totalRevenue} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex flex-wrap gap-4 text-sm text-slate-400">
        <span>
          👥 พนักงานทั้งหมด:{" "}
          <span className="text-white font-medium">{sortedData.length}</span> คน
        </span>
        <span>
          🏋️ PT:{" "}
          <span className="text-emerald-400 font-medium">
            {sortedData.filter((d) => d.staff.role === "PT").length}
          </span>
        </span>
        <span>
          💆 BT:{" "}
          <span className="text-blue-400 font-medium">
            {sortedData.filter((d) => d.staff.role === "BT").length}
          </span>
        </span>
        <span>
          💰 รวม:{" "}
          <span className="text-amber-400 font-medium">
            ฿
            {formatCurrency(
              sortedData.reduce((sum, d) => sum + d.staff.totalRevenue, 0)
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

function StaffStatusBadge({ revenue }: { revenue: number }) {
  if (revenue > 200000) {
    return (
      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
        🌟 Top
      </span>
    );
  }
  if (revenue > 100000) {
    return (
      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium">
        ⚡ Good
      </span>
    );
  }
  return (
    <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-lg text-xs font-medium">
      📊 Active
    </span>
  );
}

export default App;
