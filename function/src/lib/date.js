import config from '../config.js';

export const PERIODS = ['day', 'week', 'month', 'year'];

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

// Mọi ngày được biểu diễn bằng Date lúc 00:00 UTC để tính toán không bị lệch múi giờ
const utc = (y, m, d) => new Date(Date.UTC(y, m, d));
const pad = (n) => String(n).padStart(2, '0');
const dayMonth = (date) => `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}`;

/** 'YYYY-MM-DD' → Date; trả về null nếu sai định dạng hoặc ngày không tồn tại (vd 2026-02-30) */
export function parseDate(value) {
  const match = typeof value === 'string' ? DATE_RE.exec(value) : null;
  if (!match) return null;
  const [y, m, d] = match.slice(1).map(Number);
  const date = utc(y, m - 1, d);
  const valid = y >= 1000 && date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  return valid ? date : null;
}

export const isValidDate = (value) => parseDate(value) !== null;

export const formatDate = (date) => date.toISOString().slice(0, 10);

const todayFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: config.timezone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Ngày hôm nay ('YYYY-MM-DD') theo múi giờ trong config */
export function today() {
  const parts = Object.fromEntries(todayFormat.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Ngày đầu của kỳ chứa `date`, dịch thêm `offset` kỳ. Tuần bắt đầu từ thứ Hai. */
export function periodStart(date, period, offset = 0) {
  const y = date.getUTCFullYear(); //2026
  const m = date.getUTCMonth(); //09
  const d = date.getUTCDate(); //27
  switch (period) {
    case 'day':
      return utc(y, m, d + offset); //2026-09-27
    case 'week':
      return utc(y, m, d - ((date.getUTCDay() + 6) % 7) + 7 * offset);
    case 'month':
      return utc(y, m + offset, 1);
    case 'year':
      return utc(y + offset, 0, 1);
    default:
      throw new Error(`Kỳ không hợp lệ: ${period}`);
  }
}

/** Ngày cuối của kỳ chứa `date` */
export const periodEnd = (date, period) => new Date(periodStart(date, period, 1).getTime() - DAY_MS);

/** Tuần theo chuẩn ISO-8601: tuần thuộc về năm chứa ngày thứ Năm của tuần đó */
function isoWeek(date) {
  const thursday = new Date(periodStart(date, 'week').getTime() + 3 * DAY_MS);
  const year = thursday.getUTCFullYear();
  const week = Math.floor((thursday - utc(year, 0, 1)) / (7 * DAY_MS)) + 1;
  return { year, week };
}

/** Mã định danh kỳ: 2026-09-28 | 2026-W40 | 2026-09 | 2026 */
export function periodKey(date, period) {
  const start = periodStart(date, period);
  switch (period) {
    case 'day':
      return formatDate(start);
    case 'week': {
      const { year, week } = isoWeek(start);
      return `${year}-W${pad(week)}`;
    }
    case 'month':
      return formatDate(start).slice(0, 7);
    case 'year':
      return String(start.getUTCFullYear());
  }
}

/** Nhãn hiển thị: 28/09/2026 | Tuần 40/2026 (28/09 - 04/10) | Tháng 09/2026 | Năm 2026 */
export function periodLabel(date, period) {
  const start = periodStart(date, period);
  switch (period) {
    case 'day':
      return `${dayMonth(start)}/${start.getUTCFullYear()}`;
    case 'week': {
      const { year, week } = isoWeek(start);
      return `Tuần ${week}/${year} (${dayMonth(start)} - ${dayMonth(periodEnd(start, 'week'))})`;
    }
    case 'month':
      return `Tháng ${pad(start.getUTCMonth() + 1)}/${start.getUTCFullYear()}`;
    case 'year':
      return `Năm ${start.getUTCFullYear()}`;
  }
}

/** Thông tin đầy đủ của kỳ chứa `date` */
export function describePeriod(date, period) {
  const start = periodStart(date, period);
  return {
    key: periodKey(start, period),
    label: periodLabel(start, period),
    start: formatDate(start),
    end: formatDate(periodEnd(start, period)),
  };
}
