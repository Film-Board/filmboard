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
    youtubeTrailerId: type.STRING,
    showtimes: type.ARRAY(type.DATE),
    ticketPrice: type.FLOAT,
    concessionPrice: type.FLOAT
  });
};
