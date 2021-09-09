const config = {
  DB_URL: process.env.DB_URL,
  MOVIE_DB_KEY: process.env.MOVIE_DB_KEY,
  OMDB_KEY: process.env.OMDB_KEY,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  BUCKET_PATH: process.env.BUCKET_PATH,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  SIGNING_SECRET: process.env.SIGNING_SECRET
};

module.exports = config;
