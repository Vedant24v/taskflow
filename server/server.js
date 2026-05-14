require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const isVercel = process.env.VERCEL === '1';

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('No MONGO_URI provided. Starting in-memory MongoDB instance for development...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at ${mongoUri}`);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');

    // Automatically seed database if using in-memory db and no users exist
    if (!process.env.MONGO_URI) {
      const User = require('./models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Running seed for in-memory database...');
        const runSeed = require('./seed');
        await runSeed();
      }
    }

    if (!isVercel) {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } else {
      console.log('Vercel environment detected, serverless function ready');
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
