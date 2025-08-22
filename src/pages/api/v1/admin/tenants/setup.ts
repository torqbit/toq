import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";

import { TenantProvisioner } from "@/services/tenant/TenantProvisioner";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { createAdminTenant } from "@/services/server/admin/createAdminTenant";
import * as z from "zod";
import withValidation from "@/lib/api-middlewares/with-validation";
import ContentAI from "@/services/server/ai/ContentAI";

import { updateSiteConfiguration } from "@/actions/updateSiteConfigurationForTenant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { createSlug } from "@/lib/utils";
import { APIResponse } from "@/types/apis";
import appConstant from "@/services/appConstant";
import { validateDomain } from "@/services/server/common/validateDomain";

export const validateReqBody = z.object({
  domain: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, await authOptions(req));

    const body = await req.body;
    const reqBody = validateReqBody.parse(body);

    const domainHost = new URL(reqBody.domain);
    const validateDomainResponse = await validateDomain(domainHost.host);
    if (!validateDomainResponse.success) {
      return res
        .status(validateDomainResponse.status)
        .json({ success: validateDomainResponse.success, message: validateDomainResponse.message });
    }

    const tenantProvisioner = new TenantProvisioner(String(session?.id));
    const adminTenant = await createAdminTenant();
    const webPageContent = await ContentAI.getWebpageContent(domainHost.host);

    const tenantDetails = await ContentAI.extractWithAI(
      domainHost.host,
      webPageContent.links,
      webPageContent.content,
      webPageContent.brandColor,
      webPageContent.theme
    );

    // //get the tenant details based on the sub domain from the result.body

    if (tenantDetails) {
      const result = await tenantProvisioner.provision(
        createSlug(String(tenantDetails.name)),
        tenantDetails.brandColor,
        tenantDetails.title || "Untitled",
        session?.email as string,
        session?.name as string,
        adminTenant
      );

      if (result.success && result.body) {
        await updateSiteConfiguration(tenantDetails, result.body.tenantId, `https://${domainHost.host}`);

        const adminTenant = await createAdminTenant();

        const existingAccount = await prisma.account.findFirst({
          where: {
            tenantId: adminTenant,
            userId: session?.id,
          },
        });

        const agentName = tenantDetails.name || "My";

        //create the agent
        await prisma.aiAgent.create({
          data: {
            name: `${agentName} AI assistant`,
            model: appConstant.TextToTextModel,
            temperature: appConstant.defaultAgentTemperature,
            agentPrompt: tenantDetails.systemPrompt,
            tenantId: result.body.tenantId,
          },
        });
        await notifySubscriptionStatus(String(result.body.tenantId), String(session?.id));

        if (existingAccount) {
          await prisma.account.create({
            data: {
              userId: session?.id || "",
              type: existingAccount.type,
              provider: existingAccount.provider,
              password: existingAccount.password,
              providerAccountId: existingAccount.providerAccountId,
              tenantId: result.body.tenantId,
              refresh_token: existingAccount.refresh_token,
              access_token: existingAccount.access_token,
              expires_at: existingAccount.expires_at,
              token_type: existingAccount.token_type,
              scope: existingAccount.scope,
              id_token: existingAccount.id_token,
              session_state: existingAccount.session_state,
              oauth_token_secret: existingAccount.oauth_token_secret,
              oauth_token: existingAccount.oauth_token,
            },
          });
        }

        return res.status(200).json({ success: true, message: "", destination: `/login/sso` });
      } else {
        return res.status(result.status).json({ success: result.success, message: result.message });
      }
    } else {
      return res.status(400).json({ success: false, message: "Unbale to fetch the company detail" });
    }
  } catch (error: any) {
    console.log(error);
    errorHandler(new APIResponse(false, 400, error.message), res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withAuthentication(handler)));
