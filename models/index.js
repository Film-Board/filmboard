const Sequelize = require('sequelize');
const config = require('../config');

const movieModel = require('./Movie');

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: 'postgresql'
  });

const Movie = movieModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  console.log('Database has been initalized.');
});

module.exports = {sequelize, Movie};
