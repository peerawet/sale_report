import { getBranchData, BRANCHES } from "./data/MRS_BRANCH";
import type {
  SalesData,
  RepeatPurchaseData,
  BranchType,
} from "./data/MRS_BRANCH";
import { useState } from "react";
import {
  formatCurrency,
  getTotalByMonth,
  getRepeatPurchaseTotalByMonth,
  getTotalByCompany,
  getRepeatPurchaseTotalByCompany,
  getGrandTotal,
  getGrandTotalRepeatPurchase,
  getMonthlyGrowth,
  getRepeatPurchaseRate,
  getTotalNewReceived,
  getTotalNewClosed,
  getOverallConversionRate,
  getTotalRenewReceived,
  getTotalRenewClosed,
  getOverallRenewalRate,
} from "./utils/calculations";
import SummaryCards from "./components/SummaryCards";
import SortableTable from "./components/SortableTable";
import DetailedConversionTable from "./components/DetailedConversionTable";

import SalesChart from "./components/SalesChart";
import RepeatPurchaseChart from "./components/RepeatPurchaseChart";
import ConversionRateChart from "./components/ConversionRateChart";
import RenewalRateChart from "./components/RenewalRateChart";
import TabNavigation from "./components/TabNavigation";
import type { TabItem } from "./components/TabNavigation";

function App() {
  const [selectedBranch, setSelectedBranch] =
    useState<BranchType>("MRS_BRANCH");
  const {
    salesData,
    repeatPurchaseData,
    conversionRateData,
    renewalConversionData,
  } = getBranchData(selectedBranch);

  const currentBranchName = BRANCHES[selectedBranch];

  // Sales Summary Cards Data
  const salesCards = [
    {
      title: "พฤษภาคม",
      value: formatCurrency(getTotalByMonth(salesData, "may")),
      color: "bg-emerald-500",
    },
    {
      title: "มิถุนายน",
      value: formatCurrency(getTotalByMonth(salesData, "june")),
      subtitle: `${getMonthlyGrowth(
        getTotalByMonth(salesData, "june"),
        getTotalByMonth(salesData, "may")
      ).toFixed(1)}% จากเดือนก่อน`,
      color: "bg-sky-500",
    },
    {
      title: "กรกฎาคม",
      value: formatCurrency(getTotalByMonth(salesData, "july")),
      subtitle: `${getMonthlyGrowth(
        getTotalByMonth(salesData, "july"),
        getTotalByMonth(salesData, "june")
      ).toFixed(1)}% จากเดือนก่อน`,
      color: "bg-violet-500",
    },
    {
      title: "รวมทั้งหมด",
      value: formatCurrency(getGrandTotal(salesData)),
      color: "bg-gradient-to-r from-sky-500 to-blue-600",
      isGradient: true,
    },
  ];

  // Repeat Purchase Cards Data
  const repeatCards = [
    {
      title: "พฤษภาคม (ซื้อซ้ำ)",
      value: formatCurrency(
        getRepeatPurchaseTotalByMonth(repeatPurchaseData, "may")
      ),
      subtitle: `${getRepeatPurchaseRate(
        getRepeatPurchaseTotalByMonth(repeatPurchaseData, "may"),
        getTotalByMonth(salesData, "may")
      ).toFixed(1)}% ของยอดขายรวม`,
      color: "bg-amber-500",
    },
    {
      title: "มิถุนายน (ซื้อซ้ำ)",
      value: formatCurrency(
        getRepeatPurchaseTotalByMonth(repeatPurchaseData, "june")
      ),
      subtitle: `${getRepeatPurchaseRate(
        getRepeatPurchaseTotalByMonth(repeatPurchaseData, "june"),
        getTotalByMonth(salesData, "june")
      ).toFixed(1)}% ของยอดขายรวม`,
      color: "bg-teal-500",
    },
    {
      title: "กรกฎาคม (ซื้อซ้ำ)",
      value: formatCurrency(
        getRepeatPurchaseTotalByMonth(repeatPurchaseData, "july")
      ),
      subtitle: `${getRepeatPurchaseRate(
        getRepeatPurchaseTotalByMonth(repeatPurchaseData, "july"),
        getTotalByMonth(salesData, "july")
      ).toFixed(1)}% ของยอดขายรวม`,
      color: "bg-indigo-500",
    },
    {
      title: "รวมซื้อซ้ำทั้งหมด",
      value: formatCurrency(getGrandTotalRepeatPurchase(repeatPurchaseData)),
      subtitle: `${getRepeatPurchaseRate(
        getGrandTotalRepeatPurchase(repeatPurchaseData),
        getGrandTotal(salesData)
      ).toFixed(1)}% ของยอดขายรวม`,
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
      isGradient: true,
    },
  ];

  // Conversion Rate Cards Data
  const conversionCards = [
    {
      title: "พฤษภาคม",
      value: `${getOverallConversionRate(conversionRateData, "may").toFixed(
        1
      )}%`,
      subtitle: `${getTotalNewClosed(
        conversionRateData,
        "may"
      )} / ${getTotalNewReceived(conversionRateData, "may")} ลีด`,
      color: "bg-rose-500",
    },
    {
      title: "มิถุนายน",
      value: `${getOverallConversionRate(conversionRateData, "june").toFixed(
        1
      )}%`,
      subtitle: `${getTotalNewClosed(
        conversionRateData,
        "june"
      )} / ${getTotalNewReceived(conversionRateData, "june")} ลีด`,
      color: "bg-blue-500",
    },
    {
      title: "กรกฎาคม",
      value: `${getOverallConversionRate(conversionRateData, "july").toFixed(
        1
      )}%`,
      subtitle: `${getTotalNewClosed(
        conversionRateData,
        "july"
      )} / ${getTotalNewReceived(conversionRateData, "july")} ลีด`,
      color: "bg-emerald-500",
    },
    {
      title: "อัตราเฉลี่ยรวม",
      value: `${(
        (getOverallConversionRate(conversionRateData, "may") +
          getOverallConversionRate(conversionRateData, "june") +
          getOverallConversionRate(conversionRateData, "july")) /
        3
      ).toFixed(1)}%`,
      subtitle: `${
        getTotalNewClosed(conversionRateData, "may") +
        getTotalNewClosed(conversionRateData, "june") +
        getTotalNewClosed(conversionRateData, "july")
      } / ${
        getTotalNewReceived(conversionRateData, "may") +
        getTotalNewReceived(conversionRateData, "june") +
        getTotalNewReceived(conversionRateData, "july")
      } ลีดรวม`,
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
      isGradient: true,
    },
  ];

  // Renewal Rate Cards Data
  const renewalCards = [
    {
      title: "พฤษภาคม",
      value: `${getOverallRenewalRate(renewalConversionData, "may").toFixed(
        1
      )}%`,
      subtitle: `${getTotalRenewClosed(
        renewalConversionData,
        "may"
      )} / ${getTotalRenewReceived(renewalConversionData, "may")} Renewal`,
      color: "bg-purple-500",
    },
    {
      title: "มิถุนายน",
      value: `${getOverallRenewalRate(renewalConversionData, "june").toFixed(
        1
      )}%`,
      subtitle: `${getTotalRenewClosed(
        renewalConversionData,
        "june"
      )} / ${getTotalRenewReceived(renewalConversionData, "june")} Renewal`,
      color: "bg-pink-500",
    },
    {
      title: "กรกฎาคม",
      value: `${getOverallRenewalRate(renewalConversionData, "july").toFixed(
        1
      )}%`,
      subtitle: `${getTotalRenewClosed(
        renewalConversionData,
        "july"
      )} / ${getTotalRenewReceived(renewalConversionData, "july")} Renewal`,
      color: "bg-cyan-500",
    },
    {
      title: "อัตราเฉลี่ยรวม",
      value: `${(
        (getOverallRenewalRate(renewalConversionData, "may") +
          getOverallRenewalRate(renewalConversionData, "june") +
          getOverallRenewalRate(renewalConversionData, "july")) /
        3
      ).toFixed(1)}%`,
      subtitle: `${
        getTotalRenewClosed(renewalConversionData, "may") +
        getTotalRenewClosed(renewalConversionData, "june") +
        getTotalRenewClosed(renewalConversionData, "july")
      } / ${
        getTotalRenewReceived(renewalConversionData, "may") +
        getTotalRenewReceived(renewalConversionData, "june") +
        getTotalRenewReceived(renewalConversionData, "july")
      } Renewal รวม`,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      isGradient: true,
    },
  ];

  // Sales Table Columns
  const salesColumns = [
    {
      key: "company",
      label: "บริษัท",
      sortable: true,
      render: (item: SalesData, index: number) => (
        <div className="flex items-center">
          <div
            className={`w-4 h-4 rounded-full mr-4 ${
              index === 0
                ? "bg-emerald-500"
                : index === 1
                ? "bg-sky-500"
                : index === 2
                ? "bg-violet-500"
                : index === 3
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
          ></div>
          <div className="text-sm font-semibold text-slate-900">
            {item.company}
          </div>
        </div>
      ),
    },
    {
      key: "may",
      label: "พฤษภาคม",
      sortable: true,
      align: "right" as const,
      render: (item: SalesData) => (
        <span className="text-slate-900 font-medium">
          {formatCurrency(item.may)}
        </span>
      ),
    },
    {
      key: "june",
      label: "มิถุนายน",
      sortable: true,
      align: "right" as const,
      render: (item: SalesData) => {
        const growth = getMonthlyGrowth(item.june, item.may);
        return (
          <div className="text-right">
            <div className="text-slate-900 font-medium">
              {formatCurrency(item.june)}
            </div>
            <div
              className={`text-xs font-medium mt-1 ${
                growth >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {growth >= 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      key: "july",
      label: "กรกฎาคม",
      sortable: true,
      align: "right" as const,
      render: (item: SalesData) => {
        const growth = getMonthlyGrowth(item.july, item.june);
        return (
          <div className="text-right">
            <div className="text-slate-900 font-medium">
              {formatCurrency(item.july)}
            </div>
            <div
              className={`text-xs font-medium mt-1 ${
                growth >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {growth >= 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      key: "total",
      label: "รวม",
      sortable: true,
      align: "right" as const,
      render: (item: SalesData) => (
        <span className="text-slate-900 font-bold">
          {formatCurrency(getTotalByCompany(item))}
        </span>
      ),
    },
    {
      key: "trend",
      label: "เทรนด์",
      align: "center" as const,
      render: (item: SalesData) => {
        const julyGrowth = getMonthlyGrowth(item.july, item.june);
        const isPositiveTrend = julyGrowth > 0;
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isPositiveTrend
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {isPositiveTrend ? "📈 เพิ่มขึ้น" : "📉 ลดลง"}
          </span>
        );
      },
    },
  ];

  // Repeat Purchase Table Columns
  const repeatColumns = [
    {
      key: "company",
      label: "บริษัท",
      sortable: true,
      render: (item: RepeatPurchaseData, index: number) => (
        <div className="flex items-center">
          <div
            className={`w-4 h-4 rounded-full mr-4 ${
              index === 0
                ? "bg-amber-500"
                : index === 1
                ? "bg-teal-500"
                : index === 2
                ? "bg-indigo-500"
                : index === 3
                ? "bg-orange-500"
                : "bg-rose-500"
            }`}
          ></div>
          <div className="text-sm font-semibold text-slate-900">
            {item.company}
          </div>
        </div>
      ),
    },
    {
      key: "may",
      label: "พฤษภาคม (ซื้อซ้ำ)",
      sortable: true,
      align: "right" as const,
      render: (item: RepeatPurchaseData, index: number) => {
        const salesCompany = salesData[index];
        return (
          <div className="text-right">
            <div className="text-slate-900 font-medium">
              {formatCurrency(item.may)}
            </div>
            <div className="text-xs text-amber-600 font-medium mt-1">
              {getRepeatPurchaseRate(item.may, salesCompany.may).toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      key: "june",
      label: "มิถุนายน (ซื้อซ้ำ)",
      sortable: true,
      align: "right" as const,
      render: (item: RepeatPurchaseData, index: number) => {
        const salesCompany = salesData[index];
        return (
          <div className="text-right">
            <div className="text-slate-900 font-medium">
              {formatCurrency(item.june)}
            </div>
            <div className="text-xs text-teal-600 font-medium mt-1">
              {getRepeatPurchaseRate(item.june, salesCompany.june).toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      key: "july",
      label: "กรกฎาคม (ซื้อซ้ำ)",
      sortable: true,
      align: "right" as const,
      render: (item: RepeatPurchaseData, index: number) => {
        const salesCompany = salesData[index];
        return (
          <div className="text-right">
            <div className="text-slate-900 font-medium">
              {formatCurrency(item.july)}
            </div>
            <div className="text-xs text-indigo-600 font-medium mt-1">
              {getRepeatPurchaseRate(item.july, salesCompany.july).toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      key: "total",
      label: "รวมซื้อซ้ำ",
      sortable: true,
      align: "right" as const,
      render: (item: RepeatPurchaseData) => (
        <span className="text-slate-900 font-bold">
          {formatCurrency(getRepeatPurchaseTotalByCompany(item))}
        </span>
      ),
    },
    {
      key: "rate",
      label: "% ของยอดขายรวม",
      align: "center" as const,
      render: (item: RepeatPurchaseData, index: number) => {
        const total = getRepeatPurchaseTotalByCompany(item);
        const salesCompany = salesData[index];
        const salesTotalByCompany = getTotalByCompany(salesCompany);
        const repeatRate = getRepeatPurchaseRate(total, salesTotalByCompany);

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              repeatRate >= 30
                ? "bg-emerald-100 text-emerald-800"
                : repeatRate >= 20
                ? "bg-amber-100 text-amber-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {repeatRate.toFixed(1)}%
          </span>
        );
      },
    },
  ];

  // Sales Table Footer
  const salesFooter = (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
        รวมทั้งหมด
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
        {formatCurrency(getTotalByMonth(salesData, "may"))}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
        {formatCurrency(getTotalByMonth(salesData, "june"))}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
        {formatCurrency(getTotalByMonth(salesData, "july"))}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
        {formatCurrency(getGrandTotal(salesData))}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
          📊 สรุป
        </span>
      </td>
    </tr>
  );

  // Repeat Purchase Table Footer
  const repeatFooter = (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
        รวมทั้งหมด
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
        {formatCurrency(
          getRepeatPurchaseTotalByMonth(repeatPurchaseData, "may")
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
        {formatCurrency(
          getRepeatPurchaseTotalByMonth(repeatPurchaseData, "june")
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
        {formatCurrency(
          getRepeatPurchaseTotalByMonth(repeatPurchaseData, "july")
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
        {formatCurrency(getGrandTotalRepeatPurchase(repeatPurchaseData))}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
          🔄{" "}
          {getRepeatPurchaseRate(
            getGrandTotalRepeatPurchase(repeatPurchaseData),
            getGrandTotal(salesData)
          ).toFixed(1)}
          %
        </span>
      </td>
    </tr>
  );

  // Create tab content
  const tabs: TabItem[] = [
    {
      id: "sales",
      label: "สรุปยอดขายรวม",
      icon: "💰",
      content: (
        <>
          <SummaryCards title="สรุปยอดขายรวม" cards={salesCards} />
          <SalesChart data={salesData} title="กราฟยอดขายรายเดือน" />
          <SortableTable
            title="รายละเอียดยอดขายแต่ละบริษัท"
            subtitle="คลิกที่หัวคอลัมน์เพื่อเรียงลำดับข้อมูล"
            data={salesData}
            columns={salesColumns}
            theme="sales"
            footer={salesFooter}
          />
        </>
      ),
    },
    {
      id: "repeat",
      label: "รายงานยอดซื้อซ้ำ",
      icon: "🔄",
      content: (
        <>
          <SummaryCards title="รายงานยอดซื้อซ้ำ" cards={repeatCards} />
          <RepeatPurchaseChart
            data={repeatPurchaseData}
            title="กราฟยอดซื้อซ้ำรายเดือน"
          />
          <SortableTable
            title="รายละเอียดยอดซื้อซ้ำแต่ละบริษัท"
            subtitle="คลิกที่หัวคอลัมน์เพื่อเรียงลำดับข้อมูล"
            data={repeatPurchaseData}
            columns={repeatColumns}
            theme="repeat"
            footer={repeatFooter}
          />
        </>
      ),
    },
    {
      id: "conversion",
      label: "อัตราการปิดการขาย",
      icon: "📈",
      content: (
        <>
          <SummaryCards title="อัตราการปิดการขาย" cards={conversionCards} />
          <ConversionRateChart
            data={conversionRateData}
            title="กราฟอัตราการปิดการขาย"
          />
          <DetailedConversionTable
            data={conversionRateData}
            type="conversion"
            title="รายละเอียดอัตราการปิดการขายแต่ละบริษัท"
            subtitle="แสดงจำนวนลีดที่รับเข้ามาและปิดได้ในแต่ละเดือน"
          />
        </>
      ),
    },
    {
      id: "renewal",
      label: "อัตราการซื้อซ้ำ",
      icon: "🔁",
      content: (
        <>
          <SummaryCards title="อัตราการซื้อซ้ำ" cards={renewalCards} />
          <RenewalRateChart
            data={renewalConversionData}
            title="กราฟอัตราการซื้อซ้ำ"
          />
          <DetailedConversionTable
            data={renewalConversionData}
            type="renewal"
            title="รายละเอียดอัตราการซื้อซ้ำแต่ละบริษัท"
            subtitle="แสดงจำนวนลูกค้าเก่าที่ติดต่อมาและซื้อซ้ำได้ในแต่ละเดือน"
          />
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-blue-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mb-4 md:mb-6 shadow-lg">
            <span className="text-2xl md:text-3xl text-white">📊</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3 md:mb-4 px-4">
            <span className="block sm:inline">Sales Report</span>
            <span className="block sm:inline sm:ml-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-slate-600">
              {currentBranchName}
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 font-medium px-4">
            รายงานยอดขาย เดือน พฤษภาคม - กรกฎาคม 2025
          </p>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 mx-auto mt-3 md:mt-4 rounded-full"></div>
        </div>

        {/* Tab Navigation with Branch Selector */}
        <TabNavigation
          tabs={tabs}
          defaultTab="sales"
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          currentBranchName={currentBranchName}
        />

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <div className="inline-flex items-center justify-center space-x-2 text-slate-500 text-sm font-medium">
            <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
            <p>
              สร้างเมื่อ:{" "}
              {new Date().toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
