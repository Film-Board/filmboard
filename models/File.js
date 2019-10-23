/* eslint-disable new-cap */
module.exports = (sequelize, type) => {
  return sequelize.define('File', {
    path: {
      type: type.STRING,
      unique: true
    },
    hash: {
      type: type.STRING,
      unique: true
    }
  });
};
