const Sequelize = require('sequelize');
const { DB_URL, DB_DIALECT } = require('../config');

const userModel = require('./User');
const movieModel = require('./Movie');
const pageModel = require('./Page');
const showtimeModel = require('./Showtime');

const sequelize = new Sequelize(DB_URL, {
  dialect: DB_DIALECT
});

const User = userModel(sequelize, Sequelize);
const Movie = movieModel(sequelize, Sequelize);
const Page = pageModel(sequelize, Sequelize);
const Showtime = showtimeModel(sequelize, Sequelize);

Movie.hasMany(Showtime);

module.exports = { sequelize, User, Movie, Page, Showtime };
