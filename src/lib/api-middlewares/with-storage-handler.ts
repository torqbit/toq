import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";
import { PlanUsageType, TenantRole } from "@prisma/client";
import { APIResponse } from "@/types/apis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export function withStorageHandler(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const user = await getServerSession(req, res, await authOptions(req));

    if (!user || user.tenant?.role !== TenantRole.OWNER) {
      return res.status(403).end();
    }

    const usageDetail = await prisma?.planUsage.findFirst({
      where: {
        subscriptionId: user.tenant?.subscription?.id,
        tenantId: user.tenant?.tenantId,
        usageType: PlanUsageType.STORAGE,
      },
      select: {
        used: true,
        allowed: true,
      },
    });

    if (usageDetail && Number(usageDetail?.used) + req.body.fileSize > Number(usageDetail?.allowed)) {
      return res.status(403).json(new APIResponse(false, 403, "You’ve reached your storage limit"));
    }

    return handler(req, res);
  };
}
