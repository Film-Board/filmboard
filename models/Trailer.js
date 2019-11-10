module.exports = (sequelize, type) => {
  return sequelize.define('Trailer', {
    progress: {
      type: type.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  });
};
