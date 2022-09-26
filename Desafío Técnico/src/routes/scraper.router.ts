import { NextFunction, Request, Response, Router } from 'express';
import { ScrapeItController } from '../controllers/scrape-it.controller';
import { PuppeteerController } from '../controllers/puppeteer.controller';

export class ScraperRouter {
  private puppeteerController: PuppeteerController;
  private scrapeitController: ScrapeItController;

  public router: Router;
  public uri: string;

  constructor() {
    this.router = Router();
    this.uri = '/scraper';
    this.puppeteerController = new PuppeteerController();
    this.scrapeitController = new ScrapeItController();

    this.config();
  }

  private config() {
    this.startScraperPuppeteer();
    this.startScrapperScrapeit();
  }

  private startScraperPuppeteer() {
    this.router.get(
      '/puppeteer',
      async (req: Request, res: Response, next: NextFunction) => {
        const data = await this.puppeteerController.startScraper(
          req,
          res,
          next
        );
        res.send({ message: 'Operation Performed', data });
      }
    );
  }

  private startScrapperScrapeit() {
    this.router.get(
      '/scrape-it',
      async (req: Request, res: Response, next: NextFunction) => {
        const data = await this.scrapeitController.startScrapper(
          req,
          res,
          next
        );
        res.send({ message: 'Operation Performed', data });
      }
    );
  }
}
