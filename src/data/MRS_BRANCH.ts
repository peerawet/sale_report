export interface SalesData {
  company: string;
  may: number;
  june: number;
  july: number;
}

export interface RepeatPurchaseData {
  company: string;
  may: number;
  june: number;
  july: number;
}

export interface ConversionRateData {
  company: string;
  may: { newReceived: number; newClosed: number };
  june: { newReceived: number; newClosed: number };
  july: { newReceived: number; newClosed: number };
}

export interface RenewalConversionData {
  company: string;
  may: { renewReceived: number; renewClosed: number };
  june: { renewReceived: number; renewClosed: number };
  july: { renewReceived: number; renewClosed: number };
}

export const BRANCHES = {
  MRS_BRANCH: "MRS Branch",
  RS3_BRANCH: "RS3 Branch",
  RPK_BRANCH: "RPK Branch",
} as const;

export type BranchType = keyof typeof BRANCHES;

export const MRS_BRANCH = {
  salesData: [
    { company: "PT Nan", may: 253511.0, june: 250151.0, july: 349899.0 },
    { company: "PT Ploy", may: 284710.0, june: 223139.0, july: 250204.0 },
    { company: "PT Ta", may: 176387.0, june: 258343.0, july: 200421.0 },
    { company: "BT Gate", may: 52696.0, june: 194567.0, july: 178314.0 },
    { company: "PT Baiyok RS3", may: 83342.0, june: 70394.0, july: 48197.0 },
  ] as SalesData[],

  repeatPurchaseData: [
    { company: "PT Nan", may: 82250.0, june: 92124.0, july: 65100.0 },
    { company: "PT Ploy", may: 64450.0, june: 68800.0, july: 126300.0 },
    { company: "PT Ta", may: 26750.0, june: 47225.0, july: 63250.0 },
    { company: "BT Gate", may: 10600.0, june: 13900.0, july: 19350.0 },
    { company: "PT Baiyok RS3", may: 0, june: 38900.0, july: 15800.0 },
  ] as RepeatPurchaseData[],

  conversionRateData: [
    {
      company: "PT Nan",
      may: { newReceived: 19, newClosed: 9 },
      june: { newReceived: 13, newClosed: 9 },
      july: { newReceived: 14, newClosed: 10 },
    },
    {
      company: "PT Ploy",
      may: { newReceived: 21, newClosed: 8 },
      june: { newReceived: 13, newClosed: 6 },
      july: { newReceived: 13, newClosed: 6 },
    },
    {
      company: "PT Ta",
      may: { newReceived: 18, newClosed: 6 },
      june: { newReceived: 14, newClosed: 8 },
      july: { newReceived: 13, newClosed: 9 },
    },
    {
      company: "BT Gate",
      may: { newReceived: 19, newClosed: 5 },
      june: { newReceived: 20, newClosed: 3 },
      july: { newReceived: 17, newClosed: 10 },
    },
    {
      company: "PT Baiyok RS3",
      may: { newReceived: 5, newClosed: 5 },
      june: { newReceived: 16, newClosed: 10 },
      july: { newReceived: 11, newClosed: 7 },
    },
  ] as ConversionRateData[],

  renewalConversionData: [
    {
      company: "PT Nan",
      may: { renewReceived: 10, renewClosed: 4 },
      june: { renewReceived: 17, renewClosed: 6 },
      july: { renewReceived: 14, renewClosed: 5 },
    },
    {
      company: "PT Ploy",
      may: { renewReceived: 7, renewClosed: 3 },
      june: { renewReceived: 9, renewClosed: 5 },
      july: { renewReceived: 12, renewClosed: 9 },
    },
    {
      company: "PT Ta",
      may: { renewReceived: 14, renewClosed: 3 },
      june: { renewReceived: 7, renewClosed: 5 },
      july: { renewReceived: 6, renewClosed: 3 },
    },
    {
      company: "PT Baiyok RS3",
      may: { renewReceived: 0, renewClosed: 0 },
      june: { renewReceived: 2, renewClosed: 1 },
      july: { renewReceived: 6, renewClosed: 2 },
    },
    {
      company: "BT Gate",
      may: { renewReceived: 6, renewClosed: 1 },
      june: { renewReceived: 7, renewClosed: 4 },
      july: { renewReceived: 1, renewClosed: 1 },
    },
  ] as RenewalConversionData[],
};

export const RS3_BRANCH = {
  salesData: [
    { company: "PT Fiat", may: 0.0, june: 184976.0, july: 264300.0 },
    { company: "BT Aom", may: 0.0, june: 17396.0, july: 16197.0 },
  ] as SalesData[],

  repeatPurchaseData: [
    { company: "PT Fiat", may: 0.0, june: 16200.0, july: 17510.0 },
    { company: "BT Aom", may: 0.0, june: 0.0, july: 3200.0 },
  ] as RepeatPurchaseData[],

  conversionRateData: [
    {
      company: "PT Fiat",
      may: { newReceived: 0, newClosed: 0 },
      june: { newReceived: 12, newClosed: 6 },
      july: { newReceived: 20, newClosed: 11 },
    },
    {
      company: "BT Aom",
      may: { newReceived: 0, newClosed: 0 },
      june: { newReceived: 11, newClosed: 2 },
      july: { newReceived: 10, newClosed: 2 },
    },
  ] as ConversionRateData[],

  renewalConversionData: [
    {
      company: "PT Fiat",
      may: { renewReceived: 0, renewClosed: 0 },
      june: { renewReceived: 2, renewClosed: 2 },
      july: { renewReceived: 5, renewClosed: 3 },
    },
    {
      company: "BT Aom",
      may: { renewReceived: 0, renewClosed: 0 },
      june: { renewReceived: 1, renewClosed: 0 },
      july: { renewReceived: 2, renewClosed: 2 },
    },
  ] as RenewalConversionData[],
};

export const RPK_BRANCH = {
  salesData: [
    { company: "PT Zin", may: 238780.0, june: 228793.0, july: 217837.0 },
    { company: "PT Yui", may: 322625.0, june: 191236.0, july: 257891.0 },
    { company: "PT Pim", may: 188227.0, june: 261920.0, july: 280473.0 },
    { company: "BT Fluke", may: 103175.0, june: 53088.0, july: 23628.0 },
  ] as SalesData[],

  repeatPurchaseData: [
    { company: "PT Zin", may: 60490.0, june: 79206.0, july: 63015.0 },
    { company: "PT Yui", may: 79990.0, june: 72241.0, july: 91230.0 },
    { company: "PT Pim", may: 30399.0, june: 149290.0, july: 97240.0 },
    { company: "BT Fluke", may: 23000.0, june: 31566.0, july: 0.0 },
  ] as RepeatPurchaseData[],

  conversionRateData: [
    {
      company: "PT Zin",
      may: { newReceived: 14, newClosed: 9 },
      june: { newReceived: 14, newClosed: 9 },
      july: { newReceived: 16, newClosed: 8 },
    },
    {
      company: "PT Yui",
      may: { newReceived: 19, newClosed: 8 },
      june: { newReceived: 12, newClosed: 5 },
      july: { newReceived: 18, newClosed: 10 },
    },
    {
      company: "PT Pim",
      may: { newReceived: 14, newClosed: 8 },
      june: { newReceived: 13, newClosed: 6 },
      july: { newReceived: 15, newClosed: 10 },
    },
    {
      company: "BT Fluke",
      may: { newReceived: 14, newClosed: 6 },
      june: { newReceived: 6, newClosed: 1 },
      july: { newReceived: 2, newClosed: 0 },
    },
  ] as ConversionRateData[],

  renewalConversionData: [
    {
      company: "PT Zin",
      may: { renewReceived: 3, renewClosed: 3 },
      june: { renewReceived: 5, renewClosed: 5 },
      july: { renewReceived: 4, renewClosed: 2 },
    },
    {
      company: "PT Yui",
      may: { renewReceived: 4, renewClosed: 4 },
      june: { renewReceived: 4, renewClosed: 4 },
      july: { renewReceived: 7, renewClosed: 7 },
    },
    {
      company: "PT Pim",
      may: { renewReceived: 1, renewClosed: 1 },
      june: { renewReceived: 9, renewClosed: 9 },
      july: { renewReceived: 9, renewClosed: 9 },
    },
    {
      company: "BT Fluke",
      may: { renewReceived: 1, renewClosed: 1 },
      june: { renewReceived: 2, renewClosed: 2 },
      july: { renewReceived: 1, renewClosed: 0 },
    },
  ] as RenewalConversionData[],
};

export const getBranchData = (branchType: BranchType) => {
  switch (branchType) {
    case "MRS_BRANCH":
      return MRS_BRANCH;
    case "RS3_BRANCH":
      return RS3_BRANCH;
    case "RPK_BRANCH":
      return RPK_BRANCH;
    default:
      return MRS_BRANCH;
  }
};
