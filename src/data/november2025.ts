// November 2025 Sales Data - Parsed from raw-data.csv

export interface StaffData {
  name: string;
  role: "PT" | "BT";
  ptBs: number;
  sw: number;
  totalRevenue: number;
  proOnline: number;
  newSales: number;
  renewSales: number;
  referral: number;
  newReceived: number;
  addOn: number;
  newClosed: number;
  renewToday: number;
  renewClosed: number;
  treatmentPrice: number;
}

export interface BranchData {
  name: string;
  code: string;
  targetRevenue: number;
  mtdRevenue: number;
  achievePercent: number;
  diffRevenue: number;
  closedRatioNew: number;
  closedRatioRenew: number;
  addOnPercent: number;
  staff: StaffData[];
  totals: {
    newReceived: number;
    addOn: number;
    newClosed: number;
    renewToday: number;
    renewClosed: number;
  };
}

export const branchesData: BranchData[] = [
  {
    name: "สาขา T59",
    code: "T59",
    targetRevenue: 1500000,
    mtdRevenue: 1021709,
    achievePercent: 68.11,
    diffRevenue: 478291,
    closedRatioNew: 48,
    closedRatioRenew: 81.1,
    addOnPercent: 56,
    staff: [
      {
        name: "PT Keen",
        role: "PT",
        ptBs: 151,
        sw: 57,
        totalRevenue: 307856,
        proOnline: 7593,
        newSales: 18232.5,
        renewSales: 229840,
        referral: 52190,
        newReceived: 3,
        addOn: 4,
        newClosed: 1,
        renewToday: 10,
        renewClosed: 7,
        treatmentPrice: 275820,
      },
      {
        name: "PT Jane",
        role: "PT",
        ptBs: 151,
        sw: 70,
        totalRevenue: 315512,
        proOnline: 12789,
        newSales: 81132.5,
        renewSales: 194790,
        referral: 26800,
        newReceived: 8,
        addOn: 6,
        newClosed: 4,
        renewToday: 7,
        renewClosed: 7,
        treatmentPrice: 289430,
      },
      {
        name: "PT Tan",
        role: "PT",
        ptBs: 132,
        sw: 58,
        totalRevenue: 247043,
        proOnline: 13088,
        newSales: 73515,
        renewSales: 87940,
        referral: 72500,
        newReceived: 5,
        addOn: 4,
        newClosed: 2,
        renewToday: 6,
        renewClosed: 6,
        treatmentPrice: 251774,
      },
      {
        name: "BT Miw",
        role: "BT",
        ptBs: 104.5,
        sw: 0,
        totalRevenue: 111600,
        proOnline: 0,
        newSales: 14200,
        renewSales: 81600,
        referral: 15800,
        newReceived: 4,
        addOn: 0,
        newClosed: 3,
        renewToday: 6,
        renewClosed: 5,
        treatmentPrice: 78260,
      },
      {
        name: "BT Oil",
        role: "BT",
        ptBs: 44,
        sw: 0,
        totalRevenue: 39699,
        proOnline: 799,
        newSales: 21100,
        renewSales: 17800,
        referral: 0,
        newReceived: 5,
        addOn: 0,
        newClosed: 2,
        renewToday: 2,
        renewClosed: 2,
        treatmentPrice: 31159,
      },
    ],
    totals: {
      newReceived: 25,
      addOn: 14,
      newClosed: 12,
      renewToday: 31,
      renewClosed: 27,
    },
  },
  {
    name: "สาขา MRS",
    code: "MRS",
    targetRevenue: 1500000,
    mtdRevenue: 840231,
    achievePercent: 56.02,
    diffRevenue: 659769,
    closedRatioNew: 53.33,
    closedRatioRenew: 58.33,
    addOnPercent: 41.67,
    staff: [
      {
        name: "PT Ploy",
        role: "PT",
        ptBs: 101,
        sw: 49,
        totalRevenue: 314081,
        proOnline: 8992,
        newSales: 287289,
        renewSales: 17800,
        referral: 0,
        newReceived: 13,
        addOn: 12,
        newClosed: 11,
        renewToday: 3,
        renewClosed: 2,
        treatmentPrice: 183231,
      },
      {
        name: "PT Ta",
        role: "PT",
        ptBs: 107,
        sw: 44,
        totalRevenue: 267310,
        proOnline: 15786,
        newSales: 193775,
        renewSales: 56750,
        referral: 0,
        newReceived: 16,
        addOn: 7,
        newClosed: 11,
        renewToday: 10,
        renewClosed: 6,
        treatmentPrice: 192517,
      },
      {
        name: "PT Baiyok",
        role: "PT",
        ptBs: 106,
        sw: 50,
        totalRevenue: 117846,
        proOnline: 10091,
        newSales: 62475,
        renewSales: 45280,
        referral: 0,
        newReceived: 11,
        addOn: 5,
        newClosed: 3,
        renewToday: 7,
        renewClosed: 4,
        treatmentPrice: 208471,
      },
      {
        name: "BT Gate",
        role: "BT",
        ptBs: 78,
        sw: 0,
        totalRevenue: 37800,
        proOnline: 0,
        newSales: 25300,
        renewSales: 12500,
        referral: 0,
        newReceived: 8,
        addOn: 0,
        newClosed: 1,
        renewToday: 4,
        renewClosed: 2,
        treatmentPrice: 55190,
      },
      {
        name: "BT Ying",
        role: "BT",
        ptBs: 46,
        sw: 0,
        totalRevenue: 84898,
        proOnline: 1598,
        newSales: 76400,
        renewSales: 0,
        referral: 6900,
        newReceived: 10,
        addOn: 0,
        newClosed: 5,
        renewToday: 0,
        renewClosed: 0,
        treatmentPrice: 29938,
      },
      {
        name: "PT Yui",
        role: "PT",
        ptBs: 11,
        sw: 5,
        totalRevenue: 18296,
        proOnline: 3197,
        newSales: 15099,
        renewSales: 0,
        referral: 0,
        newReceived: 2,
        addOn: 1,
        newClosed: 1,
        renewToday: 0,
        renewClosed: 0,
        treatmentPrice: 24530,
      },
    ],
    totals: {
      newReceived: 60,
      addOn: 25,
      newClosed: 32,
      renewToday: 24,
      renewClosed: 14,
    },
  },
  {
    name: "สาขา RPK",
    code: "RPK",
    targetRevenue: 1500000,
    mtdRevenue: 950396,
    achievePercent: 63.36,
    diffRevenue: 549604,
    closedRatioNew: 71.88,
    closedRatioRenew: 59.38,
    addOnPercent: 91.3,
    staff: [
      {
        name: "PT Zin",
        role: "PT",
        ptBs: 183,
        sw: 82,
        totalRevenue: 485688,
        proOnline: 15087,
        newSales: 129440,
        renewSales: 315370,
        referral: 25791,
        newReceived: 13,
        addOn: 10,
        newClosed: 10,
        renewToday: 9,
        renewClosed: 8,
        treatmentPrice: 351586,
      },
      {
        name: "PT Pim",
        role: "PT",
        ptBs: 181,
        sw: 105,
        totalRevenue: 377083,
        proOnline: 10391,
        newSales: 169700,
        renewSales: 161180,
        referral: 35812,
        newReceived: 14,
        addOn: 9,
        newClosed: 12,
        renewToday: 8,
        renewClosed: 8,
        treatmentPrice: 404006,
      },
      {
        name: "PT Eve",
        role: "PT",
        ptBs: 2,
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
        treatmentPrice: 2176,
      },
      {
        name: "BT Fluke",
        role: "BT",
        ptBs: 80,
        sw: 0,
        totalRevenue: 50928,
        proOnline: 0,
        newSales: 1600,
        renewSales: 42299,
        referral: 7029,
        newReceived: 3,
        addOn: 0,
        newClosed: 0,
        renewToday: 4,
        renewClosed: 3,
        treatmentPrice: 56718,
      },
      {
        name: "BT June",
        role: "BT",
        ptBs: 54,
        sw: 0,
        totalRevenue: 36697,
        proOnline: 2397,
        newSales: 16800,
        renewSales: 17500,
        referral: 0,
        newReceived: 2,
        addOn: 0,
        newClosed: 1,
        renewToday: 2,
        renewClosed: 2,
        treatmentPrice: 40357,
      },
      {
        name: "PT Yui",
        role: "PT",
        ptBs: 3,
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
        treatmentPrice: 3395.5,
      },
    ],
    totals: {
      newReceived: 32,
      addOn: 19,
      newClosed: 23,
      renewToday: 23,
      renewClosed: 21,
    },
  },
  {
    name: "สาขา RS3",
    code: "RS3",
    targetRevenue: 600000,
    mtdRevenue: 421414,
    achievePercent: 70.24,
    diffRevenue: 178586,
    closedRatioNew: 42.5,
    closedRatioRenew: 77.5,
    addOnPercent: 144.44,
    staff: [
      {
        name: "PT Fiat",
        role: "PT",
        ptBs: 88,
        sw: 42,
        totalRevenue: 210200,
        proOnline: 21680,
        newSales: 127730,
        renewSales: 60790,
        referral: 0,
        newReceived: 13,
        addOn: 13,
        newClosed: 8,
        renewToday: 5,
        renewClosed: 7,
        treatmentPrice: 184415,
      },
      {
        name: "PT Japan",
        role: "PT",
        ptBs: 61,
        sw: 56,
        totalRevenue: 176723,
        proOnline: 17883,
        newSales: 120240,
        renewSales: 38600,
        referral: 0,
        newReceived: 13,
        addOn: 17,
        newClosed: 8,
        renewToday: 1,
        renewClosed: 3,
        treatmentPrice: 163039,
      },
      {
        name: "BT Aom",
        role: "BT",
        ptBs: 35,
        sw: 0,
        totalRevenue: 34491,
        proOnline: 7191,
        newSales: 10500,
        renewSales: 16800,
        referral: 0,
        newReceived: 14,
        addOn: 1,
        newClosed: 1,
        renewToday: 3,
        renewClosed: 3,
        treatmentPrice: 27181,
      },
    ],
    totals: {
      newReceived: 40,
      addOn: 31,
      newClosed: 17,
      renewToday: 9,
      renewClosed: 13,
    },
  },
];

// Helper functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("th-TH", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getBranchTotalRevenue = (branch: BranchData): number => {
  return branch.staff.reduce((sum, s) => sum + s.totalRevenue, 0);
};

export const getBranchTotalNew = (branch: BranchData): number => {
  return branch.staff.reduce((sum, s) => sum + s.newSales, 0);
};

export const getBranchTotalRenew = (branch: BranchData): number => {
  return branch.staff.reduce((sum, s) => sum + s.renewSales, 0);
};

export const getAllBranchesTotalRevenue = (): number => {
  return branchesData.reduce((sum, b) => sum + getBranchTotalRevenue(b), 0);
};

export const getAllBranchesTotalTarget = (): number => {
  return branchesData.reduce((sum, b) => sum + b.targetRevenue, 0);
};

export const getAllBranchesMTD = (): number => {
  return branchesData.reduce((sum, b) => sum + b.mtdRevenue, 0);
};
