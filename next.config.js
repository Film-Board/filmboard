const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['react-map-gl', 'rbx', 'react-datepicker', 'dayjs']);

module.exports = withPlugins([
  [withTM, {
    transpileModules: ['react-map-gl', 'rbx', 'react-datepicker', 'dayjs']
  }]
], {
  generateBuildId: async () => {
    // Get Git commit hash
    const hash = require('child_process')
      .execSync('git rev-parse HEAD')
      .toString().trim().slice(0, 7);

    return hash;
  }
});
