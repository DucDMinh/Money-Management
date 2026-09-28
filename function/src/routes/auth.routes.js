import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { usersStore } from '../db.js';
import { HttpError } from '../lib/httpError.js';
import { validateLogin, validateRegister } from '../lib/validate.js';
import { publicUser, requireAuth, signToken } from '../middlewares/auth.js';

const router = Router();

const SALT_ROUNDS = 10;
// So sánh với hash giả khi username không tồn tại để thời gian phản hồi như nhau (tránh dò tài khoản)
const DUMMY_HASH = bcrypt.hashSync(randomUUID(), SALT_ROUNDS);

router.post('/register', async (req, res) => {
  const { username, password, name } = validateRegister(req.body);
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await usersStore.update((users) => {
    if (users.some((u) => u.username === username)) throw new HttpError(409, 'Tên đăng nhập đã tồn tại');
    const newUser = { id: randomUUID(), username, name, passwordHash, createdAt: new Date().toISOString() };
    users.push(newUser);
    return newUser;
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { username, password } = validateLogin(req.body);
  const user = await usersStore.read((users) => users.find((u) => u.username === username));
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) throw new HttpError(401, 'Sai tên đăng nhập hoặc mật khẩu');

  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
