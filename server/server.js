require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

const app = express();

// CORS — allow all origins (tighten in production if needed)
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Lazy DB connection (cached across serverless warm invocations) ───────────
let connectionPromise = null;
let dnsConfigured = false;

function configureMongoDns(uri) {
  if (dnsConfigured || !uri.startsWith('mongodb+srv://')) return;
  if (!process.env.MONGO_DNS_SERVERS && process.env.NODE_ENV === 'production') return;

  const servers = (process.env.MONGO_DNS_SERVERS || '8.8.8.8,1.1.1.1')
    .split(',')
    .map(server => server.trim())
    .filter(Boolean);

  if (servers.length) {
    dns.setServers(servers);
    dnsConfigured = true;
  }
}

function getDbErrorMessage(err) {
  if (/bad auth|authentication failed/i.test(err.message)) {
    return 'Database authentication failed. Check your MongoDB username and password in MONGO_URI.';
  }

  if (/querySrv|ENOTFOUND|ETIMEOUT|ECONNREFUSED/i.test(err.message)) {
    return 'Database connection failed. Check your MongoDB connection string and network/DNS access.';
  }

  return 'Database connection failed. Check server logs.';
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set. Add it to your environment variables.');
  }

  configureMongoDns(uri);

  connectionPromise = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch(async (err) => {
      connectionPromise = null;
      await mongoose.disconnect().catch(() => {});
      throw err;
    });

  return connectionPromise;
}

// Middleware: ensure DB is connected before any route runs
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ message: getDbErrorMessage(err) });
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
