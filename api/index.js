// Vercel serverless entrypoint — CommonJS to match server.js
const app = require('../server/server');

module.exports = app;
