import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { transactionsStore } from '../db.js';
import { HttpError } from '../lib/httpError.js';
import { validateListQuery, validateTransaction } from '../lib/validate.js';
import { sumTotals } from '../services/report.service.js';

const router = Router();

const notFoundError = () => new HttpError(404, 'Không tìm thấy giao dịch');
const newestFirst = (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);

function matchesFilters(tx, f) {
  if (f.from && tx.date < f.from) return false;
  if (f.to && tx.date > f.to) return false;
  if (f.type && tx.type !== f.type) return false;
  if (f.category && tx.category.toLowerCase() !== f.category.toLowerCase()) return false;
  if (f.q && !`${tx.category} ${tx.note}`.toLowerCase().includes(f.q.toLowerCase())) return false;
  return true;
}

// Danh sách giao dịch (lọc + phân trang), kèm tổng thu/chi của toàn bộ kết quả lọc
router.get('/', async (req, res) => {
  const filters = validateListQuery(req.query);
  const list = await transactionsStore.read((all) =>
    all.filter((tx) => tx.userId === req.user.id && matchesFilters(tx, filters)),
  );
  list.sort(newestFirst);

  const { page, limit } = filters;
  res.json({
    items: list.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total: list.length, totalPages: Math.ceil(list.length / limit) },
    totals: sumTotals(list),
  });
});

router.get('/:id', async (req, res) => {
  const tx = await transactionsStore.read((all) =>
    all.find((t) => t.id === req.params.id && t.userId === req.user.id),
  );
  if (!tx) throw notFoundError();
  res.json(tx);
});

router.post('/', async (req, res) => {
  const data = validateTransaction(req.body);
  const now = new Date().toISOString();
  const tx = { id: randomUUID(), userId: req.user.id, ...data, createdAt: now, updatedAt: now };

  await transactionsStore.update((all) => {
    all.push(tx);
  });
  res.status(201).json(tx);
});

router.put('/:id', async (req, res) => {
  const changes = validateTransaction(req.body, { partial: true });

  const tx = await transactionsStore.update((all) => {
    const found = all.find((t) => t.id === req.params.id && t.userId === req.user.id);
    if (!found) throw notFoundError();
    Object.assign(found, changes, { updatedAt: new Date().toISOString() });
    return found;
  });
  res.json(tx);
});

router.delete('/:id', async (req, res) => {
  await transactionsStore.update((all) => {
    const index = all.findIndex((t) => t.id === req.params.id && t.userId === req.user.id);
    if (index === -1) throw notFoundError();
    all.splice(index, 1);
  });
  res.status(200).json({
    message: `Delete transaction ${req.params.id} success`
  })
});

export default router;
