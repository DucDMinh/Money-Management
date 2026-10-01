import {
  endOfMonth,
  endOfYear,
  format,
  isThisYear,
  isToday,
  isYesterday,
  parseISO,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";

export type DatePreset =
  | "today"
  | "last-7-days"
  | "this-month"
  | "last-month"
  | "this-year"
  | "all";

export interface DateRange {
  from?: string;
  to?: string;
}

const WEEKDAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

export const toISODate = (date: Date) => format(date, "yyyy-MM-dd");

export const todayISO = () => toISODate(new Date());
export const getDateRange = (preset: DatePreset, now = new Date()): DateRange => {
  switch (preset) {
    case "today":
      return { from: toISODate(now), to: toISODate(now) };
    case "last-7-days":
      return { from: toISODate(subDays(now, 6)), to: toISODate(now) };
    case "this-month":
      return { from: toISODate(startOfMonth(now)), to: toISODate(endOfMonth(now)) };
    case "last-month": {
      const lastMonth = subMonths(now, 1);
      return { from: toISODate(startOfMonth(lastMonth)), to: toISODate(endOfMonth(lastMonth)) };
    }
    case "this-year":
      return { from: toISODate(startOfYear(now)), to: toISODate(endOfYear(now)) };
    default:
      return {};
  }
};

export const formatDayLabel = (isoDate: string) => {
  const date = parseISO(isoDate);
  const dayMonth = format(date, isThisYear(date) ? "dd/MM" : "dd/MM/yyyy");
  const label = `${WEEKDAYS[date.getDay()]}, ${dayMonth}`;

  if (isToday(date)) return `Hôm nay · ${label}`;
  if (isYesterday(date)) return `Hôm qua · ${label}`;
  return label;
};

/** "Thứ hai, 28/9" — thêm năm nếu không phải năm nay */
export const formatWeekdayDate = (isoDate: string) => {
  const date = parseISO(isoDate);
  return `${WEEKDAYS[date.getDay()]}, ${format(date, isThisYear(date) ? "d/M" : "d/M/yyyy")}`;
};

export const formatLongDate = (isoDate: string) => {
  const date = parseISO(isoDate);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
};
