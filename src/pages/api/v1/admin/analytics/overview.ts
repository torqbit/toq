import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";

import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import analytics from "@/actions/analytics";
import { IAnalyticStats } from "@/types/courses/analytics";
import appConstant from "@/services/appConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const earningDetail = await analytics.getTotalEarning();
    const enrollmentDetail = await analytics.getTotalEnrollments();
    const usersDetail = await analytics.getTotalUsers();

    let overviewStats: IAnalyticStats[] = [
      {
        type: "Earnings",
        total: `${earningDetail.body?.totalEarning}`,
        comparedPercentage: Number(earningDetail.body?.comparedPercentage),
      },
      {
        type: "Enrollments",
        total: `${enrollmentDetail.body?.totalEnrollment}`,
        comparedPercentage: Number(enrollmentDetail.body?.comparedPercentage),
      },
      {
        type: "Users",
        total: `${usersDetail.body?.totalUsers}`,
        comparedPercentage: Number(usersDetail.body?.comparedPercentage),
      },
    ];
    return res.status(earningDetail.status).json({
      success: earningDetail.success,
      message: "Overview has been fetched",
      overviewStats,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withUserAuthorized(handler));
