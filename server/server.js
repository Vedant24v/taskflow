require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS — allow all origins (tighten in production if needed)
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Lazy DB connection (cached across serverless warm invocations) ───────────
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set. Add it to your environment variables.');
  }

  await mongoose.connect(uri);
  isConnected = true;
  console.log('MongoDB connected');
}

// Middleware: ensure DB is connected before any route runs
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ message: 'Database connection failed. Check server logs.' });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Local dev: start listener only when not in Vercel ───────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
