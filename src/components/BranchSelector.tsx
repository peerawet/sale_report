import React from "react";
import type { BranchType } from "../data/MRS_BRANCH";
import { BRANCHES } from "../data/MRS_BRANCH";

interface BranchSelectorProps {
  selectedBranch: BranchType;
  onBranchChange: (branch: BranchType) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  selectedBranch,
  onBranchChange,
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"></div>
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              เลือกสาขา
            </label>
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value as BranchType)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 outline-none"
          >
            {Object.entries(BRANCHES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BranchSelector;
