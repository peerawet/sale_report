import { useState, useEffect } from "react";
import type { BranchData, StaffData } from "../data/november2025";

interface DataInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branch: BranchData) => void;
  editingBranch?: BranchData | null;
}

const emptyStaff: StaffData = {
  name: "",
  role: "PT",
  ptBs: 0,
  sw: 0,
  totalRevenue: 0,
  proOnline: 0,
  newSales: 0,
  renewSales: 0,
  referral: 0,
  newReceived: 0,
  addOn: 0,
  newClosed: 0,
  renewToday: 0,
  renewClosed: 0,
  treatmentPrice: 0,
};

const emptyBranch: BranchData = {
  name: "",
  code: "",
  targetRevenue: 0,
  mtdRevenue: 0,
  achievePercent: 0,
  diffRevenue: 0,
  closedRatioNew: 0,
  closedRatioRenew: 0,
  addOnPercent: 0,
  staff: [],
  totals: {
    newReceived: 0,
    addOn: 0,
    newClosed: 0,
    renewToday: 0,
    renewClosed: 0,
  },
};

export function DataInputModal({
  isOpen,
  onClose,
  onSave,
  editingBranch,
}: DataInputProps) {
  const [branch, setBranch] = useState<BranchData>(
    editingBranch || { ...emptyBranch }
  );
  const [expandedStaffIndex, setExpandedStaffIndex] = useState<number | null>(
    null
  );
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"PT" | "BT">("PT");

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      if (editingBranch) {
        setBranch(JSON.parse(JSON.stringify(editingBranch)));
      } else {
        setBranch({ ...emptyBranch });
      }
      setExpandedStaffIndex(null);
      setIsAddingStaff(false);
      setNewStaffName("");
      setNewStaffRole("PT");
    }
  }, [isOpen, editingBranch]);

  const handleBranchChange = (
    field: keyof BranchData,
    value: string | number
  ) => {
    setBranch((prev) => ({ ...prev, [field]: value }));
  };

  const handleStaffFieldChange = (
    index: number,
    field: keyof StaffData,
    value: string | number
  ) => {
    setBranch((prev) => {
      const newStaff = [...prev.staff];
      newStaff[index] = { ...newStaff[index], [field]: value };
      return { ...prev, staff: newStaff };
    });
  };

  const addNewStaff = () => {
    if (!newStaffName.trim()) return;

    setBranch((prev) => ({
      ...prev,
      staff: [
        ...prev.staff,
        { ...emptyStaff, name: newStaffName.trim(), role: newStaffRole },
      ],
    }));

    setNewStaffName("");
    setNewStaffRole("PT");
    setIsAddingStaff(false);
    // Auto expand the newly added staff
    setExpandedStaffIndex(branch.staff.length);
  };

  const removeStaff = (index: number) => {
    setBranch((prev) => ({
      ...prev,
      staff: prev.staff.filter((_, i) => i !== index),
    }));
    if (expandedStaffIndex === index) {
      setExpandedStaffIndex(null);
    }
  };

  const calculateTotals = () => {
    const totals = branch.staff.reduce(
      (acc, s) => ({
        newReceived: acc.newReceived + s.newReceived,
        addOn: acc.addOn + s.addOn,
        newClosed: acc.newClosed + s.newClosed,
        renewToday: acc.renewToday + s.renewToday,
        renewClosed: acc.renewClosed + s.renewClosed,
      }),
      { newReceived: 0, addOn: 0, newClosed: 0, renewToday: 0, renewClosed: 0 }
    );

    const mtdRevenue = branch.staff.reduce((sum, s) => sum + s.totalRevenue, 0);
    const achievePercent =
      branch.targetRevenue > 0 ? (mtdRevenue / branch.targetRevenue) * 100 : 0;
    const diffRevenue = branch.targetRevenue - mtdRevenue;
    const closedRatioNew =
      totals.newReceived > 0
        ? (totals.newClosed / totals.newReceived) * 100
        : 0;
    const closedRatioRenew =
      totals.renewToday > 0
        ? (totals.renewClosed / totals.renewToday) * 100
        : 0;
    const addOnPercent =
      totals.newClosed > 0 ? (totals.addOn / totals.newClosed) * 100 : 0;

    return {
      ...branch,
      mtdRevenue,
      achievePercent,
      diffRevenue,
      closedRatioNew,
      closedRatioRenew,
      addOnPercent,
      totals,
    };
  };

  const handleSave = () => {
    if (!branch.name.trim() || !branch.code.trim()) return;
    onSave(calculateTotals());
    onClose();
  };

  const mtdRevenue = branch.staff.reduce((sum, s) => sum + s.totalRevenue, 0);
  const achievePercent =
    branch.targetRevenue > 0 ? (mtdRevenue / branch.targetRevenue) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editingBranch ? "✏️ แก้ไขสาขา" : "➕ เพิ่มสาขาใหม่"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {editingBranch
                ? "แก้ไขข้อมูลสาขาและพนักงาน"
                : "กรอกข้อมูลสาขาและเพิ่มพนักงาน"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: Branch Info */}
          <section className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-amber-400 font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-500/20 rounded-lg flex items-center justify-center text-sm">
                1
              </span>
              ข้อมูลสาขา
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                  ชื่อสาขา <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={branch.name}
                  onChange={(e) => handleBranchChange("name", e.target.value)}
                  placeholder="เช่น สาขา T59"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                  รหัสสาขา <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={branch.code}
                  onChange={(e) =>
                    handleBranchChange("code", e.target.value.toUpperCase())
                  }
                  placeholder="เช่น T59"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all uppercase"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                  เป้าหมายยอดขาย (฿)
                </label>
                <input
                  type="number"
                  value={branch.targetRevenue || ""}
                  onChange={(e) =>
                    handleBranchChange("targetRevenue", Number(e.target.value))
                  }
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">
                  ยอด MTD (รวมจากพนักงาน)
                </p>
                <p className="text-xl font-bold text-emerald-400">
                  ฿{mtdRevenue.toLocaleString()}
                </p>
                {branch.targetRevenue > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">บรรลุเป้า</span>
                      <span
                        className={
                          achievePercent >= 70
                            ? "text-emerald-400"
                            : achievePercent >= 50
                            ? "text-amber-400"
                            : "text-red-400"
                        }
                      >
                        {achievePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          achievePercent >= 70
                            ? "bg-emerald-500"
                            : achievePercent >= 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(achievePercent, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Staff */}
          <section className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-amber-400 font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-amber-500/20 rounded-lg flex items-center justify-center text-sm">
                  2
                </span>
                พนักงาน
                {branch.staff.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">
                    {branch.staff.length} คน
                  </span>
                )}
              </h3>
              {!isAddingStaff && (
                <button
                  onClick={() => setIsAddingStaff(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-1.5"
                >
                  <span>+</span>
                  <span>เพิ่มพนักงาน</span>
                </button>
              )}
            </div>

            {/* Quick Add Staff Form */}
            {isAddingStaff && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
                <p className="text-sm text-emerald-400 font-medium mb-3">
                  เพิ่มพนักงานใหม่
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="ชื่อพนักงาน"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && addNewStaff()}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <select
                    value={newStaffRole}
                    onChange={(e) =>
                      setNewStaffRole(e.target.value as "PT" | "BT")
                    }
                    className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="PT">🏋️ PT</option>
                    <option value="BT">💆 BT</option>
                  </select>
                  <button
                    onClick={addNewStaff}
                    disabled={!newStaffName.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium transition-colors"
                  >
                    เพิ่ม
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingStaff(false);
                      setNewStaffName("");
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}

            {/* Staff List */}
            {branch.staff.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <div className="text-4xl mb-2">👥</div>
                <p>ยังไม่มีพนักงาน</p>
                <p className="text-sm text-slate-500 mt-1">
                  คลิก "เพิ่มพนักงาน" เพื่อเริ่มต้น
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {branch.staff.map((staff, index) => (
                  <StaffCard
                    key={index}
                    staff={staff}
                    isExpanded={expandedStaffIndex === index}
                    onToggle={() =>
                      setExpandedStaffIndex(
                        expandedStaffIndex === index ? null : index
                      )
                    }
                    onChange={(field, value) =>
                      handleStaffFieldChange(index, field, value)
                    }
                    onRemove={() => removeStaff(index)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-700 bg-slate-900/50 shrink-0">
          <div className="text-sm text-slate-400">
            {!branch.name.trim() || !branch.code.trim() ? (
              <span className="text-amber-400">
                ⚠️ กรุณากรอกชื่อและรหัสสาขา
              </span>
            ) : (
              <span className="text-emerald-400">✓ พร้อมบันทึก</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              disabled={!branch.name.trim() || !branch.code.trim()}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors flex items-center gap-2"
            >
              <span>💾</span>
              <span>บันทึก</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Staff Card Component with inline editing
function StaffCard({
  staff,
  isExpanded,
  onToggle,
  onChange,
  onRemove,
}: {
  staff: StaffData;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (field: keyof StaffData, value: string | number) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`rounded-xl border transition-all ${
        isExpanded
          ? "bg-slate-800/80 border-amber-500/50"
          : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
      }`}
    >
      {/* Header - Always visible */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={onToggle}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            staff.role === "PT"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          <span className="text-lg">{staff.role === "PT" ? "🏋️" : "💆"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {staff.name || "ไม่ระบุชื่อ"}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                staff.role === "PT"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {staff.role}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>฿{staff.totalRevenue.toLocaleString()}</span>
            {staff.newSales > 0 && (
              <span className="text-emerald-400">
                New: ฿{staff.newSales.toLocaleString()}
              </span>
            )}
            {staff.renewSales > 0 && (
              <span className="text-blue-400">
                Renew: ฿{staff.renewSales.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400 shrink-0"
          title="ลบพนักงาน"
        >
          🗑️
        </button>
        <div
          className={`w-6 h-6 flex items-center justify-center text-slate-400 shrink-0 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-4 pt-1 border-t border-slate-700/50">
          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">ชื่อ</label>
              <input
                type="text"
                value={staff.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                ตำแหน่ง
              </label>
              <select
                value={staff.role}
                onChange={(e) => onChange("role", e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 focus:outline-none"
              >
                <option value="PT">🏋️ PT (Personal Trainer)</option>
                <option value="BT">💆 BT (Beauty Therapist)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                💰 Total Revenue
              </label>
              <input
                type="number"
                value={staff.totalRevenue || ""}
                onChange={(e) =>
                  onChange("totalRevenue", Number(e.target.value))
                }
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Revenue Section */}
          <div className="mb-4">
            <p className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-1">
              <span>💵</span> รายได้
            </p>
            <div className="grid grid-cols-4 gap-2">
              <FieldInput
                label="New Sales"
                value={staff.newSales}
                onChange={(v) => onChange("newSales", v)}
              />
              <FieldInput
                label="Renew Sales"
                value={staff.renewSales}
                onChange={(v) => onChange("renewSales", v)}
              />
              <FieldInput
                label="Referral"
                value={staff.referral}
                onChange={(v) => onChange("referral", v)}
              />
              <FieldInput
                label="Pro Online"
                value={staff.proOnline}
                onChange={(v) => onChange("proOnline", v)}
              />
            </div>
          </div>

          {/* Metrics Section */}
          <div className="mb-4">
            <p className="text-xs text-blue-400 font-medium mb-2 flex items-center gap-1">
              <span>📊</span> ตัวชี้วัด
            </p>
            <div className="grid grid-cols-4 gap-2">
              <FieldInput
                label="PT+BS"
                value={staff.ptBs}
                onChange={(v) => onChange("ptBs", v)}
              />
              <FieldInput
                label="SW"
                value={staff.sw}
                onChange={(v) => onChange("sw", v)}
              />
              <FieldInput
                label="Treatment"
                value={staff.treatmentPrice}
                onChange={(v) => onChange("treatmentPrice", v)}
              />
              <FieldInput
                label="Add On"
                value={staff.addOn}
                onChange={(v) => onChange("addOn", v)}
              />
            </div>
          </div>

          {/* Conversion Section */}
          <div>
            <p className="text-xs text-purple-400 font-medium mb-2 flex items-center gap-1">
              <span>🎯</span> Conversion
            </p>
            <div className="grid grid-cols-5 gap-2">
              <FieldInput
                label="New Received"
                value={staff.newReceived}
                onChange={(v) => onChange("newReceived", v)}
              />
              <FieldInput
                label="New Closed"
                value={staff.newClosed}
                onChange={(v) => onChange("newClosed", v)}
              />
              <FieldInput
                label="Renew Today"
                value={staff.renewToday}
                onChange={(v) => onChange("renewToday", v)}
              />
              <FieldInput
                label="Renew Closed"
                value={staff.renewClosed}
                onChange={(v) => onChange("renewClosed", v)}
              />
              <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500 mb-1">Close Rate</p>
                <p className="text-sm font-bold text-purple-400">
                  {staff.newReceived > 0
                    ? ((staff.newClosed / staff.newReceived) * 100).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact field input
function FieldInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label
        className="block text-xs text-slate-500 mb-1 truncate"
        title={label}
      >
        {label}
      </label>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="0"
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm focus:border-amber-500 focus:outline-none"
      />
    </div>
  );
}

// Export/Import handlers
export function exportData(
  data: BranchData[],
  reportTitle: string = "Sales Report",
  managerName?: string
) {
  const exportObj = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    reportTitle,
    managerName: managerName || "",
    branches: data,
  };

  const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sales-report-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importData(
  file: File,
  onSuccess: (data: BranchData[], title?: string, managerName?: string) => void,
  onError: (error: string) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content);

      if (!parsed.branches || !Array.isArray(parsed.branches)) {
        throw new Error("Invalid file format: missing branches array");
      }

      for (const branch of parsed.branches) {
        if (!branch.name || !branch.code || !Array.isArray(branch.staff)) {
          throw new Error("Invalid branch data: missing required fields");
        }
      }

      onSuccess(parsed.branches, parsed.reportTitle, parsed.managerName);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to parse file");
    }
  };
  reader.onerror = () => onError("Failed to read file");
  reader.readAsText(file);
}
