// lib/browserSingleton.js
import puppeteer, { Browser } from "puppeteer";
import UserAgent from "user-agents";

const globalAny = global as any;

/**
 * Singleton to manage a shared Puppeteer browser instance
 */
class BrowserManager {
  browser: Browser | null;
  isInitializing: boolean;
  initializationPromise: Promise<Browser> | null;
  constructor() {
    this.browser = null;
    this.isInitializing = false;
    this.initializationPromise = null;

    // Handle graceful shutdown
    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
      process.on(signal, async () => {
        console.log(`${signal} received - closing browser gracefully`);
        await this.closeBrowser();
        process.exit(0);
      });
    });
  }

  /**
   * Get a browser instance, creating one if it doesn't exist
   */
  async getBrowser() {
    if (this.browser) {
      return this.browser;
    }

    // If initialization is in progress, wait for it
    if (this.isInitializing) {
      return this.initializationPromise;
    }

    this.isInitializing = true;
    this.initializationPromise = this._initializeBrowser();
    return this.initializationPromise;
  }

  /**
   * Initialize the browser with optimized settings
   */
  async _initializeBrowser() {
    try {
      console.log("Launching new browser instance...");
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-extensions",
          // Performance optimization flags
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          // Stability improvements
          "--disable-features=site-per-process", // May help with detached frame issues
          "--disable-web-security",
          // Connection stability
          "--disable-backgrounding-occluded-windows",
          "--disable-breakpad",
          "--disable-component-extensions-with-background-pages",
          "--disable-features=TranslateUI",
          "--disable-ipc-flooding-protection",
          // Don't use single-process as it causes stability issues
        ],
        defaultViewport: { width: 1280, height: 800 },
        protocolTimeout: 180000, // 3 minutes
        // Increase timeouts for better stability
        timeout: 60000,
      });

      // Log disconnection events
      this.browser.on("disconnected", () => {
        this.browser = null;
        this.isInitializing = false;
      });

      this.browser.on("targetcrashed", (target: any) => {
        console.log(`Target crashed: ${target.url()}`);
      });

      // Verify browser is working correctly
      const pages = await this.browser.pages();
      const defaultPage = pages.length > 0 ? pages[0] : await this.browser.newPage();
      await defaultPage.goto("about:blank");
      await defaultPage.close().catch((e) => console.log("Error closing test page:", e));

      this.isInitializing = false;
      return this.browser;
    } catch (error) {
      console.error("Failed to initialize browser:", error);
      this.isInitializing = false;
      this.browser = null;
      throw error;
    }
  }

  /**
   * Create a new page in the shared browser instance
   */
  async newPage() {
    const browser = await this.getBrowser();
    const page = browser && (await browser.newPage());
    const userAgent = new UserAgent();
    // Apply default page settings
    if (page) {
      console.log("Applying default page settings...");
      page.setDefaultNavigationTimeout(60000);
      await page.setRequestInterception(false); // Enable only if needed

      // Optional: Set user agent
      await page.setUserAgent(userAgent.random().toString());
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setJavaScriptEnabled(true);

      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      });
    }
    return page;
  }

  /**
   * Close the browser instance
   */
  async closeBrowser() {
    if (this.browser) {
      try {
        await this.browser.close();
        console.log("Browser instance closed successfully");
      } catch (error) {
        console.error("Error closing browser:", error);
      }
      this.browser = null;
    }
  }

  /**
   * Check browser health and recreate if needed
   */
  async ensureHealthyBrowser() {
    try {
      if (this.browser) {
        // Check if browser is still connected
        const pages = await this.browser.pages().catch(() => null);
        if (!pages) {
          console.log("Browser appears disconnected, recreating...");
          this.browser = null;
          return this.getBrowser();
        }
      } else {
        return this.getBrowser();
      }
      return this.browser;
    } catch (error) {
      console.error("Health check failed, recreating browser:", error);
      this.browser = null;
      return this.getBrowser();
    }
  }
}

// Create and export a singleton instance
const browserManager = globalAny._browserManager || new BrowserManager();
globalAny._browserManager = browserManager;

export default browserManager;
