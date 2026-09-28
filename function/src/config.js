import { randomBytes } from 'node:crypto';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

try {
  process.loadEnvFile(path.join(root, '.env'));
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  jwtSecret = randomBytes(32).toString('hex');
  console.warn('[config] Chưa đặt JWT_SECRET trong .env — dùng secret tạm, mọi token sẽ mất hiệu lực khi restart server.');
}

const corsOrigin = process.env.CORS_ORIGIN || '*';

export default {
  port: Number(process.env.PORT) || 3000,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Múi giờ dùng để xác định "hôm nay"
  timezone: process.env.TIMEZONE || 'Asia/Ho_Chi_Minh',
  dataDir: path.resolve(root, process.env.DATA_DIR || 'data'),
  assetDir: path.resolve(root, '..', 'asset'),
  corsOrigin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map((s) => s.trim()),
};
