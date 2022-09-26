import { NextFunction, Request, Response } from 'express';
import * as puppeteer from 'puppeteer';
import config from '../config/config';
import { ProductService } from '../services/product.service';
import { BrowserController } from './browser.controller';

export class PuppeteerController {
  private browserController: BrowserController;
  private url: string;
  private pagesCount: number;
  private productService: ProductService;

  constructor() {
    this.url = config.webpageUrl;
    this.pagesCount = parseInt(config.pagesCount);
    this.browserController = new BrowserController();
    this.productService = new ProductService();
  }

  async startScraper(req: Request, res: Response, next: NextFunction) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = [];
        const browser: puppeteer.Browser =
          await this.browserController.startBrowser();
        const page: puppeteer.Page = await browser.newPage();
        await page.goto(this.url);
        let scrapedData = await this.scrapePage(page, browser, 1);
        data.push({ page: 1, scrappedData: scrapedData });
        const nextBtn = page.$eval(
          '.andes-pagination__button.andes-pagination__button--next.shops__pagination-button > a',
          (a) => a.textContent
        );
        if (!!nextBtn) {
          for (let i = 1; i < this.pagesCount; i++) {
            await page.click(
              '.andes-pagination__button.andes-pagination__button--next.shops__pagination-button > a'
            );
            scrapedData = await this.scrapePage(page, browser, i + 1);
            data.push({ page: i + 1, scrappedData: scrapedData });
          }
        }
        let totalData = 0;
        data.forEach((value) => {
          totalData += value.scrappedData.length;
        });
        const response = {
          totalData,
          data,
        };
        resolve(response);
        await page.close();
      } catch (error) {
        console.log('Error during scrape web page -> ', error);
        reject(error);
      }
    });
  }

  private async scrapePage(
    page: puppeteer.Page,
    browser: puppeteer.Browser,
    pageNumber: number
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const scrapedData = [];
        await page.waitForSelector('.ui-search');
        const urls = await page.$$eval('section ol > li', (links) => {
          links = links.filter(
            (link) => !!link.querySelector('.ui-search-item__fulfillment')
          );
          links = links.map(
            (el: any) =>
              el.querySelector(
                '.ui-search-item__group.ui-search-item__group--title.shops__items-group > a'
              ).href
          );
          return links;
        });
        // tslint:disable-next-line: forin
        for (const link of urls) {
          const dataProduct: any = await this.getProductData(
            browser,
            link,
            pageNumber
          );
          scrapedData.push(dataProduct);
        }
        resolve(scrapedData);
      } catch (error) {
        console.log('Scrape page error -> ', error);
        reject(error);
      }
    });
  }

  private async getProductData(
    browser: puppeteer.Browser,
    link: any,
    pageNumber: number
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataObj: any = {};
        const newPage = await browser.newPage();
        await newPage.goto(link);
        dataObj.images = await newPage.$$eval(
          '.ui-pdp-gallery__column > .ui-pdp-gallery__wrapper',
          (imgs: any) => {
            const images = imgs.map(
              (img) =>
                !!img.querySelector('.ui-pdp-thumbnail__picture > img') &&
                img.querySelector('.ui-pdp-thumbnail__picture > img').src
            );
            return images;
          }
        );
        dataObj.images = dataObj.images.filter((value) => !!value);
        dataObj.name = await newPage.$eval(
          'h1.ui-pdp-title',
          (text) => text.textContent
        );
        dataObj.priceInfo = await newPage.$$eval(
          '.ui-pdp-price--size-large > .ui-pdp-price__second-line',
          (prices: any) => {
            const priceAmount = prices.map((price) => {
              const symbol = price.querySelector(
                'span.andes-money-amount__currency-symbol'
              ).textContent;
              const priceValue = price.querySelector(
                'span.andes-money-amount__fraction'
              ).textContent;
              return `${symbol} ${priceValue}`;
            })[0];
            const priceDiscount = prices.map((price) => {
              const discount = price.querySelector(
                '.andes-money-amount__discount'
              );
              if (!!discount) {
                return discount.textContent;
              } else {
                return 'No aplica';
              }
            })[0];
            return { priceAmount, priceDiscount };
          }
        );
        dataObj.productSpecifications = await newPage.$$eval(
          '.ui-vpp-striped-specs__table',
          (productSpecs) => {
            const objData = [];
            const tableName = productSpecs.map(
              (pdspc) => pdspc.querySelector('h3').textContent
            );
            const specs = productSpecs.map((pdspc) => {
              const obj: any = {};
              const specRow = pdspc.querySelectorAll(
                'table.andes-table > tbody > tr'
              );
              specRow.forEach((value) => {
                const key = value.querySelector('th').textContent;
                const val = value.querySelector('td > span').textContent;
                obj[key] = val;
              });
              return obj;
            });
            tableName.forEach((value, i) => {
              objData.push({
                name: value,
                specs: specs[i],
              });
            });
            return objData;
          }
        );
        await this.productService.saveDatabaseData(pageNumber, dataObj);
        console.log('Product scrapped');
        resolve(dataObj);
        await newPage.close();
      } catch (error) {
        console.log('Get product data error -> ', error);
        reject(error);
      }
    });
  }
}
