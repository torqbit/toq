import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { emailCredentials } from "@/types/cms/email";
import { EmailManagementService } from "@/services/email/EmailManagementService";
import { getCookieName } from "@/lib/utils";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const session = await getServerSession(req, res, await authOptions(req));
    const body = await req.body;
    const accessConfig = emailCredentials.parse(body);
    const result = await new EmailManagementService().verifyEmailCredentialsAndSave(
      accessConfig,
      session?.name as string,
      session?.email as string,
      String(session?.tenant?.tenantId)
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(handler));
