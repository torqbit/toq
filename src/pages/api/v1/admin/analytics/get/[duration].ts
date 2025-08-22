import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";

import analytics from "@/actions/analytics";
import { AnalyticsDuration, AnalyticsType } from "@/types/courses/analytics";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { duration, type } = req.query;
    let d = duration as AnalyticsDuration;

    const session = await getServerSession(req, res, await authOptions(req));
    switch (type as AnalyticsType) {
      case "AIMessages":
        let aiMessageDetail = await analytics.getAssistantMessageDetailByDuration(d, String(session?.tenant?.tenantId));
        return res.status(aiMessageDetail.status).json(aiMessageDetail);
      case "PageViews":
        let pageViewDetail = await analytics.getPageViewDetailByDuration(d, String(session?.tenant?.tenantId));
        return res.status(pageViewDetail.status).json(pageViewDetail);

      case "Users":
        const usersDetail = await analytics.getUserDetailByDuration(d, String(session?.tenant?.tenantId));

        return res.status(usersDetail.status).json(usersDetail);
      default:
        return res.status(400).json({ success: false, error: "Analytic type not defined" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
