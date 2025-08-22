import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

export function withUserAuthorized(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, await authOptions(req));

      if (!session || !(session.role == "ADMIN" || session.role == "AUTHOR")) {
        return res.status(401).json({ success: false, error: " You are not authorized" });
      }
      return handler(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };
}
