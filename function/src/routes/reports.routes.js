import { Router } from 'express';
import { transactionsStore } from '../db.js';
import { parseDate, periodStart, today } from '../lib/date.js';
import { HttpError } from '../lib/httpError.js';
import { queryDate, queryPeriod, queryRange } from '../lib/validate.js';
import { buildOverview, buildSeries, buildSummary } from '../services/report.service.js';

const router = Router();

// Số kỳ mặc định của /series khi không truyền "from"
const DEFAULT_SERIES_LENGTH = { day: 30, week: 12, month: 12, year: 5 };

const userTransactions = (userId) =>
  transactionsStore.read((all) => all.filter((tx) => tx.userId === userId));

const dateParam = (value) => parseDate(queryDate(value, 'date') ?? today());

// GET /api/reports/overview?date=YYYY-MM-DD
// Tổng thu/chi của ngày, tuần, tháng, năm chứa `date` (mặc định hôm nay)
router.get('/overview', async (req, res) => {
  const date = dateParam(req.query.date);
  res.json(buildOverview(await userTransactions(req.user.id), date));
});

// GET /api/reports/summary?period=day|week|month|year&date=YYYY-MM-DD
// Chi tiết một kỳ: tổng, theo danh mục, chia nhỏ theo ngày (tuần/tháng) hoặc theo tháng (năm)
router.get('/summary', async (req, res) => {
  const period = queryPeriod(req.query.period);
  const date = dateParam(req.query.date);
  res.json(buildSummary(await userTransactions(req.user.id), period, date));
});

// GET /api/reports/series?period=day|week|month|year&from=YYYY-MM-DD&to=YYYY-MM-DD
// Tổng theo từng kỳ trong một khoảng thời gian (để vẽ biểu đồ)
router.get('/series', async (req, res) => {
  const period = queryPeriod(req.query.period);
  const { from, to } = queryRange(req.query);
  const end = parseDate(to ?? today());
  const start = from ? parseDate(from) : periodStart(end, period, 1 - DEFAULT_SERIES_LENGTH[period]);
  if (start > end) throw new HttpError(400, '"from" phải trước hoặc bằng "to"');

  res.json(buildSeries(await userTransactions(req.user.id), period, start, end));
});

export default router;
