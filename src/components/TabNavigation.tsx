import React, { useState } from "react";
import type { BranchType } from "../data/MRS_BRANCH";
import { BRANCHES } from "../data/MRS_BRANCH";

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
}

interface TabNavigationProps {
  tabs: TabItem[];
  defaultTab?: string;
  selectedBranch: BranchType;
  onBranchChange: (branch: BranchType) => void;
  currentBranchName: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultTab,
  selectedBranch,
  onBranchChange,
  currentBranchName,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      {/* Tab Navigation with Branch Selector */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-8">
        <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-sky-50 border-b border-slate-200">
          {/* Header with Branch Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800">
                  รายงานข้อมูลการขาย
                </h2>
              </div>
              <div className="hidden lg:block text-slate-400">•</div>
              <div className="text-lg font-semibold text-slate-600">
                {currentBranchName}
              </div>
            </div>

            {/* Branch Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  เลือกสาขา
                </label>
              </div>
              <select
                value={selectedBranch}
                onChange={(e) => onBranchChange(e.target.value as BranchType)}
                className="px-4 py-2 border-2 border-slate-300 rounded-xl bg-white text-slate-900 font-medium hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 transition-all duration-200 outline-none shadow-sm hover:shadow-md"
              >
                {Object.entries(BRANCHES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 shadow-md hover:shadow-lg"
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">{activeTabContent}</div>
    </div>
  );
};

export default TabNavigation;
