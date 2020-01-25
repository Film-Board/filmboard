const path = require('path');
const withPlugins = require('next-compose-plugins');
const sass = require('@zeit/next-sass');
const css = require('@zeit/next-css');
const withTM = require('next-transpile-modules')(['react-map-gl', 'rbx', 'react-datepicker', 'dayjs']);
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = withPlugins([
  [withTM, {
    transpileModules: ['react-map-gl', 'rbx', 'react-datepicker', 'dayjs']
  }],
  [sass, {
    sassLoaderOptions: {
      includePaths: [path.resolve('node_modules')]
    }
  }],
  [css]
], {
  experimental: {
    modern: true
  },
  generateBuildId: async () => {
    // Get Git commit hash
    const hash = require('child_process')
      .execSync('git rev-parse HEAD')
      .toString().trim().slice(0, 7);

    return hash;
  },
  webpack: config => {
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

    // Unshift polyfills in main entrypoint.
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js']) {
        entries['main.js'].unshift('./components/lib/polyfills.js');
      }

      return entries;
    };

    return config;
  }
});
