/* eslint-disable new-cap */
module.exports = (sequelize, type) => {
  return sequelize.define('Page', {
    name: type.TEXT,
    content: type.TEXT
  });
};
