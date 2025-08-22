import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { APIResponse } from "@/types/apis";
import prisma from "@/lib/prisma";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * List all the agents for the tenant
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { agentId } = req.query;
    const session = await getServerSession(req, res, await authOptions(req));

    const agents = await prisma.aiAgent.findUnique({
      select: {
        model: true,
        name: true,
        agentPrompt: true,
        temperature: true,
        id: true,
      },
      where: {
        tenantId: session?.tenant?.tenantId,
        id: String(agentId),
      },
    });

    return res.status(200).json(
      new APIResponse(true, 200, "Agent fetched successfully.", {
        ...agents,
        embedPath: process.env.EMBED_SCRIPT_PATH,
      })
    );
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
