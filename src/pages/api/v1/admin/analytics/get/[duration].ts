import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";

import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import analytics from "@/actions/analytics";
import { AnalyticsDuration, AnalyticsType } from "@/types/courses/analytics";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { duration, type } = req.query;
    switch (type as AnalyticsType) {
      case "Earnings":
        let earningDetail = await analytics.getEarnings(duration as AnalyticsDuration);
        return res.status(earningDetail.status).json({
          success: earningDetail.success,
          message: "Earning detail has been fetched",
          analyticStats: earningDetail.body,
        });

      default:
        return res.status(400).json({ success: false, error: "Analytic type not defined" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withUserAuthorized(handler));
