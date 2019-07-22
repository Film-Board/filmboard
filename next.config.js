const path = require('path');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(
  withSass({
    sassLoaderOptions: {
      includePaths: [path.resolve('node_modules')]
    }
  }))
