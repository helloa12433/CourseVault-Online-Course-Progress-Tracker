require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Optional: serve client build if exists (for production)
const clientBuildPath = path.join(__dirname, '..', 'clientside', 'dist'); // vite build output default is dist
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) res.json({ ok: true });
  });
});

// ===== Debug: List all registered routes =====
function listRoutes(app) {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push(middleware.route);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        let route = handler.route;
        route && routes.push(route);
      });
    }
  });
  console.log('\n🛣️  All Registered API Routes:');
  routes.forEach(r => {
    const methods = Object.keys(r.methods).map(m => m.toUpperCase()).join(', ');
    console.log(`${methods.padEnd(10)} ${r.path}`);
  });
  console.log('--------------------------------------\n');
}

// ===== Error Handler =====
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// ===== Connect DB & Start Server =====
connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    // show all routes after all app.use calls
    listRoutes(app);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connect error', err);
  });
