/* eslint-disable new-cap */
module.exports = (sequelize, type) => {
  return sequelize.define('Movie', {
    name: type.STRING,
    imdb: type.FLOAT,
    rottenTomatoes: type.FLOAT,
    runtime: type.INTEGER,
    staring: type.STRING,
    directedBy: type.STRING,
    summary: type.STRING(10000),
    ticketPrice: type.FLOAT,
    concessionPrice: type.FLOAT,
    specialEvent: {
      type: type.BOOLEAN,
      defaultValue: false
    },
    latestShowtime: type.DATE,
    hidden: {
      type: type.BOOLEAN,
      defaultValue: true
    }
  });
};
