import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { planType, TenantRole } from "@prisma/client";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

export function withTenantOwnerAuthorized(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, await authOptions(req));

      if (!session || !(session.tenant?.role === TenantRole.OWNER)) {
        return res.status(401).json({ success: false, error: " You are not authorized" });
      } else if (session && session.tenant?.role === TenantRole.OWNER) {
        if (session.subscription && new Date(String(session.subscription.endDate)).getTime() < new Date().getTime()) {
          return res.status(301).redirect("/upgrade-plan").json({ success: false, error: "Your plan has ended" });
        }
      }

      return handler(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };
}
