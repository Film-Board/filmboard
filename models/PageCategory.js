module.exports = (sequelize, type) => {
  return sequelize.define('PageCategory', {
    name: type.TEXT
  });
};
