import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { EmailManagementService } from "@/services/email/EmailManagementService";
import { APIResponse } from "@/types/apis";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { getCookieName } from "@/lib/utils";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const session = await getServerSession(req, res, await authOptions(req));
    const result = await new EmailManagementService().getEmailCredentials(String(session?.tenant?.tenantId));
    return res
      .status(result.status)
      .json(
        new APIResponse(
          result.success,
          result.status,
          "Email credentials has been fetched",
          result.body ? { ...result.body, smtpPassword: "*********************" } : undefined
        )
      );
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
