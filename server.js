const next = require('next');
const express = require('express');
const routes = require('./routes');
const models = require('./models');

const nextApp = next({dev: process.env.NODE_ENV !== 'production'});
const handler = routes.getRequestHandler(nextApp);

nextApp.prepare().then(() => {
  const app = express();

  // API routes
  app.use('/api', require('./api/routes'));

  // Models injector
  app.use((req, res, next) => {
    req.models = models;
    return next();
  })

  // Next.js routes
  app.use(handler);

  app.listen(3000);
});
