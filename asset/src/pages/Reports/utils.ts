import { parseISO } from "date-fns";
import { formatDayLabel } from "@/helpers/date";
import { formatShortDate } from "@/helpers/format";
import { TransactionType } from "@/interfaces/transaction";
import { PeriodBucket, ReportPeriod, SummaryResponse } from "@/interfaces/report";

interface ChartConfig {
  title: string;
  description: string;
  series: TransactionType[];
  labelEvery: number;
}

const WEEKDAY_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export const chartConfigs: Record<ReportPeriod, ChartConfig | null> = {
  day: null,
  week: {
    title: "Chi tiêu theo ngày",
    description: "Tổng chi mỗi ngày trong tuần",
    series: ["expense"],
    labelEvery: 1,
  },
  month: {
    title: "Chi tiêu theo ngày",
    description: "Tổng chi mỗi ngày trong tháng",
    series: ["expense"],
    labelEvery: 5,
  },
  year: {
    title: "Thu chi theo tháng",
    description: "So sánh tổng thu và tổng chi từng tháng",
    series: ["income", "expense"],
    labelEvery: 1,
  },
};

const getShortLabel = (bucket: PeriodBucket, period: ReportPeriod) => {
  const date = parseISO(bucket.start);
  if (period === "week") return WEEKDAY_SHORT[date.getDay()];
  if (period === "month") return String(date.getDate());
  return `T${date.getMonth() + 1}`;
};

export const toChartPoints = (report: SummaryResponse) =>
  report.breakdown.map((bucket) => ({
    key: bucket.key,
    label: bucket.label,
    shortLabel: getShortLabel(bucket, report.period),
    income: bucket.income,
    expense: bucket.expense,
    balance: bucket.balance,
  }));

export const getRangeLabel = (report: SummaryResponse) =>
  report.period === "day"
    ? formatDayLabel(report.start)
    : `${formatShortDate(report.start)} – ${formatShortDate(report.end)}`;
