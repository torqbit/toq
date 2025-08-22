import { iso8601ToSeconds } from "@/lib/utils";
import { createCanvas, loadImage } from "canvas";
import { OpenAI } from "openai";
import path, { resolve } from "path";
// import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
// import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import os from "os";

// Set FFmpeg path (required for bundled installer)
// ffmpeg.setFfmpegPath(ffmpegInstaller.path);
import browserManager from "../lib/browserManager";
import appConstant from "@/services/appConstant";
import { SiteInfo } from "@/lib/types/site";
import TurndownService from "turndown";

class ContentAI {
  openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  });

  private turndown: TurndownService;
  constructor() {
    this.turndown = new TurndownService();
  }

  private async getSiteTheme(
    imagePath: string,
    sampleSize = 100
  ): Promise<{ dominantColor: number[]; theme: "light" | "dark" }> {
    try {
      // Load the image
      const image = await loadImage(imagePath);

      // Create a canvas with reduced dimensions for faster processing
      const canvas = createCanvas(sampleSize, sampleSize * (image.height / image.width));
      const ctx = canvas.getContext("2d");

      // Draw the image to the canvas (this resizes it to our sample size)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Get the pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Create a map to count occurrences of each color
      const colorCounts: { [key: string]: number } = {};

      // Count each pixel's color (skip pixels with transparency)
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Create a key for this color (quantizing to reduce the number of unique colors)
        // Divide by 8 to reduce from 16.7 million to ~32k colors
        const quantizedR = Math.floor(r / 8) * 8;
        const quantizedG = Math.floor(g / 8) * 8;
        const quantizedB = Math.floor(b / 8) * 8;

        const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;

        // Increment the count for this color
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }

      // Find the color with the highest count
      let maxCount = 0;
      let dominantColorKey = "";

      for (const colorKey in colorCounts) {
        if (colorCounts[colorKey] > maxCount) {
          maxCount = colorCounts[colorKey];
          dominantColorKey = colorKey;
        }
      }

      // Convert the dominant color key back to RGB
      const [r, g, b] = dominantColorKey.split(",").map(Number);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      // If the luminance is greater than 0.5, consider it light; otherwise, consider it dark
      return {
        dominantColor: [r, g, b],
        theme: luminance > 0.5 ? "light" : "dark",
      };
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private async getSiteBrandColor(imgPath: String): Promise<string> {
    const ColorThief = require("colorthief");

    // Helper function to check if a color is too light or too dark
    const isColorValid = (rgb: number[]): boolean => {
      const [r, g, b] = rgb;
      // Calculate relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      // Filter out too dark (< 0.15) or too light (> 0.85) colors
      return luminance > 0.2 && luminance < 0.75;
    };

    // Convert RGB array to hex string
    const rgbToHex = (rgb: number[]): string => {
      return (
        "#" +
        rgb
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")
      );
    };

    try {
      // Get dominant color and palette
      const dominantColor = await ColorThief.getColor(imgPath);
      const palette = await ColorThief.getPalette(imgPath, 10); // Get 10 colors

      // Filter valid colors from palette
      const validColors = palette.filter(isColorValid);

      // Helper function to convert RGB to HSL
      const rgbToHsl = (color: number[]): [number, number, number] => {
        const [r, g, b] = color;
        const r1 = r / 255;
        const g1 = g / 255;
        const b1 = b / 255;
        const max = Math.max(r1, g1, b1);
        const min = Math.min(r1, g1, b1);
        let h = 0,
          s = 0,
          l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r1:
              h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
              break;
            case g1:
              h = (b1 - r1) / d + 2;
              break;
            case b1:
              h = (r1 - g1) / d + 4;
              break;
          }
          h /= 6;
        }

        return [h * 360, s * 100, l * 100];
      };

      // Calculate color vibrancy score (higher is more vibrant)
      const getVibrancyScore = (color: number[]): number => {
        const [h, s, l] = rgbToHsl(color);
        // Prefer colors with high saturation and moderate-high lightness
        return s * (1 - Math.abs(l - 60) / 60);
      };

      // Find the most vibrant color from the palette
      const brandColor = validColors.reduce((mostVibrant: number[], current: number[]) => {
        const currentScore = getVibrancyScore(current);
        const mostVibrantScore = getVibrancyScore(mostVibrant);
        return currentScore > mostVibrantScore ? current : mostVibrant;
      });

      return rgbToHex(brandColor);
    } catch (error) {
      console.error("Error extracting colors:", error);
      return "#8980fd"; // Fallback colors
    }
  }

  /**
   * Get the main content from a webpage
   * @param {string} domain - The domain to scrape
   * @returns {Promise<string>} The HTML content of the page
   */
  public getWebpageContent = async (
    domain: string
  ): Promise<{ content: string; brandColor: string | null; links: string; theme: "light" | "dark" }> => {
    if (!domain.startsWith("http")) {
      domain = "https://" + domain;
    }

    try {
      await browserManager.ensureHealthyBrowser();
      const page = await browserManager.newPage();
      if (page) {
        await page.goto(domain, {
          waitUntil: ["domcontentloaded"],
          timeout: 60000,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        page.on("console", (msg: any) => {
          console.log(msg.text());
        });

        const cloudflareSelector = "#challenge-running, #cf-challenge-running";
        const hasCloudflarePage = (await page.$(cloudflareSelector)) !== null;

        if (hasCloudflarePage) {
          await page.waitForFunction('document.querySelector("#challenge-running, #cf-challenge-running") === null', {
            timeout: 30000,
          });
        }

        // take the screenshot of the page and call the getSiteColors function
        const dirPath = path.join(os.homedir(), ".torqbit");
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        const heroFilePath = path.join(dirPath, `hero-screenshot-${new Date().getTime()}`);
        const navFilePath = path.join(dirPath, `nav-screenshot-${new Date().getTime()}`);
        const screenshot = await page.screenshot({
          path: `${heroFilePath}.png`,
          fullPage: false,
          clip: {
            width: 1600,
            height: 800,
            x: 0,
            y: 0,
          },
        });
        const navScreenshot = await page.screenshot({
          path: `${navFilePath}.png`,
          fullPage: false,
          clip: {
            width: 1600,
            height: 100,
            x: 0,
            y: 0,
          },
        });
        const brandColor = await this.getSiteBrandColor(`${heroFilePath}.png`);
        const siteInfo = await this.getSiteTheme(`${navFilePath}.png`);

        //delete the images
        fs.unlinkSync(`${heroFilePath}.png`);
        fs.unlinkSync(`${navFilePath}.png`);

        // Extract all links with error handling
        const links = await page.evaluate(() => {
          try {
            //display the entire html

            const linkElements = document.querySelectorAll("a");
            const metaElements = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');

            // Get favicon link
            const faviconLink = Array.from(metaElements)
              .map((link) => link.getAttribute("href"))
              .find((href) => href);

            // Process regular links
            const socialAndDocLinks = Array.from(linkElements)
              .map((link) => ({
                text: link.textContent?.trim() || "",
                href: link.href,
              }))
              .filter((link) => {
                const url = link.href.toLowerCase();
                return (
                  // Social media links
                  url.includes("twitter.com") ||
                  url.includes("x.com") ||
                  url.includes("facebook.com") ||
                  url.includes("linkedin.com") ||
                  url.includes("github.com") ||
                  url.includes("instagram.com") ||
                  url.includes("discord") ||
                  url.includes("youtube.com")
                );
              })
              .map((link) => `${link.text}: ${link.href}`);

            // Add favicon if found
            const allLinks = faviconLink ? [`Favicon: ${faviconLink}`, ...socialAndDocLinks] : socialAndDocLinks;

            return allLinks.join("\n");
          } catch (error) {
            return "";
          }
        });

        // Extract meta information with error handling
        const metaInfo = await page.evaluate(() => {
          try {
            const metaTags = document.querySelectorAll("meta");
            return Array.from(metaTags)
              .map((meta) => {
                const name = meta.getAttribute("name") || meta.getAttribute("property");
                const content = meta.getAttribute("content");
                return name && content ? `${name}: ${content}` : null;
              })
              .filter((info) => info !== null)
              .join("\n");
          } catch (error) {
            return "";
          }
        });

        await page.evaluate(() => {
          // Select all unwanted elements
          const elements = document.querySelectorAll(
            "header, nav, aside, footer, script, style, img, a, td.linenos, noscript"
          );

          // Remove each unwanted element
          elements.forEach((el) => el.remove());
        });

        const siteContent = await page.evaluate(() => {
          return document.body.innerHTML;
        });

        const markdownContent = this.turndown.turndown(siteContent);

        // Close the browser
        await page.close();

        if (metaInfo.trim() === "" || links.trim() === "") {
          throw new Error("Failed to get webpage content");
        }

        const content = `DOMAIN: ${domain}\n\nMETA INFO:\n${metaInfo}\n\nIMPORTANT LINKS:\n${links}\n\n ## SITE Content \n${markdownContent}`;
        return { content, brandColor: brandColor, theme: siteInfo.theme, links };
      } else {
        throw new Error("Failed to get webpage content");
      }
    } catch (error) {
      throw new Error(`Failed to connect and extract the content from ${domain}`);
    }
  };

  /**
   * Extract social media handles using OpenAI
   * @param {string} pageContent - Website content
   * @returns {Promise<Object>} Extracted social media handles
   */
  public extractWithAI = async (
    domain: string,
    links: string,
    pageContent: string,
    brandColor: string | null,
    theme: "dark" | "light"
  ): Promise<SiteInfo> => {
    try {
      const response = await this.openai.chat.completions.create({
        model: appConstant.TextToTextModel,

        messages: [
          {
            role: "system",
            content: `You are an AI specialized in extracting social media handles, company name, favicon, open graph image, open graph title and 
                    description from website content.
                    Extract the Twitter/X, GitHub, YouTube, Instagram, and LinkedIn handles, blog, docs link and open graph details for the given website.

                    Based on the description extracted, create 3 FAQ for this company.

                    Based on the Site Content, generate a system prompt that will be used for OpenAI's ChatCompletion API to assist the users 
                    of this company in understanding the company's services and products, and help in onboarding the users.'
                   

                    Return ONLY a JSON object with the following structure:
                    {
                      "socialLinks": {
                        "xcom":  "full_url" or null if not found,
                        "github":  "full_url" or null if not found,
                        "youtube":  "full_url" or null if not found,
                        "instagram":  "full_url" or null if not found,
                        "linkedin":  "full_url" or null if not found
                        "discord": "full_url" or null if not found
                      }
                      "name": "company_name" or null if not found, 
                      "favicon": "full_url" or null if not found
                      "ogImage": "full_url" or null if not found
                      "description": "description" or null if not found
                      "title": "title" or null if not found
                       "faqs": [{"question": "question", "answer": "answer"}, {"question": "question", "answer": "answer"}, {"question": "question", "answer": "answer"}],
                       "systemPrompt": "system_prompt" or null if not found
                    }
                    Make educated guesses when partial information is available. For example, if you see an icon linking to Twitter but can't determine the handle, use the domain name as a guess for the handle.
                    
                    `,
          },
          {
            role: "user",
            content: `Extract social media handles from this website content: ${pageContent} and extract the relevant social links from the links: ${links}`,
          },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      // Parse the AI response
      const jsonResponse = JSON.parse(response.choices[0].message.content!);

      return {
        website: domain.startsWith("http") ? domain : `https://${domain}`,
        theme: theme,
        brandColor: brandColor,
        ...jsonResponse,
      };
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      throw error;
    }
  };
}

export default new ContentAI();
