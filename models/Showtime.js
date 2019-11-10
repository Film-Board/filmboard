module.exports = (sequelize, type) => {
  return sequelize.define('Showtime', {
    time: type.DATE
  });
};
