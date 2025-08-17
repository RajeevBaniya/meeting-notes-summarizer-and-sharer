import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import summaryRoutes from './routes/summary.js';
import emailRoutes from './routes/email.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/upload', uploadRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Meeting Notes API is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
