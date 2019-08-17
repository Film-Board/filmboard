const path = require('path');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const Dotenv = require('dotenv-webpack');

module.exports = withCSS(
  withSass({
    webpack(config) {
      config.plugins = config.plugins || [];

      config.plugins = [
        ...config.plugins,

        // Read the .env file
        new Dotenv({
          path: path.join(__dirname, '.env')
        })
      ];

      return config;
    },
    sassLoaderOptions: {
      includePaths: [path.resolve('node_modules')]
    }
  }));
