require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');
const { MongoMemoryServer } = require('mongodb-memory-server');

const seedUsers = [
  { name: 'Arjun Sharma', role: 'Frontend Dev', color: '#4f8ef7', email: 'arjun@example.com', password: 'password123' },
  { name: 'Priya Nair', role: 'Backend Dev', color: '#a78bfa', email: 'priya@example.com', password: 'password123' },
  { name: 'Rahul Mehta', role: 'Designer', color: '#34d399', email: 'rahul@example.com', password: 'password123' },
  { name: 'Sneha Patel', role: 'QA Engineer', color: '#fbbf24', email: 'sneha@example.com', password: 'password123' },
  { name: 'Dev Kapoor', role: 'DevOps', color: '#f87171', email: 'dev@example.com', password: 'password123' },
];

const seedTasks = [
  { title: 'Redesign landing page hero section', description: 'Update typography, hero imagery, and CTA button styles.', status: 'not_started', priority: 'high', tag: 'Design', deadline: new Date(Date.now() + 3*24*60*60*1000).toISOString() },
  { title: 'Integrate Razorpay payment gateway', description: 'Add payment flow for subscription plans.', status: 'not_started', priority: 'high', tag: 'Backend', deadline: new Date(Date.now() + 5*24*60*60*1000).toISOString() },
  { title: 'Build reusable component library', description: 'Create Button, Input, Modal, and Toast components.', status: 'in_progress', priority: 'medium', tag: 'Frontend', deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString() },
  { title: 'Set up CI/CD pipeline on GitHub Actions', description: 'Automate build, test, and deployment workflows.', status: 'in_progress', priority: 'high', tag: 'DevOps', deadline: new Date(Date.now() + 2*24*60*60*1000).toISOString() },
  { title: 'Write E2E tests for checkout flow', description: 'Cover happy path, payment failure, and edge cases.', status: 'in_progress', priority: 'medium', tag: 'QA', deadline: new Date(Date.now() + 10*24*60*60*1000).toISOString() },
  { title: 'Migrate database to PostgreSQL', description: 'Schema migration, data backfill, connection pooling.', status: 'completed', priority: 'high', tag: 'Backend', deadline: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
  { title: 'Set up Sentry error monitoring', description: 'Integrate Sentry SDK, configure alert rules.', status: 'completed', priority: 'low', tag: 'DevOps', deadline: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
];

const runSeed = async () => {
  try {
    // If not connected, connect
    if (mongoose.connection.readyState === 0) {
      let mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
         const mongoServer = await MongoMemoryServer.create();
         mongoUri = mongoServer.getUri();
      }
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected for seeding...');
    }

    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data.');

    const salt = await bcrypt.genSalt(10);
    const usersToInsert = seedUsers.map(u => ({ ...u, password: bcrypt.hashSync(u.password, salt) }));
    
    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`Inserted ${insertedUsers.length} users.`);

    // Assign tasks randomly
    const tasksToInsert = seedTasks.map(t => {
      const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
      return { ...t, assigneeId: randomUser._id };
    });

    const insertedTasks = await Task.insertMany(tasksToInsert);
    console.log(`Inserted ${insertedTasks.length} tasks.`);

    console.log('Database seeded successfully!');
    
    // Only exit if run directly
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error(err);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  runSeed();
} else {
  module.exports = runSeed;
}
