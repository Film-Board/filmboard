module.exports = (sequelize, type) => {
  return sequelize.define('User', {
    email: type.STRING,
    canManageUsers: type.BOOLEAN,
    canEditPages: type.BOOLEAN
  });
};
