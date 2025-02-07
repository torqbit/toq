import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";

import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import analytics from "@/actions/analytics";
import { APIResponse } from "@/types/apis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    if (typeof courseId !== "undefined") {
      const overviewResponse = await analytics.getOverviewDetailsByProduct(Number(courseId));
      return res.status(overviewResponse.status).json(overviewResponse);
    } else {
      return res.status(404).json(new APIResponse(false, 404, "Product id not found"));
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withUserAuthorized(handler));
