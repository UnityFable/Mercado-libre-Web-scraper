import { NextFunction, Request, Response } from 'express';
import scrapeIt from 'scrape-it';
import config from '../config/config';
import { ProductService } from '../services/product.service';

export class ScrapeItController {
  private url: string;
  private pagesCount: number;

  private productService: ProductService;

  constructor() {
    this.url = config.webpageUrl;
    this.pagesCount = parseInt(config.pagesCount);

    this.productService = new ProductService();
  }

  public async startScrapper(req: Request, res: Response, next: NextFunction) {
    try {
      const data = [];
      let scrappedData = await this.scrapePage(this.url, 1);
      data.push({ page: 1, scrappedData: scrappedData.data });
      for (let i = 1; i < this.pagesCount; i++) {
        scrappedData = await this.scrapePage(scrappedData.nextPage, i + 1);
        data.push({ page: i + 1, scrappedData: scrappedData.data });
      }
      let totalData = 0;
      data.forEach((val) => {
        totalData += val.scrappedData.length;
      });
      return { totalData, data };
    } catch (error) {
      console.log('Error -> ', error);
      next(error);
    }
  }

  public async scrapePage(
    url: string,
    pageNumber: number
  ): Promise<{ data: any; nextPage: string }> {
    return new Promise(async (resolve, reject) => {
      await scrapeIt(url, {
        links: {
          listItem: 'section ol > li',
          data: {
            link: {
              selector:
                '.ui-search-item__group.ui-search-item__group--title.shops__items-group > a',
              attr: 'href',
            },
            fullFilment: {
              selector: '.ui-search-item__fulfillment > svg > use',
              attr: 'href',
              convert: (value) => {
                return !!value ? true : false;
              },
            },
          },
        },
        nextBtn: {
          selector:
            'a.andes-pagination__link.shops__pagination-link.ui-search-link',
          attr: 'href',
        },
      }).then(async ({ data, response }: any) => {
        console.log('Page scrapped');
        if (response.statusCode === 200) {
          const objData = [];
          const links = data.links
            .filter((value: any) => !!value.fullFilment)
            .map((e) => e.link);
          for (const link of links) {
            const dataResponse: any = await scrapeIt(link, {
              images: {
                listItem: '.ui-pdp-gallery__column > .ui-pdp-gallery__wrapper',
                data: {
                  img: {
                    selector: '.ui-pdp-thumbnail__picture > img',
                    attr: 'data-src',
                  },
                },
              },
              name: 'h1.ui-pdp-title',
              priceInfo: {
                selector: '.ui-pdp-price--size-large',
                data: {
                  priceAmount: {
                    listItem: '.ui-pdp-price__second-line',
                    data: {
                      symbol: '.andes-money-amount__currency-symbol',
                      priceValue: '.andes-money-amount__fraction',
                    },
                    convert: (value) => {
                      return `${value.symbol} ${value.priceValue}`;
                    },
                  },
                  priceDiscount: {
                    selector: '.andes-money-amount__discount',
                    convert: (value) => {
                      return !!value ? value : 'No Aplica';
                    },
                  },
                },
              },
              productSpecifications: {
                listItem: '.ui-vpp-striped-specs__table',
                data: {
                  name: 'h3',
                  specs: {
                    listItem: 'table.andes-table > tbody > tr',
                    data: {
                      key: 'th',
                      value: 'td > span',
                    },
                    convert: (value) => {
                      const dataObj: any = {};
                      dataObj[value.key] = value.value;
                      return dataObj;
                    },
                  },
                },
              },
            });
            dataResponse.data.images = dataResponse.data.images
              .filter((value) => !!value.img)
              .map((e) => e.img);
            dataResponse.data.priceInfo.priceAmount =
              dataResponse.data.priceInfo.priceAmount[0];
            dataResponse.data.productSpecifications.forEach((value: any) => {
              const obj = {};
              value.specs.forEach((val) => {
                // tslint:disable-next-line: forin
                for (const key in val) {
                  obj[key] = val[key];
                }
              });
              value.specs = obj;
            });
            console.log('Product scrapped');
            await this.productService.saveDatabaseData(
              pageNumber,
              dataResponse.data
            );
            objData.push(dataResponse.data);
          }
          resolve({ data: objData, nextPage: data.nextBtn });
        } else {
          reject({ message: 'Scrape page error -> ' + response.error });
        }
      });
    });
  }
}
