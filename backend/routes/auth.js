import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email });

const session = (user) => ({
  user: publicUser(user),
  token: jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '1d', algorithm: 'HS256' }),
});
function credentials(body) {
  return typeof body.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
    && body.email.trim().length <= 254 && typeof body.password === 'string'
    && body.password.length >= 8 && Buffer.byteLength(body.password, 'utf8') <= 72;
}
router.post('/register', async (req, res, next) => {
  try {
    if (!credentials(req.body) || typeof req.body.name !== 'string' || !req.body.name.trim() || req.body.name.trim().length > 80) {
      return res.status(400).json({ message: 'Enter a name, valid email, and password of at least 8 characters (maximum 72 bytes).' });
    }
    const user = await User.create({ name: req.body.name.trim(), email: req.body.email.trim().toLowerCase(), password: await bcrypt.hash(req.body.password, 12) });
    res.status(201).json(session(user));
  } catch (error) { next(error); }
});
router.post('/login', async (req, res, next) => {
  try {
    if (!credentials(req.body)) return res.status(400).json({ message: 'Enter a valid email and password.' });
    const user = await User.findOne({ email: req.body.email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    res.json(session(user));
  } catch (error) { next(error); }
});
router.get('/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
