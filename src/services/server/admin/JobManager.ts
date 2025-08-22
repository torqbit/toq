import { KnowledgeSourceType, SourceStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import WebsiteCrawler from "../crawlers/WebsiteCrawler";
import UserAgent from "user-agents";
import TurndownService from "turndown";
import { CheerioCrawler, RequestQueue, sleep } from "crawlee";
import { getSizeInBytes } from "@/lib/utils";
import EmbeddingService from "../ai/EmbeddingService";

class JobManager {
  turndownService = new TurndownService();
  userAgent = new UserAgent();

  async addDocSite(site: string, tenantId: string) {
    //check if the link already exists in the knowledge source
    const existingSource = await prisma.knowledgeSource.findUnique({
      select: {
        id: true,
      },
      where: {
        sourceType: KnowledgeSourceType.DOCS_WEB_URL,
        sourceUrl_tenantId: {
          sourceUrl: site,
          tenantId,
        },
      },
    });
    if (existingSource) {
      throw new Error("This url already exists. Try adding another url");
    }

    //check if the site is a valid link
    const url = new URL(site);
    if (!(url.host.startsWith("doc") || url.pathname.includes("doc"))) {
      throw new Error("Invalid Document website url. Example: https://docs.google.com OR https://google.com/docs");
    }
    const crawer = new WebsiteCrawler(site, 1);
    const links = await crawer.crawl(2000);

    if (links.length === 0) {
      throw new Error("No links were found. Try checking your url");
    }

    const urlDocLinks = links
      .map((link) => new URL(link))
      .filter((link) => link.host.startsWith("doc") || link.pathname.includes("doc"))
      .map((link) => link.href);

    // Prepare data for bulk creation
    const docsiteData = {
      title: site,
      sourceUrl: site,
      tenantId,
      sourceType: KnowledgeSourceType.DOCS_WEB_URL,
    };
    const knowledgeSourceData = urlDocLinks.map((link) => ({
      title: link,
      sourceUrl: link,
      tenantId,
    }));

    const createDocsiteSource = await prisma.knowledgeSource.upsert({
      where: { sourceUrl_tenantId: { sourceUrl: site, tenantId } },
      select: { id: true },
      update: {},
      create: docsiteData,
    });

    const createdSources = await prisma.$transaction(
      // Use upsert to create or update based on sourceUrl
      knowledgeSourceData.map((data) =>
        prisma.knowledgeSource.upsert({
          where: { sourceUrl_tenantId: { sourceUrl: data.sourceUrl, tenantId } },
          select: { id: true },
          update: {}, // No updates needed if it exists
          create: {
            ...data,
            parentSourceId: createDocsiteSource.id,
          },
        })
      )
    );

    return { sourceId: createDocsiteSource.id, urlsCount: createdSources.length };
  }

  async addKnowledgeSource(sourceUrl: string, tenantId: string) {
    //check if the sourceUrl already exists and return the id and status
    const existingKS = await prisma.knowledgeSource.findUnique({
      select: {
        id: true,
        status: true,
      },
      where: { sourceUrl_tenantId: { sourceUrl, tenantId } },
    });

    if (existingKS) {
      throw new Error("This url already exists. Try adding another url");
    }
    const newKS = await prisma.knowledgeSource.upsert({
      where: { sourceUrl_tenantId: { sourceUrl, tenantId } },
      select: { id: true },
      update: {}, // No updates needed if it exists
      create: {
        sourceUrl: sourceUrl,
        tenantId,
        title: sourceUrl,
        sourceType: KnowledgeSourceType.URL,
      },
    });

    const requestQueue = await RequestQueue.open(`queue-${newKS.id}`);
    requestQueue.addRequest({ url: sourceUrl, userData: { tenantId, sourceId: newKS.id } });
    const crawler = new CheerioCrawler({
      requestQueue,
      minConcurrency: 1,
      maxConcurrency: 1,
      requestHandlerTimeoutSecs: 30,
      maxRequestRetries: 3,
      useSessionPool: true,
      preNavigationHooks: [
        async ({ request, session, proxyInfo }, gotoOptions) => {
          gotoOptions.headers = {
            "User-Agent": this.userAgent.random().toString(),
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: request.url,
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Cache-Control": "max-age=0",
          };
        },
      ],
      requestHandler: async ({ request, $, log, response }) => {
        const title = $("title").text().trim();
        const $body = $("html");

        // Remove all <script> and <a> tags inside the body

        $body.find("script, a, header, footer, nav, aside, img, svg, style").remove();
        const contentHtml = $body.html() || "";
        if (contentHtml) {
          const markdown = this.turndownService.turndown(contentHtml);
          const markdownSize = getSizeInBytes(markdown);

          await prisma.knowledgeSource.update({
            where: {
              id: request.userData.sourceId,
              tenantId: request.userData.tenantId,
            },
            data: {
              status: SourceStatus.FETCHED,
              content: markdown,
              title: title,
              metadata: {
                sizeInBytes: markdownSize,
              },
              updatedAt: new Date(),
            },
          });

          await EmbeddingService.addDocument(tenantId, { id: request.userData.sourceId, text: markdown });
          //update the status of the Knowledge Source
          await prisma.knowledgeSource.update({
            where: {
              id: request.userData.sourceId,
              tenantId,
            },
            data: {
              status: SourceStatus.ADDED,
              updatedAt: new Date(),
              title,
              errorMessage: null,
              metadata: {
                sizeInBytes: markdownSize,
              },
            },
          });
          // update ai training data
        } else {
          console.error(`No content found for ${request.url}`);
          await prisma.knowledgeSource.update({
            where: {
              id: request.userData.sourceId,
              tenantId,
            },
            data: {
              status: SourceStatus.ADDED,
              updatedAt: new Date(),
              title,
              errorMessage: "Unable to extract the content",
            },
          });
        }
      },
    });

    await crawler.run();
    requestQueue.drop();
    return { sourceId: newKS.id, urlsCount: 1 };
  }

  async addKnowledgeSourceFromUrls(
    parentSourceId: string,
    urlSources: Array<{ url: string; sourceId: string }>,
    tenantId: string
  ) {
    const requestQueue = await RequestQueue.open(`queue-${tenantId}-${parentSourceId}`);
    requestQueue.addRequests(urlSources.map((us) => ({ url: us.url, userData: { tenantId, sourceId: us.sourceId } })));

    // update knowledge source status to  PROCESSING
    await prisma.knowledgeSource.update({
      where: {
        id: parentSourceId,
        tenantId,
      },
      data: {
        status: SourceStatus.PROCESSING,
        updatedAt: new Date(),
      },
    });

    const crawler = new CheerioCrawler({
      requestQueue,
      minConcurrency: 1,
      maxConcurrency: 1,
      requestHandlerTimeoutSecs: 30,
      maxRequestRetries: 3,
      useSessionPool: true,
      autoscaledPoolOptions: {
        desiredConcurrency: 1,
        snapshotterOptions: {
          maxUsedMemoryRatio: 0.95, // Lower ratio to trigger GC sooner
          maxBlockedMillis: 1500, // Lower to react faster to memory pressure
        },
        scaleUpStepRatio: 0.05, // More conservative scaling
        scaleDownStepRatio: 0.7, // Faster to scale down
      },
      preNavigationHooks: [
        async ({ request, session, proxyInfo }, gotoOptions) => {
          gotoOptions.headers = {
            "User-Agent": this.userAgent.random().toString(),
          };
        },
      ],
      requestHandler: async ({ request, $, log }) => {
        // Use try/finally to ensure dereferencing and GC
        let markdown = null;
        let contentHtml = null;
        let $body = null;
        try {
          log.info(`Processing: ${request.url}`);
          const title = $("title").text().trim();
          $body = $("html");

          // Remove all <script> and <a> tags inside the body
          $body.find("script, a, header, footer, nav, aside, img, svg, style").remove();
          contentHtml = $body.html() || "";
          if (contentHtml) {
            markdown = this.turndownService.turndown(contentHtml);
            const markdownSize = getSizeInBytes(markdown);

            log.info(`Saving content of size ${markdownSize} bytes for ${request.url}`);
            await prisma.knowledgeSource.update({
              where: {
                id: request.userData.sourceId,
                tenantId: request.userData.tenantId,
              },
              data: {
                status: SourceStatus.FETCHED,
                content: markdown,
                title: title,
                metadata: {
                  sizeInBytes: markdownSize,
                },
                updatedAt: new Date(),
              },
            });
            await EmbeddingService.addDocument(tenantId, { id: request.userData.sourceId, text: markdown });
            //update the status of the Knowledge Source
            await prisma.knowledgeSource.update({
              where: {
                id: request.userData.sourceId,
                tenantId,
              },
              data: {
                status: SourceStatus.ADDED,
                updatedAt: new Date(),
                errorMessage: null,
              },
            });

            // update ai training data
          } else {
            log.error(`No content found for ${request.url}`);
            await prisma.knowledgeSource.update({
              where: {
                id: request.userData.sourceId,
                tenantId,
              },
              data: {
                status: SourceStatus.FAILED,
                updatedAt: new Date(),
                errorMessage: "Unable to extract the content",
              },
            });
          }
        } catch (error: any) {
          log.error(`Error processing ${request.url}:`, error.message);
          await prisma.knowledgeSource.update({
            where: {
              id: request.userData.sourceId,
              tenantId,
            },
            data: {
              status: SourceStatus.FAILED,
              updatedAt: new Date(),
              errorMessage: error.message,
            },
          });
        }
        log.info(`sleeping for few seconds`);
        await sleep(2000 + Math.random() * 1000); // Sleep 2–3 seconds
      },
    });

    crawler.run().then(async () => {
      console.log("Crawling finished!");
      requestQueue.drop();
      await prisma.knowledgeSource.update({
        where: {
          id: parentSourceId,
          tenantId,
        },
        data: {
          status: SourceStatus.ADDED,
          updatedAt: new Date(),
        },
      });
    });
  }

  async addSitemap(sitemap: string, tenantId: string): Promise<{ sourceId: string; urlsCount: number }> {
    //check if this sitemap already exists in knowledge source
    const existingSource = await prisma.knowledgeSource.findUnique({
      where: {
        sourceUrl_tenantId: {
          sourceUrl: sitemap,
          tenantId,
        },
      },
    });
    if (existingSource) {
      throw new Error("Sitemap already exists. Try adding another sitemap.xml");
    }

    const crawer = new WebsiteCrawler(sitemap, 2);
    const links = await crawer.getSitemapLinks(sitemap);

    if (links.length === 0) {
      throw new Error("No links found in sitemap");
    }
    // Prepare data for bulk creation
    const siteMapData = {
      title: sitemap,
      sourceUrl: sitemap,
      tenantId,
      sourceType: KnowledgeSourceType.SITEMAP,
    };
    const knowledgeSourceData = links.map((link) => ({
      title: link,
      sourceUrl: link,
      tenantId,
    }));

    const createSitemapSource = await prisma.knowledgeSource.upsert({
      where: { sourceUrl_tenantId: { sourceUrl: sitemap, tenantId } },
      select: { id: true },
      update: {},
      create: siteMapData,
    });

    const createdSources = await prisma.$transaction(
      // Use upsert to create or update based on sourceUrl
      knowledgeSourceData.map((data) =>
        prisma.knowledgeSource.upsert({
          where: { sourceUrl_tenantId: { sourceUrl: data.sourceUrl, tenantId } },
          select: { id: true },
          update: {}, // No updates needed if it exists
          create: {
            ...data,
            parentSourceId: createSitemapSource.id,
          },
        })
      )
    );

    return { sourceId: createSitemapSource.id, urlsCount: createdSources.length };
  }
}

export default new JobManager();
