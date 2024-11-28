import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import { APIResponse } from "@/types/cms/apis";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const config = body;
    const cms = new ContentManagementService().getCMS(config.provider);
    const response = await cms.getCMSConfig();
    return res
      .status(response.status)
      .json({ success: response.success, message: response.message, config: response.body });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
