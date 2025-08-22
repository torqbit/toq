import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
import { PageSiteConfig } from "@/services/siteConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    const { agentId } = req.query;
    const agentDetail = await prisma.aiAgent.findUnique({
      where: {
        id: String(agentId),
      },
      select: {
        name: true,
        tenant: {
          select: {
            domain: true,
            siteConfig: true,
          },
        },
      },
    });
    if (agentDetail) {
      const site = JSON.parse(`${agentDetail.tenant?.siteConfig}`) as PageSiteConfig;

      let dataUrl = `http://${agentDetail.tenant.domain}/chat/embed?embed=true`;
      if (process.env.NODE_ENV == "production") {
        dataUrl = `https://${agentDetail.tenant.domain}/chat/embed?embed=true`;
      } else {
      }
      return res.status(200).json(
        new APIResponse(true, 200, "domain fetched successfully", {
          dataUrl,
          brand: site.brand,
          agentName: agentDetail.name,
        })
      );
    } else {
      return res.status(404).json(new APIResponse(false, 404, "Unable to find the tenant"));
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default handler;
