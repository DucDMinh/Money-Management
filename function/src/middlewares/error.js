import { HttpError } from '../lib/httpError.js';

export function notFound(req, res) {
  res.status(404).json({ error: `Không tìm thấy ${req.method} ${req.originalUrl}` });
}

// Express nhận diện error handler qua 4 tham số, nên phải giữ `next`
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...(err.details && { details: err.details }) });
  }
  // Lỗi từ express.json(): body sai cú pháp, quá lớn, ...
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Body không phải JSON hợp lệ' });
  }
  if (err.expose && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại sau' });
}
