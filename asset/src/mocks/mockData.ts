export type TransactionType = "income" | "expense";

export type ReportPeriod = "day" | "week" | "month" | "year";

export interface MockTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
}

export interface Totals {
  income: number;
  expense: number;
  balance: number;
  count: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
  count: number;
  percent: number;
}

export interface ChartPoint {
  key: string;
  label: string;
  shortLabel: string;
  income: number;
  expense: number;
  balance: number;
}

export interface TransactionGroup {
  date: string;
  label: string;
  income: number;
  expense: number;
  items: MockTransaction[];
}

export interface PeriodOverview {
  key: ReportPeriod;
  title: string;
  range: string;
  income: number;
  expense: number;
  change: number;
  compareLabel: string;
}

export interface ReportChart {
  title: string;
  description: string;
  series: TransactionType[];
  labelEvery: number;
  data: ChartPoint[];
}

export interface ReportData {
  period: ReportPeriod;
  label: string;
  range: string;
  totals: Totals;
  chart: ReportChart | null;
  byCategory: {
    expense: CategoryTotal[];
    income: CategoryTotal[];
  };
  transactions: MockTransaction[];
}

export const mockToday = {
  date: "2026-09-27",
  label: "Chủ nhật, 27 tháng 9, 2026",
};

export const transactionGroups: TransactionGroup[] = [
  {
    date: "2026-09-27",
    label: "Hôm nay · Chủ nhật, 27/09",
    income: 0,
    expense: 285000,
    items: [
      { id: "t23", type: "expense", amount: 90000, category: "Giải trí", note: "Xem phim CGV", date: "2026-09-27" },
      { id: "t22", type: "expense", amount: 150000, category: "Ăn uống", note: "Ăn trưa cùng bạn", date: "2026-09-27" },
      { id: "t21", type: "expense", amount: 45000, category: "Ăn uống", note: "Cà phê sáng", date: "2026-09-27" },
    ],
  },
  {
    date: "2026-09-26",
    label: "Hôm qua · Thứ bảy, 26/09",
    income: 0,
    expense: 780000,
    items: [
      { id: "t20", type: "expense", amount: 180000, category: "Ăn uống", note: "Lẩu cuối tuần", date: "2026-09-26" },
      { id: "t19", type: "expense", amount: 80000, category: "Di chuyển", note: "Đổ xăng", date: "2026-09-26" },
      { id: "t18", type: "expense", amount: 520000, category: "Mua sắm", note: "Siêu thị Co.op Mart", date: "2026-09-26" },
    ],
  },
  {
    date: "2026-09-25",
    label: "Thứ sáu, 25/09",
    income: 0,
    expense: 135000,
    items: [
      { id: "t17", type: "expense", amount: 50000, category: "Di chuyển", note: "Grab về nhà", date: "2026-09-25" },
      { id: "t16", type: "expense", amount: 40000, category: "Ăn uống", note: "Trà sữa", date: "2026-09-25" },
      { id: "t15", type: "expense", amount: 45000, category: "Ăn uống", note: "Cơm trưa", date: "2026-09-25" },
    ],
  },
  {
    date: "2026-09-24",
    label: "Thứ năm, 24/09",
    income: 0,
    expense: 460000,
    items: [
      { id: "t14", type: "expense", amount: 110000, category: "Ăn uống", note: "Ăn tối", date: "2026-09-24" },
      { id: "t13", type: "expense", amount: 50000, category: "Ăn uống", note: "Cơm trưa", date: "2026-09-24" },
      { id: "t12", type: "expense", amount: 300000, category: "Sức khỏe", note: "Khám răng", date: "2026-09-24" },
    ],
  },
  {
    date: "2026-09-23",
    label: "Thứ tư, 23/09",
    income: 0,
    expense: 90000,
    items: [
      { id: "t11", type: "expense", amount: 20000, category: "Di chuyển", note: "Gửi xe", date: "2026-09-23" },
      { id: "t10", type: "expense", amount: 45000, category: "Ăn uống", note: "Cơm trưa", date: "2026-09-23" },
      { id: "t09", type: "expense", amount: 25000, category: "Ăn uống", note: "Bánh mì", date: "2026-09-23" },
    ],
  },
  {
    date: "2026-09-22",
    label: "Thứ ba, 22/09",
    income: 0,
    expense: 185000,
    items: [
      { id: "t08", type: "expense", amount: 40000, category: "Ăn uống", note: "Cà phê", date: "2026-09-22" },
      { id: "t07", type: "expense", amount: 100000, category: "Hóa đơn", note: "Nạp tiền điện thoại", date: "2026-09-22" },
      { id: "t06", type: "expense", amount: 45000, category: "Ăn uống", note: "Cơm trưa", date: "2026-09-22" },
    ],
  },
  {
    date: "2026-09-21",
    label: "Thứ hai, 21/09",
    income: 0,
    expense: 115000,
    items: [
      { id: "t05", type: "expense", amount: 60000, category: "Di chuyển", note: "Grab đi làm", date: "2026-09-21" },
      { id: "t04", type: "expense", amount: 55000, category: "Ăn uống", note: "Phở bò", date: "2026-09-21" },
    ],
  },
  {
    date: "2026-09-20",
    label: "Chủ nhật, 20/09",
    income: 350000,
    expense: 650000,
    items: [
      { id: "t03", type: "expense", amount: 350000, category: "Giải trí", note: "Karaoke cùng đồng nghiệp", date: "2026-09-20" },
      { id: "t02", type: "expense", amount: 300000, category: "Khác", note: "Quà sinh nhật bạn", date: "2026-09-20" },
      { id: "t01", type: "income", amount: 350000, category: "Đầu tư", note: "Lãi tiết kiệm", date: "2026-09-20" },
    ],
  },
];

export const recentTransactions: MockTransaction[] = [
  ...transactionGroups[0].items,
  ...transactionGroups[1].items,
];

export const monthBalance = {
  label: "Tháng 09/2026",
  balance: 7980000,
  income: 20850000,
  expense: 12870000,
  spentRatio: 61.7,
};

export const overview: PeriodOverview[] = [
  { key: "day", title: "Hôm nay", range: "27/09", income: 0, expense: 285000, change: -63.5, compareLabel: "so với hôm qua" },
  { key: "week", title: "Tuần này", range: "21/09 – 27/09", income: 0, expense: 2050000, change: 1.2, compareLabel: "so với tuần trước" },
  { key: "month", title: "Tháng này", range: "Tháng 09", income: 20850000, expense: 12870000, change: -11.3, compareLabel: "so với tháng 8" },
  { key: "year", title: "Năm nay", range: "2026", income: 178850000, expense: 130380000, change: -5.8, compareLabel: "so với cùng kỳ 2025" },
];

export const sixMonthSeries: ChartPoint[] = [
  { key: "2026-04", label: "Tháng 04/2026", shortLabel: "T4", income: 18500000, expense: 12840000, balance: 5660000 },
  { key: "2026-05", label: "Tháng 05/2026", shortLabel: "T5", income: 19200000, expense: 14360000, balance: 4840000 },
  { key: "2026-06", label: "Tháng 06/2026", shortLabel: "T6", income: 18500000, expense: 11920000, balance: 6580000 },
  { key: "2026-07", label: "Tháng 07/2026", shortLabel: "T7", income: 21300000, expense: 15780000, balance: 5520000 },
  { key: "2026-08", label: "Tháng 08/2026", shortLabel: "T8", income: 19000000, expense: 14510000, balance: 4490000 },
  { key: "2026-09", label: "Tháng 09/2026", shortLabel: "T9", income: 20850000, expense: 12870000, balance: 7980000 },
];

const monthExpenseByCategory: CategoryTotal[] = [
  { category: "Nhà ở", total: 4500000, count: 1, percent: 35 },
  { category: "Ăn uống", total: 2860000, count: 21, percent: 22.2 },
  { category: "Mua sắm", total: 1980000, count: 4, percent: 15.4 },
  { category: "Hóa đơn", total: 1300000, count: 5, percent: 10.1 },
  { category: "Di chuyển", total: 820000, count: 9, percent: 6.4 },
  { category: "Giải trí", total: 690000, count: 3, percent: 5.4 },
  { category: "Sức khỏe", total: 420000, count: 2, percent: 3.3 },
  { category: "Khác", total: 300000, count: 1, percent: 2.3 },
];

export const dashboardCategories = monthExpenseByCategory.slice(0, 6);

export const reports: Record<ReportPeriod, ReportData> = {
  day: {
    period: "day",
    label: "27/09/2026",
    range: "Chủ nhật",
    totals: { income: 0, expense: 285000, balance: -285000, count: 3 },
    chart: null,
    byCategory: {
      expense: [
        { category: "Ăn uống", total: 195000, count: 2, percent: 68.4 },
        { category: "Giải trí", total: 90000, count: 1, percent: 31.6 },
      ],
      income: [],
    },
    transactions: transactionGroups[0].items,
  },
  week: {
    period: "week",
    label: "Tuần 39/2026",
    range: "21/09 – 27/09/2026",
    totals: { income: 0, expense: 2050000, balance: -2050000, count: 20 },
    chart: {
      title: "Chi tiêu theo ngày",
      description: "Tổng chi mỗi ngày trong tuần",
      series: ["expense"],
      labelEvery: 1,
      data: [
        { key: "2026-09-21", label: "Thứ hai, 21/09", shortLabel: "T2", income: 0, expense: 115000, balance: -115000 },
        { key: "2026-09-22", label: "Thứ ba, 22/09", shortLabel: "T3", income: 0, expense: 185000, balance: -185000 },
        { key: "2026-09-23", label: "Thứ tư, 23/09", shortLabel: "T4", income: 0, expense: 90000, balance: -90000 },
        { key: "2026-09-24", label: "Thứ năm, 24/09", shortLabel: "T5", income: 0, expense: 460000, balance: -460000 },
        { key: "2026-09-25", label: "Thứ sáu, 25/09", shortLabel: "T6", income: 0, expense: 135000, balance: -135000 },
        { key: "2026-09-26", label: "Thứ bảy, 26/09", shortLabel: "T7", income: 0, expense: 780000, balance: -780000 },
        { key: "2026-09-27", label: "Chủ nhật, 27/09", shortLabel: "CN", income: 0, expense: 285000, balance: -285000 },
      ],
    },
    byCategory: {
      expense: [
        { category: "Ăn uống", total: 830000, count: 12, percent: 40.5 },
        { category: "Mua sắm", total: 520000, count: 1, percent: 25.4 },
        { category: "Sức khỏe", total: 300000, count: 1, percent: 14.6 },
        { category: "Di chuyển", total: 210000, count: 4, percent: 10.2 },
        { category: "Hóa đơn", total: 100000, count: 1, percent: 4.9 },
        { category: "Giải trí", total: 90000, count: 1, percent: 4.4 },
      ],
      income: [],
    },
    transactions: [],
  },
  month: {
    period: "month",
    label: "Tháng 09/2026",
    range: "01/09 – 30/09/2026",
    totals: { income: 20850000, expense: 12870000, balance: 7980000, count: 49 },
    chart: {
      title: "Chi tiêu theo ngày",
      description: "Tổng chi mỗi ngày trong tháng",
      series: ["expense"],
      labelEvery: 5,
      data: [
        { key: "2026-09-01", label: "01/09/2026", shortLabel: "1", income: 0, expense: 4565000, balance: -4565000 },
        { key: "2026-09-02", label: "02/09/2026", shortLabel: "2", income: 0, expense: 120000, balance: -120000 },
        { key: "2026-09-03", label: "03/09/2026", shortLabel: "3", income: 0, expense: 85000, balance: -85000 },
        { key: "2026-09-04", label: "04/09/2026", shortLabel: "4", income: 0, expense: 310000, balance: -310000 },
        { key: "2026-09-05", label: "05/09/2026", shortLabel: "5", income: 18500000, expense: 95000, balance: 18405000 },
        { key: "2026-09-06", label: "06/09/2026", shortLabel: "6", income: 0, expense: 560000, balance: -560000 },
        { key: "2026-09-07", label: "07/09/2026", shortLabel: "7", income: 0, expense: 140000, balance: -140000 },
        { key: "2026-09-08", label: "08/09/2026", shortLabel: "8", income: 0, expense: 75000, balance: -75000 },
        { key: "2026-09-09", label: "09/09/2026", shortLabel: "9", income: 0, expense: 220000, balance: -220000 },
        { key: "2026-09-10", label: "10/09/2026", shortLabel: "10", income: 0, expense: 990000, balance: -990000 },
        { key: "2026-09-11", label: "11/09/2026", shortLabel: "11", income: 0, expense: 130000, balance: -130000 },
        { key: "2026-09-12", label: "12/09/2026", shortLabel: "12", income: 0, expense: 265000, balance: -265000 },
        { key: "2026-09-13", label: "13/09/2026", shortLabel: "13", income: 0, expense: 1240000, balance: -1240000 },
        { key: "2026-09-14", label: "14/09/2026", shortLabel: "14", income: 0, expense: 180000, balance: -180000 },
        { key: "2026-09-15", label: "15/09/2026", shortLabel: "15", income: 2000000, expense: 320000, balance: 1680000 },
        { key: "2026-09-16", label: "16/09/2026", shortLabel: "16", income: 0, expense: 95000, balance: -95000 },
        { key: "2026-09-17", label: "17/09/2026", shortLabel: "17", income: 0, expense: 150000, balance: -150000 },
        { key: "2026-09-18", label: "18/09/2026", shortLabel: "18", income: 0, expense: 210000, balance: -210000 },
        { key: "2026-09-19", label: "19/09/2026", shortLabel: "19", income: 0, expense: 420000, balance: -420000 },
        { key: "2026-09-20", label: "20/09/2026", shortLabel: "20", income: 350000, expense: 650000, balance: -300000 },
        { key: "2026-09-21", label: "21/09/2026", shortLabel: "21", income: 0, expense: 115000, balance: -115000 },
        { key: "2026-09-22", label: "22/09/2026", shortLabel: "22", income: 0, expense: 185000, balance: -185000 },
        { key: "2026-09-23", label: "23/09/2026", shortLabel: "23", income: 0, expense: 90000, balance: -90000 },
        { key: "2026-09-24", label: "24/09/2026", shortLabel: "24", income: 0, expense: 460000, balance: -460000 },
        { key: "2026-09-25", label: "25/09/2026", shortLabel: "25", income: 0, expense: 135000, balance: -135000 },
        { key: "2026-09-26", label: "26/09/2026", shortLabel: "26", income: 0, expense: 780000, balance: -780000 },
        { key: "2026-09-27", label: "27/09/2026", shortLabel: "27", income: 0, expense: 285000, balance: -285000 },
        { key: "2026-09-28", label: "28/09/2026", shortLabel: "28", income: 0, expense: 0, balance: 0 },
        { key: "2026-09-29", label: "29/09/2026", shortLabel: "29", income: 0, expense: 0, balance: 0 },
        { key: "2026-09-30", label: "30/09/2026", shortLabel: "30", income: 0, expense: 0, balance: 0 },
      ],
    },
    byCategory: {
      expense: monthExpenseByCategory,
      income: [
        { category: "Lương", total: 18500000, count: 1, percent: 88.7 },
        { category: "Thưởng", total: 2000000, count: 1, percent: 9.6 },
        { category: "Đầu tư", total: 350000, count: 1, percent: 1.7 },
      ],
    },
    transactions: [],
  },
  year: {
    period: "year",
    label: "Năm 2026",
    range: "01/01 – 31/12/2026",
    totals: { income: 178850000, expense: 130380000, balance: 48470000, count: 427 },
    chart: {
      title: "Thu chi theo tháng",
      description: "So sánh tổng thu và tổng chi từng tháng",
      series: ["income", "expense"],
      labelEvery: 1,
      data: [
        { key: "2026-01", label: "Tháng 01/2026", shortLabel: "T1", income: 18500000, expense: 16200000, balance: 2300000 },
        { key: "2026-02", label: "Tháng 02/2026", shortLabel: "T2", income: 24500000, expense: 19800000, balance: 4700000 },
        { key: "2026-03", label: "Tháng 03/2026", shortLabel: "T3", income: 18500000, expense: 12100000, balance: 6400000 },
        { key: "2026-04", label: "Tháng 04/2026", shortLabel: "T4", income: 18500000, expense: 12840000, balance: 5660000 },
        { key: "2026-05", label: "Tháng 05/2026", shortLabel: "T5", income: 19200000, expense: 14360000, balance: 4840000 },
        { key: "2026-06", label: "Tháng 06/2026", shortLabel: "T6", income: 18500000, expense: 11920000, balance: 6580000 },
        { key: "2026-07", label: "Tháng 07/2026", shortLabel: "T7", income: 21300000, expense: 15780000, balance: 5520000 },
        { key: "2026-08", label: "Tháng 08/2026", shortLabel: "T8", income: 19000000, expense: 14510000, balance: 4490000 },
        { key: "2026-09", label: "Tháng 09/2026", shortLabel: "T9", income: 20850000, expense: 12870000, balance: 7980000 },
        { key: "2026-10", label: "Tháng 10/2026", shortLabel: "T10", income: 0, expense: 0, balance: 0 },
        { key: "2026-11", label: "Tháng 11/2026", shortLabel: "T11", income: 0, expense: 0, balance: 0 },
        { key: "2026-12", label: "Tháng 12/2026", shortLabel: "T12", income: 0, expense: 0, balance: 0 },
      ],
    },
    byCategory: {
      expense: [
        { category: "Nhà ở", total: 40500000, count: 9, percent: 31.1 },
        { category: "Ăn uống", total: 34230000, count: 246, percent: 26.3 },
        { category: "Mua sắm", total: 16850000, count: 31, percent: 12.9 },
        { category: "Hóa đơn", total: 11240000, count: 42, percent: 8.6 },
        { category: "Di chuyển", total: 7380000, count: 58, percent: 5.7 },
        { category: "Giải trí", total: 6120000, count: 11, percent: 4.7 },
        { category: "Khác", total: 5600000, count: 6, percent: 4.3 },
        { category: "Giáo dục", total: 4500000, count: 2, percent: 3.5 },
        { category: "Sức khỏe", total: 3960000, count: 7, percent: 3 },
      ],
      income: [
        { category: "Lương", total: 166500000, count: 9, percent: 93.1 },
        { category: "Thưởng", total: 10800000, count: 3, percent: 6 },
        { category: "Đầu tư", total: 1550000, count: 3, percent: 0.9 },
      ],
    },
    transactions: [],
  },
};
