require('dotenv').config({path: `${__dirname}/./../.env`});

const config = process.env;

config.isProduction = false;

if (config.NODE_ENV === 'production') {
  config.isProduction = true;
}

config.PORT = config.PORT ? config.PORT : 8000;

module.exports = config;
