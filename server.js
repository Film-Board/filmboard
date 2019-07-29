const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const finale = require('finale-rest')
const routes = require('./routes');
const models = require('./models');

const nextApp = next({dev: process.env.NODE_ENV !== 'production'});
const handler = routes.getRequestHandler(nextApp);

nextApp.prepare().then(() => {
  const app = express();

  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(formData.parse({}));

  // API routes
  app.use('/api', require('./api/routes'));

  // Finale routes
  finale.initialize({
    app: app,
    sequelize: models.sequelize
  });

  finale.resource({
    model: models.Movie,
    endpoints: ['/api/movies', '/api/movies/:id']
  });

  // Next.js routes
  app.use(handler);

  app.listen(3000);
});
