import React from "react";
import type {
  ConversionRateData,
  RenewalConversionData,
} from "../data/MRS_BRANCH";
import {
  getConversionRate,
  getTotalNewReceived,
  getTotalNewClosed,
  getOverallConversionRate,
  getTotalRenewReceived,
  getTotalRenewClosed,
  getOverallRenewalRate,
} from "../utils/calculations";

interface DetailedConversionTableProps {
  data: ConversionRateData[] | RenewalConversionData[];
  type: "conversion" | "renewal";
  title: string;
  subtitle: string;
}

const DetailedConversionTable: React.FC<DetailedConversionTableProps> = ({
  data,
  type,
  title,
  subtitle,
}) => {
  const isRenewal = type === "renewal";
  const renewalData = data as RenewalConversionData[];
  const conversionData = data as ConversionRateData[];

  const getThemeColors = () => {
    return isRenewal
      ? {
          header: "bg-gradient-to-r from-purple-50 to-pink-50",
          tableHeader: "bg-purple-50",
          hoverColor: "hover:bg-purple-50",
          footerColor: "bg-purple-50",
          colorScheme: [
            "bg-purple-500",
            "bg-pink-500",
            "bg-cyan-500",
            "bg-indigo-500",
            "bg-violet-500",
          ],
          monthColors: ["text-purple-600", "text-pink-600", "text-cyan-600"],
        }
      : {
          header: "bg-gradient-to-r from-rose-50 to-pink-50",
          tableHeader: "bg-rose-50",
          hoverColor: "hover:bg-rose-50",
          footerColor: "bg-rose-50",
          colorScheme: [
            "bg-rose-500",
            "bg-blue-500",
            "bg-emerald-500",
            "bg-amber-500",
            "bg-violet-500",
          ],
          monthColors: ["text-rose-600", "text-blue-600", "text-emerald-600"],
        };
  };

  const colors = getThemeColors();

  const renderRow = (
    company: ConversionRateData | RenewalConversionData,
    index: number
  ) => {
    const mayRate = isRenewal
      ? getConversionRate(
          (company as RenewalConversionData).may.renewClosed,
          (company as RenewalConversionData).may.renewReceived
        )
      : getConversionRate(
          (company as ConversionRateData).may.newClosed,
          (company as ConversionRateData).may.newReceived
        );

    const juneRate = isRenewal
      ? getConversionRate(
          (company as RenewalConversionData).june.renewClosed,
          (company as RenewalConversionData).june.renewReceived
        )
      : getConversionRate(
          (company as ConversionRateData).june.newClosed,
          (company as ConversionRateData).june.newReceived
        );

    const julyRate = isRenewal
      ? getConversionRate(
          (company as RenewalConversionData).july.renewClosed,
          (company as RenewalConversionData).july.renewReceived
        )
      : getConversionRate(
          (company as ConversionRateData).july.newClosed,
          (company as ConversionRateData).july.newReceived
        );

    const avgRate = isRenewal
      ? (company as RenewalConversionData).may.renewReceived === 0 &&
        (company as RenewalConversionData).june.renewReceived === 0 &&
        (company as RenewalConversionData).july.renewReceived === 0
        ? 0
        : ((mayRate || 0) + (juneRate || 0) + (julyRate || 0)) /
          (Number((company as RenewalConversionData).may.renewReceived > 0) +
            Number((company as RenewalConversionData).june.renewReceived > 0) +
            Number((company as RenewalConversionData).july.renewReceived > 0))
      : (mayRate + juneRate + julyRate) / 3;

    const getPerformanceColor = (rate: number, hasData: boolean = true) => {
      if (!hasData) return "text-slate-400";
      if (isRenewal) {
        return rate >= 50
          ? "text-emerald-600"
          : rate >= 30
          ? "text-amber-600"
          : "text-rose-600";
      } else {
        return rate >= 60
          ? "text-emerald-600"
          : rate >= 40
          ? "text-amber-600"
          : "text-rose-600";
      }
    };

    const getBadgeColor = (rate: number) => {
      if (isRenewal) {
        if (avgRate === 0) return "bg-slate-100 text-slate-600";
        return rate >= 50
          ? "bg-emerald-100 text-emerald-800"
          : rate >= 30
          ? "bg-amber-100 text-amber-800"
          : "bg-rose-100 text-rose-800";
      } else {
        return rate >= 60
          ? "bg-emerald-100 text-emerald-800"
          : rate >= 40
          ? "bg-amber-100 text-amber-800"
          : "bg-rose-100 text-rose-800";
      }
    };

    const mayData = isRenewal
      ? (company as RenewalConversionData).may
      : (company as ConversionRateData).may;
    const juneData = isRenewal
      ? (company as RenewalConversionData).june
      : (company as ConversionRateData).june;
    const julyData = isRenewal
      ? (company as RenewalConversionData).july
      : (company as ConversionRateData).july;

    return (
      <tr
        key={index}
        className={`${colors.hoverColor} transition-colors duration-200`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full mr-4 ${
                colors.colorScheme[index % colors.colorScheme.length]
              }`}
            ></div>
            <div className="text-sm font-semibold text-slate-900">
              {company.company}
            </div>
          </div>
        </td>
        {/* May */}
        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-slate-900 font-medium">
          {isRenewal
            ? (mayData as any).renewReceived
            : (mayData as any).newReceived}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-slate-900 font-medium border-r border-slate-200">
          <div className="font-semibold">
            {isRenewal
              ? (mayData as any).renewClosed
              : (mayData as any).newClosed}
          </div>
          <div
            className={`text-xs font-medium mt-1 ${getPerformanceColor(
              mayRate,
              isRenewal
                ? (mayData as any).renewReceived > 0
                : (mayData as any).newReceived > 0
            )}`}
          >
            (
            {isRenewal
              ? (mayData as any).renewReceived === 0
                ? "N/A"
                : mayRate.toFixed(1)
              : (mayData as any).newReceived === 0
              ? "N/A"
              : mayRate.toFixed(1)}
            %)
          </div>
        </td>
        {/* June */}
        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-slate-900 font-medium">
          {isRenewal
            ? (juneData as any).renewReceived
            : (juneData as any).newReceived}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-slate-900 font-medium border-r border-slate-200">
          <div className="font-semibold">
            {isRenewal
              ? (juneData as any).renewClosed
              : (juneData as any).newClosed}
          </div>
          <div
            className={`text-xs font-medium mt-1 ${getPerformanceColor(
              juneRate,
              isRenewal
                ? (juneData as any).renewReceived > 0
                : (juneData as any).newReceived > 0
            )}`}
          >
            (
            {isRenewal
              ? (juneData as any).renewReceived === 0
                ? "N/A"
                : juneRate.toFixed(1)
              : (juneData as any).newReceived === 0
              ? "N/A"
              : juneRate.toFixed(1)}
            %)
          </div>
        </td>
        {/* July */}
        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-slate-900 font-medium">
          {isRenewal
            ? (julyData as any).renewReceived
            : (julyData as any).newReceived}
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-slate-900 font-medium border-r border-slate-200">
          <div className="font-semibold">
            {isRenewal
              ? (julyData as any).renewClosed
              : (julyData as any).newClosed}
          </div>
          <div
            className={`text-xs font-medium mt-1 ${getPerformanceColor(
              julyRate,
              isRenewal
                ? (julyData as any).renewReceived > 0
                : (julyData as any).newReceived > 0
            )}`}
          >
            (
            {isRenewal
              ? (julyData as any).renewReceived === 0
                ? "N/A"
                : julyRate.toFixed(1)
              : (julyData as any).newReceived === 0
              ? "N/A"
              : julyRate.toFixed(1)}
            %)
          </div>
        </td>
        {/* Average */}
        <td className="px-6 py-4 whitespace-nowrap text-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
              avgRate
            )}`}
          >
            {avgRate === 0 ? "N/A" : avgRate.toFixed(1) + "%"}
          </span>
        </td>
      </tr>
    );
  };

  const renderFooter = () => (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
        รวมทั้งหมด
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900">
        {isRenewal
          ? getTotalRenewReceived(renewalData, "may")
          : getTotalNewReceived(conversionData, "may")}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900 border-r border-slate-200">
        <div className="font-bold">
          {isRenewal
            ? getTotalRenewClosed(renewalData, "may")
            : getTotalNewClosed(conversionData, "may")}
        </div>
        <div className={`text-xs font-medium mt-1 ${colors.monthColors[0]}`}>
          (
          {isRenewal
            ? getOverallRenewalRate(renewalData, "may").toFixed(1)
            : getOverallConversionRate(conversionData, "may").toFixed(1)}
          %)
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900">
        {isRenewal
          ? getTotalRenewReceived(renewalData, "june")
          : getTotalNewReceived(conversionData, "june")}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900 border-r border-slate-200">
        <div className="font-bold">
          {isRenewal
            ? getTotalRenewClosed(renewalData, "june")
            : getTotalNewClosed(conversionData, "june")}
        </div>
        <div className={`text-xs font-medium mt-1 ${colors.monthColors[1]}`}>
          (
          {isRenewal
            ? getOverallRenewalRate(renewalData, "june").toFixed(1)
            : getOverallConversionRate(conversionData, "june").toFixed(1)}
          %)
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900">
        {isRenewal
          ? getTotalRenewReceived(renewalData, "july")
          : getTotalNewReceived(conversionData, "july")}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900 border-r border-slate-200">
        <div className="font-bold">
          {isRenewal
            ? getTotalRenewClosed(renewalData, "july")
            : getTotalNewClosed(conversionData, "july")}
        </div>
        <div className={`text-xs font-medium mt-1 ${colors.monthColors[2]}`}>
          (
          {isRenewal
            ? getOverallRenewalRate(renewalData, "july").toFixed(1)
            : getOverallConversionRate(conversionData, "july").toFixed(1)}
          %)
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-sky-100 text-sky-800">
          {isRenewal ? "🔄" : "📈"}{" "}
          {(
            (isRenewal
              ? getOverallRenewalRate(renewalData, "may") +
                getOverallRenewalRate(renewalData, "june") +
                getOverallRenewalRate(renewalData, "july")
              : getOverallConversionRate(conversionData, "may") +
                getOverallConversionRate(conversionData, "june") +
                getOverallConversionRate(conversionData, "july")) / 3
          ).toFixed(1)}
          %
        </span>
      </td>
    </tr>
  );

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className={`px-4 md:px-6 lg:px-8 py-4 md:py-6 ${colors.header} border-b border-slate-200`}>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">{subtitle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={colors.tableHeader}>
              <tr>
                <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  <span className="truncate">บริษัท</span>
                </th>
                <th
                  className="px-2 md:px-3 lg:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200"
                  colSpan={2}
                >
                  <span className="truncate">พฤษภาคม</span>
                </th>
                <th
                  className="px-2 md:px-3 lg:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200"
                  colSpan={2}
                >
                  <span className="truncate">มิถุนายน</span>
                </th>
                <th
                  className="px-2 md:px-3 lg:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200"
                  colSpan={2}
                >
                  <span className="truncate">กรกฎาคม</span>
                </th>
                <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  <span className="truncate">อัตราเฉลี่ย</span>
                </th>
              </tr>
              <tr className="bg-rose-25">
                <th className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                <th className="px-1 md:px-2 lg:px-3 py-2 md:py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span className="hidden md:inline">{isRenewal ? "RENEW รับมา" : "รับมา"}</span>
                  <span className="md:hidden">{isRenewal ? "RN รับ" : "รับ"}</span>
                </th>
                <th className="px-1 md:px-2 lg:px-3 py-2 md:py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">
                  <span className="hidden md:inline">{isRenewal ? "RENEW ปิดได้ (%)" : "ปิดได้ (%)"}</span>
                  <span className="md:hidden">{isRenewal ? "RN ปิด" : "ปิด"}</span>
                </th>
                <th className="px-1 md:px-2 lg:px-3 py-2 md:py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span className="hidden md:inline">{isRenewal ? "RENEW รับมา" : "รับมา"}</span>
                  <span className="md:hidden">{isRenewal ? "RN รับ" : "รับ"}</span>
                </th>
                <th className="px-1 md:px-2 lg:px-3 py-2 md:py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">
                  <span className="hidden md:inline">{isRenewal ? "RENEW ปิดได้ (%)" : "ปิดได้ (%)"}</span>
                  <span className="md:hidden">{isRenewal ? "RN ปิด" : "ปิด"}</span>
                </th>
                <th className="px-1 md:px-2 lg:px-3 py-2 md:py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span className="hidden md:inline">{isRenewal ? "RENEW รับมา" : "รับมา"}</span>
                  <span className="md:hidden">{isRenewal ? "RN รับ" : "รับ"}</span>
                </th>
                <th className="px-1 md:px-2 lg:px-3 py-2 md:py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">
                  <span className="hidden md:inline">{isRenewal ? "RENEW ปิดได้ (%)" : "ปิดได้ (%)"}</span>
                  <span className="md:hidden">{isRenewal ? "RN ปิด" : "ปิด"}</span>
                </th>
                <th className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.map((company, index) => renderRow(company, index))}
            </tbody>
            <tfoot className={colors.footerColor}>{renderFooter()}</tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailedConversionTable;
