import { setWorldConstructor, World } from "@cucumber/cucumber";
import { chromium } from "playwright";
import fs from "fs";

class BrowserType extends World {
  async init() {
    try {
      this.browser = await chromium.launch({
          headless: false,
          channel: 'chrome',
          args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
        });

        const contextOptions = {
          viewport: null,
          acceptDownloads: true,
          downloadsPath: 'downloadfile',
        };

        if (fs.existsSync('gmail-auth.json')) {
          contextOptions.storageState = 'gmail-auth.json';
        }

      this.context = await this.browser.newContext(contextOptions);
      this.page = await this.context.newPage();

      await this.page.setDefaultNavigationTimeout(300000);
      await this.page.setDefaultTimeout(300000);

    } catch (error) {
      console.error("Failed to initialize browser:", error);
      throw error;
    }
  }

  async takeScreenshot(path) {
    if (this.page) {
      try {
        return await this.page.screenshot({
          path: path,
          fullPage: true,
        });
      } catch (error) {
        console.error("Failed to take screenshot:", error);
        return null;
      }
    }
    return null;
  }

  async cleanup() {
    try {
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }
}

setWorldConstructor(BrowserType);