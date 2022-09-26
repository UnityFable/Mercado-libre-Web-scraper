import * as dotenv from 'dotenv';
import * as envalid from 'envalid';

dotenv.config();

/**
 * envalid behavior for env vars
 * @param  process.env vars env
 */
const env = envalid.cleanEnv(process.env, {
  INIT_HTTPS: envalid.bool(),

  DB_DIALECT: envalid.str(),
  DB_HOST: envalid.host(),
  DB_USER: envalid.str(),
  DB_PASSWORD: envalid.str(),
  DB_PORT: envalid.port(),
  DB_NAME: envalid.str(),
  DB_INSTANCE: envalid.str(),

  WEBPAGE_URL: envalid.str(),
  PAGES_COUNT: envalid.num(),
});

export default env;
