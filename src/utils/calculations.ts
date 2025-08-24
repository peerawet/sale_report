import type {
  SalesData,
  RepeatPurchaseData,
  ConversionRateData,
  RenewalConversionData,
} from "../data/MRS_BRANCH";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getTotalByMonth = (
  data: SalesData[],
  month: keyof Omit<SalesData, "company">
): number => {
  return data.reduce((total, item) => total + item[month], 0);
};

export const getRepeatPurchaseTotalByMonth = (
  data: RepeatPurchaseData[],
  month: keyof Omit<RepeatPurchaseData, "company">
): number => {
  return data.reduce((total, item) => total + item[month], 0);
};

export const getTotalByCompany = (company: SalesData): number => {
  return company.may + company.june + company.july;
};

export const getRepeatPurchaseTotalByCompany = (
  company: RepeatPurchaseData
): number => {
  return company.may + company.june + company.july;
};

export const getGrandTotal = (data: SalesData[]): number => {
  return data.reduce((total, company) => total + getTotalByCompany(company), 0);
};

export const getGrandTotalRepeatPurchase = (
  data: RepeatPurchaseData[]
): number => {
  return data.reduce(
    (total, company) => total + getRepeatPurchaseTotalByCompany(company),
    0
  );
};

export const getMonthlyGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getRepeatPurchaseRate = (
  repeatAmount: number,
  totalAmount: number
): number => {
  if (totalAmount === 0) return 0;
  return (repeatAmount / totalAmount) * 100;
};

export const getConversionRate = (closed: number, received: number): number => {
  if (received === 0) return 0;
  return (closed / received) * 100;
};

export const getTotalNewReceived = (
  data: ConversionRateData[],
  month: "may" | "june" | "july"
): number => {
  return data.reduce((total, company) => total + company[month].newReceived, 0);
};

export const getTotalNewClosed = (
  data: ConversionRateData[],
  month: "may" | "june" | "july"
): number => {
  return data.reduce((total, company) => total + company[month].newClosed, 0);
};

export const getOverallConversionRate = (
  data: ConversionRateData[],
  month: "may" | "june" | "july"
): number => {
  const received = getTotalNewReceived(data, month);
  const closed = getTotalNewClosed(data, month);
  return getConversionRate(closed, received);
};

export const getTotalRenewReceived = (
  data: RenewalConversionData[],
  month: "may" | "june" | "july"
): number => {
  return data.reduce(
    (total, company) => total + company[month].renewReceived,
    0
  );
};

export const getTotalRenewClosed = (
  data: RenewalConversionData[],
  month: "may" | "june" | "july"
): number => {
  return data.reduce((total, company) => total + company[month].renewClosed, 0);
};

export const getOverallRenewalRate = (
  data: RenewalConversionData[],
  month: "may" | "june" | "july"
): number => {
  const received = getTotalRenewReceived(data, month);
  const closed = getTotalRenewClosed(data, month);
  return getConversionRate(closed, received);
};
