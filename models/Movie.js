/* eslint-disable new-cap */
module.exports = (sequelize, type) => {
  return sequelize.define('Movie', {
    name: type.STRING,
    poster: type.STRING,
    imdb: type.FLOAT,
    rottenTomatoes: type.FLOAT,
    runtime: type.INTEGER,
    staring: type.STRING,
    directedBy: type.STRING,
    summery: type.STRING,
    trailer: type.STRING,
    ticketPrice: type.FLOAT,
    concessionPrice: type.FLOAT
  });
};
