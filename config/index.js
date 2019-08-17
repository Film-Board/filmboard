const config = {
  DB_URL: process.env.DB_URL,
  DB_DIALECT: process.env.DB_DIALECT,
  MOVIE_DB_KEY: process.env.MOVIE_DB_KEY,
  YOUTUBE_KEY: process.env.YOUTUBE_KEY,
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};

module.exports = config;
