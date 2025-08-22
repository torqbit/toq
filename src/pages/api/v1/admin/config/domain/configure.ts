import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
import { getCookieName } from "@/lib/utils";

import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { CertificateManager } from "@/services/server/admin/CertificateManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Request body schema
const configureCustomDomainSchema = z.object({
  customDomain: z
    .string()
    .min(1, "Custom domain is required")
    .regex(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, "Invalid domain format"),
  targetDomain: z
    .string()
    .min(1, "Target domain is required")
    .regex(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, "Invalid domain format"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

type ConfigureCustomDomainRequest = z.infer<typeof configureCustomDomainSchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    let response: APIResponse<any>;
    let cookieName = getCookieName();

    const session = await getServerSession(req, res, await authOptions(req));

    if (session && session.tenant?.tenantId) {
      // Validate request body
      const config: ConfigureCustomDomainRequest = configureCustomDomainSchema.parse(body);

      // Initialize certificate manager
      const certManager = new CertificateManager();

      // Generate certificate
      const result = await certManager.generateCustomDomainCertificate(
        config.customDomain,
        config.targetDomain,
        config.email
      );

      if (result) {
        // update the tenant table with the custom domain and certificate details
        await prisma.tenant.update({
          where: {
            id: session.tenant.tenantId,
          },
          data: {
            customDomain: config.customDomain,
            certificateGenerated: true,
          },
        });
        response = new APIResponse(true, 200, "Certificate generated and configured successfully", {
          domain: config.customDomain,
        });
      } else {
        response = new APIResponse(false, 500, "Failed to generate certificate");
      }
      return res.status(response.status).json(response);
    }

    return res.status(401).json(new APIResponse(false, 401, "Unauthorized"));
  } catch (error) {
    console.error("Certificate generation error:", error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(handler));
