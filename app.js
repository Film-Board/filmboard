const express = require('express');
const next = require('next');

const port = 3000;
const app = next({dev: false});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use('/static/bucket', express.static('public/static/bucket'));

  server.all('*', (request, res) => {
    return handle(request, res);
  });

  server.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on http://localhost:${port}`);
  });
});
