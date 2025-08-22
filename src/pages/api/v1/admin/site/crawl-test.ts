import { NextApiResponse, NextApiRequest } from "next";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withMethods } from "@/lib/api-middlewares/with-method";
import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import JobManager from "@/services/server/admin/JobManager";
import { KnowledgeSourceType } from "@prisma/client";
import { APIResponse } from "@/types/apis";

export const validateReqBody = z.object({
  sourceUrl: z.string(),
  sourceType: z.enum(["TXT", "DOCS_WEB_URL", "MARKETING_WEB_URL", "SITEMAP", "URL", "PDF", "DOCX", "VIDEO"]),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const reqBody = validateReqBody.parse(body);

    switch (reqBody.sourceType) {
      case KnowledgeSourceType.SITEMAP:
        const response = await JobManager.addSitemap(reqBody.sourceUrl, "cmbqkflrq0007hunpqt6fgmjj");
        return res.status(200).json(new APIResponse<any>(true, 200, "Sitemap Crawl Job Added", response));

      case KnowledgeSourceType.DOCS_WEB_URL:
        const addDocsUrlResponse = await JobManager.addDocSite(reqBody.sourceUrl, "cmbqkflrq0007hunpqt6fgmjj");
        return res.status(200).json(new APIResponse<any>(true, 200, "Docs URL Crawl Job Added", addDocsUrlResponse));

      case KnowledgeSourceType.URL:
        const addUrlResponse = await JobManager.addKnowledgeSource(reqBody.sourceUrl, "cmbqkflrq0007hunpqt6fgmjj");
        return res.status(200).json(new APIResponse<any>(true, 200, "URL Crawl Job Added", addUrlResponse));

      default:
        return res.status(404).json(new APIResponse<any>(true, 404, "Invalid source type"));
    }
  } catch (error: any) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));
