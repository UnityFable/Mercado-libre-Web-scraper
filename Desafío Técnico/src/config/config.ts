import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT,

  initHttps: process.env.INIT_HTTPS === 'https',

  routePFX: process.env.CERTIFICATE_ROUTE,
  sslKey: process.env.CERTIFICATE_PSW,
  dbDialect: process.env.DB_DIALECT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbInstance: process.env.DB_INSTANCE,

  webpageUrl: process.env.WEBPAGE_URL,
  pagesCount: process.env.PAGES_COUNT,
};

export default config;
