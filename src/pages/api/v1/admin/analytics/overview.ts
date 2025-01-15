import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";

import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import analytics from "@/actions/analytics";
import { IAnalyticStats } from "@/types/courses/analytics";
import appConstant from "@/services/appConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const overviewResponse = await analytics.getOverviewDetails();
    return res.status(overviewResponse.status).json(overviewResponse);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withUserAuthorized(handler));
