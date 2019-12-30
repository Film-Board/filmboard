const path = require('path');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
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

      const isProduction = config.mode === 'production';

      if (!isProduction) {
        return config;
      }

      config.optimization.minimizer.push(
        new OptimizeCSSAssetsPlugin({})
      );

      return config;
    },
    sassLoaderOptions: {
      includePaths: [path.resolve('node_modules')]
    }
  }));
