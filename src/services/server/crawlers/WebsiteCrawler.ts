import browserManager from "../lib/browserManager";
import TurndownService from "turndown";
import { Page } from "puppeteer";

class WebsiteCrawler {
  private website: string;
  private depth: number;
  private visitedUrls: Set<string>;
  private discoveredLinks: Set<string>;
  private turndown: TurndownService;
  private readonly FILTERED_EXTENSIONS = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".zip",
    ".rar",
    ".tar",
    ".gz",
    ".7z",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".webp",
    ".mp3",
    ".mp4",
    ".avi",
    ".mov",
    ".wmv",
    ".flv",
    ".exe",
    ".dmg",
    ".pkg",
    ".deb",
    ".rpm",
  ];

  /**
   * Check if URL belongs to the same base domain
   */
  private isSameDomain(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const baseUrlObj = new URL(this.website);
      return urlObj.hostname === baseUrlObj.hostname;
    } catch {
      return false;
    }
  }

  /**
   * Check if URL should be filtered out
   */
  private shouldFilterUrl(url: string): boolean {
    const lowerUrl = url.toLowerCase();

    // Filter out non-http protocols
    if (
      lowerUrl.startsWith("mailto:") ||
      lowerUrl.startsWith("tel:") ||
      lowerUrl.startsWith("ftp:") ||
      lowerUrl.startsWith("javascript:")
    ) {
      return true;
    }

    // Filter out file extensions
    return this.FILTERED_EXTENSIONS.some((ext) => lowerUrl.includes(ext));
  }

  /**
   * Normalize URL by removing fragments and trailing slashes
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      urlObj.hash = ""; // Remove fragment
      let normalizedUrl = urlObj.toString();

      // Remove trailing slash unless it's the root
      if (normalizedUrl.endsWith("/") && normalizedUrl !== this.website + "/") {
        normalizedUrl = normalizedUrl.slice(0, -1);
      }

      return normalizedUrl;
    } catch {
      return url;
    }
  }

  /**
   * Extract links from a page
   */
  private async extractLinks(pageUrl: string): Promise<string[]> {
    let page: Page | undefined;
    try {
      page = (await browserManager.newPage()) as Page;
      await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
      const links = await page.evaluate(() => {
        const anchorElements = Array.from(document.querySelectorAll("a[href]"));
        return anchorElements.map((a) => (a as HTMLAnchorElement).href).filter((href) => href && href.trim() !== "");
      });

      return links
        .map((link) => {
          try {
            // Convert relative URLs to absolute
            return new URL(link, page?.url()).toString();
          } catch {
            return null;
          }
        })
        .filter((link): link is string => link !== null)
        .map((link) => this.normalizeUrl(link))
        .filter((link) => this.isSameDomain(link) && !this.shouldFilterUrl(link));
    } catch (error) {
      console.error("Error extracting links:", error);
      return [];
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  constructor(website: string, depth: number) {
    this.website = website;
    this.depth = depth;
    this.visitedUrls = new Set();
    this.discoveredLinks = new Set();
    this.turndown = new TurndownService({
      headingStyle: "atx", // Use # for headers
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      fence: "```",
      emDelimiter: "*",
      strongDelimiter: "**",
      linkStyle: "inlined",
      linkReferenceStyle: "full",
    });

    // Custom rules for better conversion
    this.addCustomRules();
  }

  // write a method to get the depth of a link based on number of slashes, after protocol and hostname
  // for example, rotocol and hostname
  // for example, URL_ADDRESS.com/page1/page2/page3 should have depth 3 and URL_ADDRESS.com/page1/page2 should have depth 2
  // if the URL is not a valid URL, return 0
  // if the URL is a valid URL, return the depth
  // if the URL is not a valid URL, return 0
  private getDepth(url: string): number {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const pathSegments = pathname.split("/").filter((segment) => segment.trim() !== "");
      return pathSegments.length;
    } catch {
      return 0;
    }
  }

  /**
   * Main crawling function
   */
  async crawl(delay: number): Promise<string[]> {
    this.visitedUrls.clear();

    try {
      const urlsToVisit: Array<{ url: string; depth: number }> = [{ url: this.normalizeUrl(this.website), depth: 0 }];

      while (urlsToVisit.length > 0) {
        const { url, depth } = urlsToVisit.shift()!;

        // Skip if already visited or max depth exceeded
        if (this.visitedUrls.has(url) || depth > this.depth) {
          continue;
        }

        this.visitedUrls.add(url);

        // Crawl the page
        const result = await this.extractLinks(url);
        result.forEach((link) => this.discoveredLinks.add(link));
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Add new links to the queue if within depth limit
        if (depth < this.depth && result.length > 0) {
          for (const link of result) {
            if (!this.visitedUrls.has(link) && this.getDepth(link) <= this.depth) {
              urlsToVisit.push({ url: link, depth: depth + 1 });
            }
          }
        }
      }

      return Array.from(this.discoveredLinks);
    } finally {
    }
  }

  private addCustomRules() {
    // Handle images better
    this.turndown.addRule("images", {
      filter: "img",
      replacement: (content, node: any) => {
        const alt = node.getAttribute("alt") || "";
        const src = node.getAttribute("src") || "";
        const title = node.getAttribute("title");
        return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`;
      },
    });

    // Handle tables
    this.turndown.addRule("tables", {
      filter: "table",
      replacement: (content) => "\n" + content + "\n",
    });

    const domainUrl = new URL(this.website);
    const domain = `${domainUrl.protocol}//${domainUrl.hostname}`;
    // Handle links and add domain name for relative links
    this.turndown.addRule("links", {
      filter: "a",
      replacement: (content, node) => {
        const href = (node as HTMLAnchorElement).getAttribute("href");

        if (href && content.trim() !== "") {
          if (href.startsWith("./")) return `[${content}](${domain}/${href.substring(2)})`;
          else if (href.startsWith("../")) return `[${content}](${domain}/${href.substring(3)})`;
          else if (href.startsWith("/")) return `[${content}](${domain}${href})`;
          else return `[${content}](${href})`;
        } else {
          return ``;
        }
      },
    });

    // Preserve line breaks in code
    this.turndown.addRule("preserveCodeWhitespace", {
      filter: ["pre", "code"],
      replacement: (content, node) => {
        if (node.nodeName === "PRE") {
          return "\n```\n" + content + "\n```\n";
        }
        return "`" + content + "`";
      },
    });
  }

  //given a website, crawl it and return the links from the sitemap.xml
  async getSitemapLinks(sitemapLink: string): Promise<string[]> {
    const response = await fetch(sitemapLink);

    const xml = await response.text();

    // Import node-html-parser at the top of the file
    const { parse } = require("node-html-parser");

    // Parse the XML using node-html-parser instead of DOMParser
    const doc = parse(xml, {
      comment: false,
      blockTextElements: {
        script: true,
        noscript: true,
        style: true,
        pre: true,
      },
    });

    // Use querySelector to find all loc elements
    const links = doc.querySelectorAll("loc");
    let sitemapLinks: string[] = [];

    for (let i = 0; i < links.length; i++) {
      //if the link points to another sitemap, then generate a new crawler for that sitemap
      if (links[i].textContent?.includes("sitemap")) {
        sitemapLinks = [...sitemapLinks, ...(await this.getSitemapLinks(links[i].textContent))];
      } else {
        sitemapLinks.push(links[i].textContent);
      }
    }
    console.log(`count of sitemap links: ${sitemapLinks.length}`);
    return sitemapLinks;
  }

  //get the links from the website
  async getLinks(): Promise<Array<{ url: string; title: string }>> {
    let page: Page | undefined;
    try {
      page = (await browserManager.newPage()) as Page;
      await page.goto(this.website, { waitUntil: "domcontentloaded" });

      const urlsWithTitles = await page.evaluate((baseUrl) => {
        // Remove image elements
        const images = document.querySelectorAll("img");
        images.forEach((img) => img.remove());

        const links = Array.from(document.querySelectorAll("a"));
        const currentDomain = new URL(baseUrl).hostname;

        return links
          .map((link) => {
            const href = link.getAttribute("href");
            let absoluteUrl = link.href; // Default to browser-resolved URL

            // Handle relative URLs that might not be properly resolved by the browser
            if (href) {
              if (href.startsWith("/")) {
                // Absolute path relative to domain root
                const baseUrlObj = new URL(baseUrl);
                absoluteUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}${href}`;
              } else if (href.startsWith("./") || href.startsWith("../") || !href.startsWith("http")) {
                // Relative path or path without protocol
                if (!href.startsWith("http")) {
                  try {
                    // Use URL constructor to resolve relative paths
                    const resolvedUrl = new URL(href, baseUrl);
                    absoluteUrl = resolvedUrl.href;
                  } catch {
                    // If URL construction fails, fall back to browser-resolved URL
                  }
                }
              }
            }

            return {
              url: absoluteUrl,
              title: link.textContent?.trim() || "",
              isRelative:
                href?.startsWith("/") ||
                href?.startsWith("./") ||
                href?.startsWith("../") ||
                (href && !href.startsWith("http")),
            };
          })
          .filter((item) => {
            if (!item.url) return false;

            // Include links with relative URLs
            if (item.isRelative) return true;

            // Include links from the same domain
            try {
              const linkDomain = new URL(item.url).hostname;
              return linkDomain === currentDomain;
            } catch {
              return false;
            }
          })
          .map(({ url, title }) => ({ url, title }));
      }, this.website);

      return urlsWithTitles;
    } catch (err) {
      throw err;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  //given a website link, crawl and parse it and return the content in markdown format
  async crawlAndParse(link: string) {
    let page: Page | undefined;
    try {
      page = await browserManager.newPage();
      if (page) {
        await page.goto(link, { waitUntil: "domcontentloaded" });

        // Get the page title before removing elements
        const title = await page.evaluate(() => {
          return document.title;
        });

        // Remove unwanted elements
        await page.evaluate(() => {
          const elements = document.querySelectorAll("header, nav, aside, footer, script, style, img, td.linenos");
          elements.forEach((el) => el.remove());
        });

        // Extract the content
        // Check for 404 or empty content
        const { content, is404 } = await page.evaluate(() => {
          // Check for common 404 indicators in the page
          const bodyText = document.body?.innerText?.toLowerCase() || "";
          const titleText = document.title?.toLowerCase() || "";
          const is404 =
            bodyText.includes("404") ||
            titleText.includes("404") ||
            bodyText.includes("not found") ||
            bodyText.includes("page not found");
          return {
            content: document.body.innerHTML,
            is404,
          };
        });

        if (is404 && !content.trim()) {
          return {
            title: "404 Not Found",
            content: "Sorry, the page you are looking for does not exist.",
            is404: true,
          };
        }

        // Convert content to markdown
        const markdownContent = this.convertToMarkdown(content);
        // Return both title and content
        return {
          title,
          content: markdownContent,
          is404: false,
        };
      }
    } catch (e) {
      console.log("Error crawling and parsing", e);
      return {
        title: "",
        content: "",
        is404: true,
      };
    } finally {
      page && (await page.close());
    }
  }

  convertToMarkdown(htmlContent: string): string {
    let markdownContent = this.turndown.turndown(htmlContent);
    return markdownContent;
  }
}

export default WebsiteCrawler;
