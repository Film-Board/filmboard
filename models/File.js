module.exports = (sequelize, type) => {
  return sequelize.define('File', {
    path: {
      type: type.STRING,
      unique: true
    },
    hash: {
      type: type.STRING,
      unique: true
    },
    name: type.STRING,
    userUploaded: {
      type: type.BOOLEAN,
      default: false
    }
  });
};
