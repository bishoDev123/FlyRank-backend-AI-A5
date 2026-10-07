const express = require('express');

const {swaggerDocs} = require('./util/swagger');

const tasksRoutes = require('./routes/tasks.routes');
const metaRoutes = require('./routes/meta.routes');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middleware/error-handler');

function createApp() {
  const app = express();

  app.use(express.json());

  
  app.use('/', tasksRoutes);
  app.use('/', metaRoutes);
  app.use('/', authRoutes);
  
  app.use(errorHandler);
  
  swaggerDocs(app);

  return app;
}

module.exports = { createApp };