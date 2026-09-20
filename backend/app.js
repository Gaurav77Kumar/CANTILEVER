import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '16kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many authentication requests. Try again in 15 minutes.' },
}), authRoutes);
app.use('/api/tasks', taskRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Endpoint not found.' }));
app.use((error, _req, res, _next) => {
  if (error.code === 11000) return res.status(409).json({ message: 'This email is already registered.' });
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid input. Check all fields.' });
  }
  if (error.status === 400 || error.status === 413) {
    return res.status(error.status).json({ message: error.status === 413 ? 'Request is too large.' : 'Invalid request.' });
  }
  console.error(error.name);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});
export default app;
