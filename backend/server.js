import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import summaryRoutes from './routes/summary.js';
import emailRoutes from './routes/email.js';
import summariesRoutes from './routes/summaries.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const parseOrigins = (value) => (value || '')
  .split(',')
  .map(v => v.trim())
  .filter(Boolean)

const wildcardToRegex = (pattern) => {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  return new RegExp(`^${escaped}$`)
}

const normalizeOriginPattern = (pattern) => (pattern || '').replace(/\/$/, '')

const allowedOriginPatterns = [
  normalizeOriginPattern(process.env.FRONTEND_URL) || 'http://localhost:5173',
  ...parseOrigins(process.env.CORS_ORIGINS).map(normalizeOriginPattern)
]
  .filter(Boolean)
  .map(p => ({ pattern: p, regex: wildcardToRegex(p) }))

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    const isAllowed = allowedOriginPatterns.some(({ regex }) => regex.test(origin))
    callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed)
  },
  credentials: true
}));
app.use(express.json());

app.set('trust proxy', true);

app.use('/api/upload', uploadRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/summaries', summariesRoutes);
app.use('/api/export', exportRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Meeting Notes API is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
