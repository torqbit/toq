import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import analytics from "@/actions/analytics";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { getCookieName } from "@/lib/utils";

import { z } from "zod";
import WebsiteCrawler from "@/services/server/crawlers/WebsiteCrawler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Define the schema for validation
    const schema = z.object({
      website: z.string().url(),
    });

    // Validate the request body
    const { website } = schema.parse(req.body);

    const crawer = new WebsiteCrawler(website, 2);
    const content = await crawer.crawlAndParse(website);

    if (content) {
      return res.status(200).send(content);
    } else {
      return res.status(400).send("No content found");
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);
