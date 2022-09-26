import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import https from 'https';
import config from './config/config';
import { ScraperRouter } from './routes/scraper.router';
import envalid from './utils/env/env-config';
import {
  clientErrorHandler,
  logErrors,
  notFound,
} from './utils/middlewares/error-handlers';

class Server {
  private app: express.Application;
  private corsOptions: any;
  private env: any;

  private scraperRouter: ScraperRouter;

  constructor() {
    this.app = express();
    this.corsOptions = {
      mehtod: ['POST', 'PUT', 'PATCH', 'DELETE'],
      origin: true,
    };

    this.scraperRouter = new ScraperRouter();

    this.config();
    this.routes();
    this.env = envalid;
  }

  private config() {
    dotenv.config();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors(this.corsOptions));
    this.app.set('port', config.port || 3000);
  }

  private errors() {
    this.app.use(notFound);
    this.app.use(logErrors);
    this.app.use(clientErrorHandler);
  }

  private routes() {
    this.app.use(this.scraperRouter.uri, this.scraperRouter.router);

    this.errors();
  }

  openServer() {
    if (!!config.initHttps) {
      https
        .createServer(
          { pfx: fs.readFileSync(config.routePFX), passphrase: config.sslKey },
          this.app
        )
        .listen(this.app.get('port'), () => {
          console.log(
            `App listening on port ${this.app.get(
              'port'
            )}! Go to https://localhost:${this.app.get('port')}`
          );
        });
    } else {
      this.app.listen(this.app.get('port'), () => {
        console.log(
          `App listening on port ${this.app.get(
            'port'
          )}! Go to http://localhost:${this.app.get('port')}`
        );
        process.on('SIGINT', () => {
          console.log('Bye Bye!');
          process.exit();
        });
      });
    }
  }
}

const server = new Server();
server.openServer();
