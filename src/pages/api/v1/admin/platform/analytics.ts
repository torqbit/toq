import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import adminAnalytics from "@/services/server/admin/AdminAnalytics";
import * as z from "zod";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const analyticsSchema = z.object({
      duration: z.enum(["month", "quarter", "year"]),
      type: z.enum(["Orgs", "Users"]),
    });

    const { duration, type } = analyticsSchema.parse(req.body);

    switch (type) {
      case "Orgs":
        let earningDetail = await adminAnalytics.getOrgsByDuration(duration);
        return res.status(earningDetail.status).json(earningDetail);
      case "Users":
        const usersDetail = await adminAnalytics.getUsersByDuration(duration);
        return res.status(usersDetail.status).json(usersDetail);
      default:
        return res.status(400).json({ success: false, error: "Analytic type not defined" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(handler));
