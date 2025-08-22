import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import adminAnalytics from "@/services/server/admin/AdminAnalytics";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const overviewResponse = await adminAnalytics.getPlatformStats();
    return res.status(overviewResponse.status).json(overviewResponse);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
