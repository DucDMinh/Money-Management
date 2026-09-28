import cors from 'cors';
import express from 'express';
import config from './config.js';
import { requireAuth } from './middlewares/auth.js';
import { errorHandler, notFound } from './middlewares/error.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import reportRoutes from './routes/reports.routes.js';
import transactionRoutes from './routes/transactions.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
// Các API bên dưới đều yêu cầu đăng nhập
app.use('/api/transactions', requireAuth, transactionRoutes);
app.use('/api/reports', requireAuth, reportRoutes);
app.use('/api/categories', requireAuth, categoryRoutes);
app.use('/api', notFound);

// Frontend (thư mục asset) — phục vụ file tĩnh khi làm FE
app.use(express.static(config.assetDir));

app.use(errorHandler);
