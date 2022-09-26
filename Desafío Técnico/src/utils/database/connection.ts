import sql from 'mssql';
import config from '../../config/config';

export class MssqlConnection {
  private dbConfig: any;

  constructor() {
    this.dbConfig = {
      user: config.dbUser,
      password: config.dbPassword,
      server: config.dbHost,
      database: config.dbName,
      options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
      },
    };
  }

  public async getConnection() {
    try {
      const pool = await sql.connect(this.dbConfig);
      return pool;
    } catch (error) {
      throw new Error(error);
    }
  }
}
