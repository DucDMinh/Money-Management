import jwt from 'jsonwebtoken';
import config from '../config.js';
import { usersStore } from '../db.js';
import { HttpError } from '../lib/httpError.js';

export function signToken(user) {
  return jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

/** Bỏ passwordHash trước khi trả user về client */
export function publicUser({ passwordHash, ...user }) {
  return user;
}

/** Chặn request chưa đăng nhập. Client gửi header: Authorization: Bearer <token> */
export async function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('Authorization') ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'Bạn cần đăng nhập');

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new HttpError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
  }

  const user = await usersStore.read((users) => users.find((u) => u.id === payload.sub));
  if (!user) throw new HttpError(401, 'Tài khoản không tồn tại');

  req.user = publicUser(user);
  next();
}
