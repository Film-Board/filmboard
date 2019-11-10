module.exports = (sequelize, type) => {
  return sequelize.define('Movie', {
    name: type.STRING,
    imdb: type.FLOAT,
    rottenTomatoes: type.FLOAT,
    runtime: type.INTEGER,
    staring: type.STRING,
    directedBy: type.STRING,
    summery: type.STRING,
    ticketPrice: type.FLOAT,
    concessionPrice: type.FLOAT
  });
};
