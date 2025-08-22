import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import analytics from "@/actions/analytics";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, await authOptions(req));

    const overviewResponse = await analytics.getOverviewDetails(String(session?.tenant?.tenantId));
    return res.status(overviewResponse.status).json(overviewResponse);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
