import { Router } from 'express';
import { transactionsStore } from '../db.js';

const router = Router();

const DEFAULT_CATEGORIES = {
  expense: ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Hóa đơn', 'Nhà ở', 'Giải trí', 'Sức khỏe', 'Giáo dục', 'Khác'],
  income: ['Lương', 'Thưởng', 'Đầu tư', 'Được tặng', 'Khác'],
};

// Danh mục gợi ý = danh mục mặc định + các danh mục người dùng đã từng nhập
router.get('/', async (req, res) => {
  const used = await transactionsStore.read((all) =>
    all.filter((tx) => tx.userId === req.user.id).map((tx) => [tx.type, tx.category]),
  );

  const result = {
    expense: new Set(DEFAULT_CATEGORIES.expense),
    income: new Set(DEFAULT_CATEGORIES.income),
  };
  for (const [type, category] of used) result[type].add(category);

  res.json({ expense: [...result.expense], income: [...result.income] });
});

export default router;
