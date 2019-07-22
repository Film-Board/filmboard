const routes = require('next-routes')();

routes
  .add('/movies/add', 'add-movie')
  .add('/movies/:id/edit', 'edit-movie');

module.exports = routes;
