import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { checkSiteStatus } from "@/services/siteConfigService/checkStatus";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { redirectUrl } = req.query;

    const getRedirectUrl = await checkSiteStatus(redirectUrl !== "undefined" ? (redirectUrl as string) : undefined);
    return res.status(200).json({ success: true, redirectUrl: getRedirectUrl });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
