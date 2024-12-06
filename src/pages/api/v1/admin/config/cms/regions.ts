import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const cmsAccess = z.object({
  accessKey: z.string().min(2, "Access key is required"),
  provider: z.string().min(2, "Provider is required"),
});

type CMSConfig = z.infer<typeof cmsAccess>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const accessConfig: CMSConfig = cmsAccess.parse(body);
    const cms = new ContentManagementService().getCMS(accessConfig.provider);
    const result = await cms.listReplicationRegions();
    return res.status(200).json({
      success: true,
      message: "Fetched the replicated regions successfully",
      regions: result,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
