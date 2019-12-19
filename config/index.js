const config = {
  DB_URL: process.env.DB_URL,
  MOVIE_DB_KEY: process.env.MOVIE_DB_KEY,
  OMDB_KEY: process.env.OMDB_KEY,
  YOUTUBE_KEY: process.env.YOUTUBE_KEY,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  BUCKET_PATH: process.env.BUCKET_PATH,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  SIGNING_SECRET: process.env.SIGNING_SECRET
};

module.exports = config;
