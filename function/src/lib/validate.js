import { PERIODS, isValidDate, today } from './date.js';
import { HttpError } from './httpError.js';

export const TRANSACTION_TYPES = ['income', 'expense'];

const MAX_AMOUNT = 1e12;
const USERNAME_RE = /^[a-z0-9_.]{3,32}$/;

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isPresent = (value) => value !== undefined && value !== null;
const cleanText = (value) => value.normalize('NFC').trim().replace(/\s+/g, ' ');
const round2 = (n) => Math.round(n * 100) / 100;

function requireObject(body) {
  if (!isObject(body)) throw new HttpError(400, 'Body phải là JSON object (Content-Type: application/json)');
  return body;
}

function throwIfErrors(errors) {
  if (Object.keys(errors).length > 0) throw new HttpError(400, 'Dữ liệu không hợp lệ', errors);
}

// ---------- Auth ----------

export function validateRegister(body) {
  requireObject(body);
  const errors = {};

  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
  if (!USERNAME_RE.test(username)) {
    errors.username = 'Tên đăng nhập dài 3–32 ký tự, chỉ gồm chữ không dấu, số, "_" hoặc "."';
  }

  const { password } = body;
  // bcrypt chỉ dùng 72 byte đầu của mật khẩu
  if (typeof password !== 'string' || password.length < 6 || Buffer.byteLength(password) > 72) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự (tối đa 72 byte)';
  }

  let name = username;
  if (isPresent(body.name)) {
    name = typeof body.name === 'string' ? cleanText(body.name) : '';
    if (!name || name.length > 50) errors.name = 'Tên hiển thị dài 1–50 ký tự';
  }

  throwIfErrors(errors);
  return { username, password, name };
}

export function validateLogin(body) {
  requireObject(body);
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!username || !password) throw new HttpError(400, 'Vui lòng nhập tên đăng nhập và mật khẩu');
  return { username, password };
}

// ---------- Giao dịch ----------

/**
 * Kiểm tra dữ liệu giao dịch.
 * - Tạo mới: điền giá trị mặc định cho trường bỏ trống (type=expense, category=Khác, date=hôm nay).
 * - `partial: true` (cập nhật): chỉ kiểm tra và trả về các trường được gửi lên.
 */
export function validateTransaction(body, { partial = false } = {}) {
  requireObject(body);
  const errors = {};
  const data = {};

  if (isPresent(body.type)) {
    if (TRANSACTION_TYPES.includes(body.type)) data.type = body.type;
    else errors.type = 'type phải là "income" (thu) hoặc "expense" (chi)';
  } else if (!partial) {
    data.type = 'expense';
  }

  if (isPresent(body.amount)) {
    const amount = typeof body.amount === 'string' && body.amount.trim() !== '' ? Number(body.amount) : body.amount;
    if (typeof amount === 'number' && Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT) {
      data.amount = round2(amount);
    } else {
      errors.amount = 'Số tiền phải là số lớn hơn 0';
    }
  } else if (!partial) {
    errors.amount = 'Vui lòng nhập số tiền';
  }

  if (isPresent(body.category)) {
    const category = typeof body.category === 'string' ? cleanText(body.category) : '';
    if (category && category.length <= 50) data.category = category;
    else errors.category = 'Danh mục dài 1–50 ký tự';
  } else if (!partial) {
    data.category = 'Khác';
  }

  if (isPresent(body.note)) {
    if (typeof body.note === 'string' && body.note.length <= 500) data.note = body.note.normalize('NFC').trim();
    else errors.note = 'Ghi chú tối đa 500 ký tự';
  } else if (!partial) {
    data.note = '';
  }

  if (isPresent(body.date)) {
    if (isValidDate(body.date)) data.date = body.date;
    else errors.date = 'Ngày phải có dạng YYYY-MM-DD';
  } else if (!partial) {
    data.date = today();
  }

  throwIfErrors(errors);
  if (partial && Object.keys(data).length === 0) throw new HttpError(400, 'Không có trường nào để cập nhật');
  return data;
}

// ---------- Query string ----------

function queryString(value) {
  return typeof value === 'string' && value.trim() ? value.normalize('NFC').trim() : undefined;
}

function queryInt(value, name, defaultValue, max) {
  const str = queryString(value);
  if (str === undefined) return defaultValue;
  const n = Number(str);
  if (!Number.isInteger(n) || n < 1) throw new HttpError(400, `Tham số "${name}" phải là số nguyên dương`);
  return Math.min(n, max);
}

export function queryDate(value, name) {
  const str = queryString(value);
  if (str !== undefined && !isValidDate(str)) {
    throw new HttpError(400, `Tham số "${name}" phải là ngày dạng YYYY-MM-DD`);
  }
  return str;
}

export function queryRange(query) {
  const from = queryDate(query.from, 'from');
  const to = queryDate(query.to, 'to');
  if (from && to && from > to) throw new HttpError(400, '"from" phải trước hoặc bằng "to"');
  return { from, to };
}

export function queryPeriod(value, defaultValue = 'month') {
  const period = queryString(value) ?? defaultValue;
  if (!PERIODS.includes(period)) {
    throw new HttpError(400, `Tham số "period" phải là một trong: ${PERIODS.join(', ')}`);
  }
  return period;
}

export function validateListQuery(query) {
  const type = queryString(query.type);
  if (type && !TRANSACTION_TYPES.includes(type)) {
    throw new HttpError(400, 'Tham số "type" phải là "income" hoặc "expense"');
  }
  return {
    ...queryRange(query),
    type,
    category: queryString(query.category),
    q: queryString(query.q),
    page: queryInt(query.page, 'page', 1, Number.MAX_SAFE_INTEGER),
    limit: queryInt(query.limit, 'limit', 50, 200),
  };
}
