import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import { APIServerError } from "@/types/apis";
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
    const result = await cms.testConfiguration({ accessKey: accessConfig.accessKey });

    if (result instanceof Boolean && result.valueOf()) {
      return res.status(200).json({ success: true, message: "Connection has been tested successfully" });
    } else if (result instanceof Boolean && !result.valueOf()) {
      return res.status(200).json({ success: false, message: "Unable to connect with the service" });
    } else if (result instanceof APIServerError) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
