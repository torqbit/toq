import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { getSiteConfig } from "@/services/getSiteConfig";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const domain = req.headers.host;
    const tenantInfo = await prisma.tenant.findUnique({
      where: {
        domain: req.headers.host || "",
      },
      select: {
        siteConfig: true,
      },
    });

    if (tenantInfo && tenantInfo.siteConfig) {
      return res.status(200).json({ success: true, siteConfig: JSON.parse(tenantInfo.siteConfig) as PageSiteConfig });
    } else {
      return res.status(404).json({ success: false, error: "Site config not found" });
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
