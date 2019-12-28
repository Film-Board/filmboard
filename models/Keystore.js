module.exports = (sequelize, type) => {
  return sequelize.define('Keystore', {
    name: type.STRING,
    value: type.JSON
  });
};
