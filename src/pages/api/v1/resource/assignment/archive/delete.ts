import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import prisma from "@/lib/prisma";
import appConstant from "@/services/appConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { archiveUrl } = query;

    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    if (cmsConfig && archiveUrl) {
      const result = await cms.deletePrivateFile(cmsConfig, archiveUrl as string);
      if (result.success) {
        return res.json({ success: true, message: "Archive has been deleted" });
      } else {
        return res.json({ success: false, message: "Failed to delete archive file" });
      }
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));
