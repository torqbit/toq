import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { getCookieName } from "@/lib/utils";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PageSiteConfig } from "@/services/siteConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { config } = req.body;
    const session = await getServerSession(req, res, await authOptions(req));

    await prisma?.tenant.update({
      where: {
        id: String(session?.tenant?.tenantId),
      },
      data: {
        siteConfig: JSON.stringify({ ...config, updated: true }),
        updatedAt: new Date(),
      },
    });
    return res.status(200).json({ success: true, message: " Design has been updated", basicInfo: req.body });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(handler));
