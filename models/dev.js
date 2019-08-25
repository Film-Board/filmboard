const { sequelize } = require('.');

(async () => {
  await sequelize.sync();
})();
