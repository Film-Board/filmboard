const Sequelize = require('sequelize');
const {DB_URL, IS_PRODUCTION} = require('../config');

const fileModel = require('./File');
const userModel = require('./User');
const keystoreModel = require('./Keystore');
const movieModel = require('./Movie');
const pageModel = require('./Page');
const pageCategoryModel = require('./PageCategory');
const showtimeModel = require('./Showtime');
const trailerModel = require('./Trailer');

const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgresql',
  logging: IS_PRODUCTION ? false : console.log
});

const File = fileModel(sequelize, Sequelize);
const User = userModel(sequelize, Sequelize);
const Keystore = keystoreModel(sequelize, Sequelize);
const Movie = movieModel(sequelize, Sequelize);
const Page = pageModel(sequelize, Sequelize);
const PageCategory = pageCategoryModel(sequelize, Sequelize);
const Showtime = showtimeModel(sequelize, Sequelize);
const Trailer = trailerModel(sequelize, Sequelize);

Movie.hasMany(Showtime);
Movie.belongsTo(File, {as: 'Poster'});
Movie.belongsTo(Trailer);
Trailer.belongsTo(File);

PageCategory.hasMany(Page);
Page.belongsTo(PageCategory);

module.exports = {
  sequelize,
  File,
  User,
  Keystore,
  Movie,
  Page,
  PageCategory,
  Showtime,
  Trailer
};
