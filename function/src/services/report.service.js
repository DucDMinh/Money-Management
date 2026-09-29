import { PERIODS, describePeriod, formatDate, parseDate, periodEnd, periodKey, periodStart } from '../lib/date.js';
import { HttpError } from '../lib/httpError.js';

// Kỳ con dùng để chia nhỏ khi xem tổng hợp một kỳ: tuần/tháng → từng ngày, năm → từng tháng
const SUB_PERIOD = { day: null, week: 'day', month: 'day', year: 'month' };
const MAX_BUCKETS = 1000;

const round2 = (n) => Math.round(n * 100) / 100;

/** % thay đổi so với kỳ trước, làm tròn 1 chữ số; null khi kỳ trước bằng 0 (không so sánh được) */
const percentChange = (current, previous) =>
  previous === 0 ? null : Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;

function emptyTotals() {
  return { income: 0, expense: 0, balance: 0, count: 0 };
}

function addTransaction(totals, tx) {
  totals[tx.type] += tx.amount;
  totals.count += 1;
}

function finishTotals(totals) {
  totals.income = round2(totals.income);
  totals.expense = round2(totals.expense);
  totals.balance = round2(totals.income - totals.expense);
  return totals;
}

/** Tổng thu, tổng chi, số dư (thu - chi) và số giao dịch */
export function sumTotals(transactions) {
  const totals = emptyTotals();
  for (const tx of transactions) addTransaction(totals, tx);
  return finishTotals(totals);
}

function filterByRange(transactions, start, end) {
  const from = formatDate(start);
  const to = formatDate(end);
  return transactions.filter((tx) => tx.date >= from && tx.date <= to);
}

/** Chia [start, end] thành các kỳ liên tiếp (kể cả kỳ không có giao dịch) rồi cộng dồn giao dịch vào từng kỳ */
function groupByPeriod(transactions, period, start, end) {
  const buckets = new Map();
  for (let cur = periodStart(start, period); cur <= end; cur = periodStart(cur, period, 1)) {
    if (buckets.size >= MAX_BUCKETS) {
      throw new HttpError(400, `Khoảng thời gian quá dài (tối đa ${MAX_BUCKETS} kỳ "${period}")`);
    }
    const info = describePeriod(cur, period);
    buckets.set(info.key, { ...info, ...emptyTotals() });
  }

  for (const tx of transactions) {
    const bucket = buckets.get(periodKey(parseDate(tx.date), period));
    if (bucket) addTransaction(bucket, tx);
  }
  return [...buckets.values()].map(finishTotals);
}

/** Tổng theo danh mục, tách riêng chi và thu, sắp xếp giảm dần; percent = % trên tổng chi (hoặc tổng thu) */
function groupByCategory(transactions) {
  const result = {};
  for (const type of ['expense', 'income']) {
    const groups = new Map();
    let typeTotal = 0;
    for (const tx of transactions) {
      if (tx.type !== type) continue;
      const group = groups.get(tx.category) ?? { category: tx.category, total: 0, count: 0 };
      group.total += tx.amount;
      group.count += 1;
      groups.set(tx.category, group);
      typeTotal += tx.amount;
    }
    result[type] = [...groups.values()]
      .map((g) => ({ ...g, total: round2(g.total), percent: typeTotal ? round2((g.total / typeTotal) * 100) : 0 }))
      .sort((a, b) => b.total - a.total);
  }
  return result;
}

/** Tổng hợp chi tiết một kỳ (ngày/tuần/tháng/năm) chứa ngày `date` */
export function buildSummary(transactions, period, date) {
  const start = periodStart(date, period);
  const end = periodEnd(date, period);
  const list = filterByRange(transactions, start, end);
  const subPeriod = SUB_PERIOD[period];

  return {
    period,
    ...describePeriod(date, period),
    prev: formatDate(periodStart(date, period, -1)),
    next: formatDate(periodStart(date, period, 1)),
    totals: sumTotals(list),
    byCategory: groupByCategory(list),
    subPeriod,
    breakdown: subPeriod ? groupByPeriod(list, subPeriod, start, end) : [],
  };
}

/** Tổng hợp theo từng kỳ trong khoảng [from, to] (mở rộng ra trọn kỳ ở 2 đầu) — dùng vẽ biểu đồ */
export function buildSeries(transactions, period, from, to) {
  const start = periodStart(from, period);
  const end = periodEnd(to, period);
  const list = filterByRange(transactions, start, end);

  return {
    period,
    start: formatDate(start),
    end: formatDate(end),
    totals: sumTotals(list),
    items: groupByPeriod(list, period, start, end),
  };
}

/**
 * Tổng nhanh của ngày / tuần / tháng / năm chứa ngày `date` — dùng cho dashboard.
 * Mỗi kỳ kèm `previous` (tổng của kỳ trước tính tới cùng thời điểm) và `change` (% thay đổi thu/chi).
 */
export function buildOverview(transactions, date) {
  const overview = { date: formatDate(date) };
  for (const period of PERIODS) {
    const start = periodStart(date, period);
    // So sánh cùng số ngày đã trôi qua: 01/09→29/09 với 01/08→29/08 (không vượt quá cuối kỳ trước)
    const previousStart = periodStart(date, period, -1);
    const previousEnd = new Date(
      Math.min(previousStart.getTime() + (date - start), periodEnd(previousStart, period).getTime()),
    );
    const current = sumTotals(filterByRange(transactions, start, date));
    const previous = sumTotals(filterByRange(transactions, previousStart, previousEnd));

    overview[period] = {
      ...describePeriod(date, period),
      totals: sumTotals(filterByRange(transactions, start, periodEnd(date, period))),
      previous: { ...describePeriod(previousStart, period), end: formatDate(previousEnd), totals: previous },
      change: {
        income: percentChange(current.income, previous.income),
        expense: percentChange(current.expense, previous.expense),
      },
    };
  }
  return overview;
}
