const Sequelize = require('sequelize');
const { DB_URL, DB_DIALECT } = require('../config');

const movieModel = require('./Movie');
const pageModel = require('./Page');
const showtimeModel = require('./Showtime');

const sequelize = new Sequelize(DB_URL, {
  dialect: DB_DIALECT
});

const Movie = movieModel(sequelize, Sequelize);
const Page = pageModel(sequelize, Sequelize);
const Showtime = showtimeModel(sequelize, Sequelize);

Movie.hasMany(Showtime);

module.exports = { sequelize, Movie, Page, Showtime };
