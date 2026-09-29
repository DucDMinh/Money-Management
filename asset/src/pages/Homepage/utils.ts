import { startOfMonth, subMonths } from "date-fns";
import { toISODate } from "@/helpers/date";
import { Overview, PeriodBucket, ReportPeriod } from "@/interfaces/report";

export const periodCards: { period: ReportPeriod; title: string; compareLabel: string }[] = [
  { period: "day", title: "Hôm nay", compareLabel: "so với hôm qua" },
  { period: "week", title: "Tuần này", compareLabel: "so với cùng kỳ tuần trước" },
  { period: "month", title: "Tháng này", compareLabel: "so với cùng kỳ tháng trước" },
  { period: "year", title: "Năm nay", compareLabel: "so với cùng kỳ năm trước" },
];

const dayMonth = (isoDate: string) => {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
};

export const getPeriodRangeLabel = (period: ReportPeriod, overview: Overview) => {
  const [year, month] = overview.start.split("-");
  if (period === "day") return dayMonth(overview.start);
  if (period === "week") return `${dayMonth(overview.start)} – ${dayMonth(overview.end)}`;
  if (period === "month") return `Tháng ${month}`;
  return year;
};

export const getSixMonthRange = () => {
  const now = new Date();
  return { from: toISODate(startOfMonth(subMonths(now, 5))), to: toISODate(now) };
};

export const getSeriesRangeLabel = (start: string, end: string) => {
  const [startYear, startMonth] = start.split("-");
  const [endYear, endMonth] = end.split("-");
  return startYear === endYear
    ? `Tháng ${startMonth} – ${endMonth}/${endYear}`
    : `Tháng ${startMonth}/${startYear} – ${endMonth}/${endYear}`;
};

export const toMonthlyChartPoints = (items: PeriodBucket[]) =>
  items.map((item) => ({
    key: item.key,
    label: item.label,
    shortLabel: `T${Number(item.start.split("-")[1])}`,
    income: item.income,
    expense: item.expense,
    balance: item.balance,
  }));
