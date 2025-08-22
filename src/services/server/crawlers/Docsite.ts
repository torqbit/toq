import { Page } from "puppeteer";
import browserManager from "../lib/browserManager";
import TurndownService from "turndown";
import { Configuration, CheerioCrawler, sleep } from "crawlee";
import UserAgent from "user-agents";
import { MemoryStorage } from "@crawlee/memory-storage";
import { getSizeInBytes } from "@/lib/utils";

class DocsScraper {
  turndownService = new TurndownService();
  userAgent = new UserAgent();
  config = new Configuration({
    storageClient: new MemoryStorage(),
  });
  crawler = new CheerioCrawler({
    minConcurrency: 1,
    maxConcurrency: 2,
    requestHandlerTimeoutSecs: 30,
    maxRequestRetries: 3,
    useSessionPool: true,
    preNavigationHooks: [
      async ({ request, session, proxyInfo }, gotoOptions) => {
        gotoOptions.headers = {
          "User-Agent": this.userAgent.random().toString(),
        };
      },
    ],
    requestHandler: async ({ request, $, log }) => {
      const title = $("title").text().trim();
      const contentHtml = $("body").html();
      if (contentHtml) {
        const markdown = this.turndownService.turndown(contentHtml);
        const markdownSize = getSizeInBytes(markdown);
        log.info(`Saving content of size ${markdownSize} bytes for ${request.url}`);
      }

      log.info(`sleeping for few seconds`);
      await sleep(2000 + Math.random() * 1000); // Sleep 2–3 seconds
    },
  });

  // constructor() {
  //   this.crawler.run();
  // }

  async extractDocsPage(url: string): Promise<{ mdContent: string; title: string; url: string }> {
    try {
      const page = (await browserManager.newPage()) as Page;
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

      // Wait for content to load
      await page.waitForSelector("body");

      const content = await page.evaluate(() => {
        // Remove navigation, header, and footer elements
        const removeElements = (selectors: string[]) => {
          selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => el.remove());
          });
        };

        // Common selectors for navigation, header, and footer
        removeElements([
          "nav",
          "header",
          "footer",
          ".navigation",
          ".nav",
          ".sidebar",
          ".header",
          ".footer",
          "#nav",
          "#header",
          "#footer",
          '[role="navigation"]',
          ".site-header",
          ".site-footer",
          ".main-navigation",
        ]);

        // Find the main content area
        const mainContent =
          document.querySelector("article") ||
          document.querySelector("main") ||
          document.querySelector(".content") ||
          document.querySelector(".post-content") ||
          document.querySelector(".document-content") ||
          document.body;

        if (!mainContent) {
          throw new Error("Could not find main content element");
        }

        const HTMLContent = mainContent.innerHTML;

        if (!HTMLContent.trim()) {
          throw new Error("No content was extracted");
        }

        return {
          url: window.location.href,
          content: HTMLContent,
          title: document.title,
        };
      });

      await page.close();

      const turndownService = new TurndownService();
      const mdContent = turndownService.turndown(content.content);

      return {
        mdContent,
        url: content.url,
        title: content.title,
      };
    } catch (err) {
      console.error("Error scraping page:", url, err);
      throw err;
    }
  }

  async extractDocsPageWithTitle(urls: string[]) {
    try {
      await this.crawler.run(urls);
    } catch (err) {
      console.error("Error scraping page:", urls, err);
      throw err;
    }
  }

  // New function to scrape all URLs from a page
  async extractAllUrls(url: string): Promise<Array<{ url: string; title: string }>> {
    try {
      const page = (await browserManager.newPage()) as Page;
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const urlsWithTitles = await page.evaluate((baseUrl) => {
        const images = document.querySelectorAll("img");
        images.forEach((img) => img.remove());

        const allLinks = Array.from(document.querySelectorAll("a"));
        const links = allLinks.filter((link, index) => allLinks.findIndex((l) => l.href === link.href) === index);

        function isValidDocLink(href: string) {
          if (!href || href.trim() === "") return false;
          if (href.startsWith("mailto:")) return false;
          if (href.startsWith("tel:")) return false;
          if (href.startsWith("#")) return false;
          if (href.startsWith("javascript:")) return false;
          if (href.startsWith("data:")) return false;

          try {
            const url = new URL(href, baseUrl);
            const urlStr = new URL(href);
            const currentPath = new URL(baseUrl).pathname;
            if (url.origin !== new URL(baseUrl).origin) return false;
            if (urlStr.hash && urlStr.pathname === new URL(baseUrl).pathname) return false;
            if (url.pathname === currentPath && url.hash) return false;
            return true;
          } catch (e) {
            return false;
          }
        }

        return links
          .map((link) => {
            let title = link.textContent?.trim() || "";
            // Remove titles that look like CSS or are too long (e.g., > 200 chars)
            if ((title.startsWith(".") && title.includes("{") && title.includes("}")) || title.length > 200) {
              title = "--";
            }
            return {
              url: link.href,
              title,
              isRelative:
                link.getAttribute("href")?.startsWith("/") ||
                link.getAttribute("href")?.startsWith("./") ||
                (link.getAttribute("href") && !link.getAttribute("href")?.startsWith("http")),
            };
          })
          .filter((item) => {
            return isValidDocLink(item.url) && item.title !== "";
          })
          .map(({ url, title }) => ({ url, title })); // Remove the temporary isRelative property
      }, url);

      await page.close();
      return urlsWithTitles;
    } catch (err) {
      throw err;
    }
  }
}

export const docsScraper = new DocsScraper();
