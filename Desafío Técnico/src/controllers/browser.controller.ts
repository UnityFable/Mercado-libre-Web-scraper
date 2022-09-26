import * as puppeteer from 'puppeteer';

export class BrowserController {
  constructor() {}

  public async startBrowser() {
    let browser: puppeteer.Browser;
    try {
      console.log('Creating browser instance......');
      browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      });
    } catch (error) {
      console.log('Could not create a browser instance -> ', error);
    }
    return browser;
  }
}
