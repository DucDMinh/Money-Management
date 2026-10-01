import { getDaysInMonth, parseISO, startOfMonth, subDays, subMonths } from "date-fns";
import { formatWeekdayDate, toISODate } from "@/helpers/date";
import { formatNumber, formatPercent, formatVND } from "@/helpers/format";
import { Overview, PeriodBucket, ReportPeriod, SummaryResponse } from "@/interfaces/report";

/** Một ngày bất kỳ trong tháng trước của `isoDate` */
export const getPreviousMonthDate = (isoDate: string) =>
  toISODate(subMonths(parseISO(isoDate), 1));

/** Tháng hiện tại và 5 tháng trước đó */
export const getSixMonthRange = (isoDate: string) => ({
  from: toISODate(startOfMonth(subMonths(parseISO(isoDate), 5))),
  to: isoDate,
});

/** "2026-09-18" → "Tháng 9" */
export const getMonthName = (isoDate: string) => `Tháng ${Number(isoDate.split("-")[1])}`;

/** Tiêu đề nhóm giao dịch theo ngày: Hôm nay / Hôm qua / Thứ hai, 28/9 */
export const getDayHeading = (isoDate: string, today: string) => {
  if (isoDate === today) return "Hôm nay";
  if (isoDate === toISODate(subDays(parseISO(today), 1))) return "Hôm qua";
  return formatWeekdayDate(isoDate);
};

/** Chi cộng dồn theo từng ngày, dừng ở `until` (tính cả ngày đó) */
export const toCumulativeExpense = (items: PeriodBucket[], until?: string) => {
  let total = 0;
  return items
    .filter((item) => !until || item.start <= until)
    .map((item) => ({ date: item.start, value: (total += item.expense) }));
};

/** "cao hơn 8,8% so với cùng kỳ tháng 8" | "gấp 2,4 lần cùng kỳ tháng 8" */
export const describeChange = (change: number, target: string) => {
  if (change >= 100) return `gấp ${formatNumber(1 + change / 100)} lần ${target}`;
  if (change > 0) return `cao hơn ${formatPercent(change)} so với ${target}`;
  if (change < 0) return `thấp hơn ${formatPercent(-change)} so với ${target}`;
  return `bằng ${target}`;
};

/**
 * Câu mở đầu của trang: tháng này đang chi nhanh hay chậm hơn tháng trước.
 * `expense` là số đã chi tính đến hôm nay — cùng mốc với `month.change`.
 */
export const getPaceStory = (
  today: string,
  expense: number,
  month: Overview,
  lastMonth: SummaryResponse
) => {
  const date = parseISO(today);
  const day = date.getDate();
  const daysLeft = getDaysInMonth(date) - day;
  const monthName = getMonthName(today);
  const lastMonthName = getMonthName(lastMonth.start);
  const change = month.change.expense;

  const context = `${monthName}/${date.getFullYear()}, ${
    daysLeft === 0 ? "hôm nay là ngày cuối tháng" : `còn ${daysLeft} ngày`
  }`;

  if (expense === 0) {
    if (lastMonth.totals.expense === 0) {
      return {
        context,
        headline: "Chưa có khoản chi nào để theo dõi",
        detail: "Thêm khoản chi đầu tiên để xem tháng này bạn tiêu nhanh hay chậm.",
      };
    }
    const lastIncome = lastMonth.totals.income;
    return {
      context,
      headline: `${monthName} chưa có khoản chi nào`,
      detail: `${lastMonthName} bạn đã chi ${formatVND(lastMonth.totals.expense)}${
        lastIncome > 0 ? ` và thu ${formatVND(lastIncome)}` : ""
      }.`,
    };
  }

  const spent = `Đã chi ${formatVND(expense)} trong ${day} ngày`;

  if (change === null) {
    return {
      context,
      headline: `${monthName} bạn đã chi ${formatVND(expense)}`,
      detail: `Cùng kỳ ${lastMonthName.toLowerCase()} chưa có khoản chi nào để so sánh.`,
    };
  }

  const headline =
    change > 5
      ? "Bạn đang chi nhiều hơn tháng trước"
      : change < -5
      ? "Bạn đang chi ít hơn tháng trước"
      : "Bạn đang chi gần bằng tháng trước";

  return {
    context,
    headline,
    detail: `${spent}, ${describeChange(change, `cùng kỳ ${lastMonthName.toLowerCase()}`)}.`,
  };
};

export const horizons: { period: ReportPeriod; title: string; target: string }[] = [
  { period: "day", title: "Hôm nay đã chi", target: "hôm qua" },
  { period: "week", title: "Tuần này đã chi", target: "cùng kỳ tuần trước" },
  { period: "year", title: "Năm nay đã chi", target: "cùng kỳ năm trước" },
];
