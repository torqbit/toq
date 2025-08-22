import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { getCookieName } from "@/lib/utils";

import { AuthProvider } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const authConfig = z.object({
  emailPassword: z.boolean(),
  google: z.boolean(),
  googleClientId: z.string().min(2, "client id is required").optional(),
  googleSecretId: z.string().min(2, "client secret is required").optional(),
});

type AUTHConfig = z.infer<typeof authConfig>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await getServerSession(req, res, await authOptions(req));
    let tenantId = String(user?.tenant?.tenantId);
    const tenantAuthConfig = await prisma?.tenantAuthConfig.findMany({
      where: {
        tenantId,
      },
      select: {
        provider: true,
        tenantId: true,
        isEnabled: true,
      },
    });
    if (tenantAuthConfig && tenantAuthConfig.length > 0) {
      let isGoogleEnabled = tenantAuthConfig.find(
        (f) => f.provider == AuthProvider.GOOGLE && f.tenantId == tenantId
      )?.isEnabled;
      let config = {
        emailPassword: tenantAuthConfig.find((f) => f.provider == AuthProvider.CREDENTIALS && f.tenantId == tenantId)
          ?.isEnabled,
        google: isGoogleEnabled,
        googleClientId: isGoogleEnabled ? "******************" : undefined,
        googleSecretId: isGoogleEnabled ? "******************" : undefined,
      };
      return res.status(200).json({ success: true, body: config });
    } else {
      return res.status(404).json({ success: false, error: "No Authentication found" });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
