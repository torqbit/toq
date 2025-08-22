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
    const session = await getServerSession(req, res, await authOptions(req));

    const agents = await prisma.aiAgent.findMany({
      where: {
        tenantId: session?.tenant?.tenantId,
      },
      include: {
        tenant: {
          select: {
            _count: {
              select: {
                assistantConversations: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(
      new APIResponse(
        true,
        200,
        "Agents fetched successfully.",
        agents.map((a) => {
          return { ...a, conversations: a.tenant._count.assistantConversations };
        })
      )
    );
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
