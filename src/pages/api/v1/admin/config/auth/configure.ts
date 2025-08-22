import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import SecretsManager from "@/services/secrets/SecretsManager";
import { AuthConstants } from "@/types/auth/api";
import { getCookieName } from "@/lib/utils";

import { AuthProvider } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
const authConfig = z.object({
  emailPassword: z.boolean(),
  google: z.boolean(),
});

type AUTHConfig = z.infer<typeof authConfig>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await getServerSession(req, res, await authOptions(req));
    let tenantId = String(user?.tenant?.tenantId);
    const secretsStore = SecretsManager.getSecretsProvider();

    const findTenantAuth = await prisma?.tenantAuthConfig.findMany({
      where: {
        tenantId: tenantId,
      },
      select: {
        provider: true,
      },
    });

    let isGoogleConfigured;
    let isCredentialConfigured;
    if (findTenantAuth && findTenantAuth.length > 0) {
      findTenantAuth.forEach((f) => {
        switch (f.provider) {
          case AuthProvider.GOOGLE:
            isGoogleConfigured = true;
            break;
          case AuthProvider.CREDENTIALS:
            isCredentialConfigured = true;
            break;

          default:
            break;
        }
      });
    }

    const body = await req.body;
    const config: AUTHConfig = authConfig.parse(body);

    if (isCredentialConfigured && !config.emailPassword) {
      await prisma?.tenantAuthConfig.delete({
        where: {
          tenantId_provider: {
            tenantId,
            provider: AuthProvider.CREDENTIALS,
          },
        },
      });
    }

    if (!isCredentialConfigured && config.emailPassword) {
      await prisma?.tenantAuthConfig.create({
        data: {
          provider: AuthProvider.CREDENTIALS,
          tenantId,
          isEnabled: config.emailPassword,
        },
      });
    }

    if (isGoogleConfigured && !config.google) {
      await prisma?.tenantAuthConfig.delete({
        where: {
          tenantId_provider: {
            tenantId,
            provider: AuthProvider.GOOGLE,
          },
        },
      });
    }
    if (config.google) {
      if (isGoogleConfigured) {
        await prisma?.tenantAuthConfig.delete({
          where: {
            tenantId_provider: {
              tenantId,
              provider: AuthProvider.GOOGLE,
            },
          },
        });
      }

      secretsStore.put(AuthConstants.googleClientId, process.env.GOOGLE_CLIENT_ID || "", tenantId);
      secretsStore.put(AuthConstants.googleSecretId, process.env.GOOGLE_SECRET_ID || "", tenantId);
      let data = {
        tenantId: tenantId,
        isEnabled: config.google,
        clientId: AuthConstants.googleClientId,
        clientSecret: AuthConstants.googleSecretId,
        provider: AuthProvider.GOOGLE,
      };
      await prisma?.tenantAuthConfig.create({
        data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Auth configuration has been saved",
      body: {
        ...config,
      },
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(handler));
