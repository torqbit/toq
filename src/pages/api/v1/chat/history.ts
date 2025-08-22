import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { APIResponse } from "@/types/apis";
import { MessageUserType } from "@prisma/client";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";

const getChatHistory = async (userId: string, tenantId: string, limit: number = 5) => {
  const chatHistory = await prisma.assistantConversation.findMany({
    where: {
      sessionId: userId,
      tenantId,
      messages: {
        some: {
          role: {
            in: [MessageUserType.USER, MessageUserType.VISITOR],
          },
        },
      },
    },
    select: {
      id: true,
      updatedAt: true,
      messages: {
        where: {
          role: {
            in: [MessageUserType.USER, MessageUserType.VISITOR],
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          content: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
  });
  return chatHistory;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { limit } = req.query;

    const session = await getServerSession(req, res, await authOptions(req));

    if (session?.id && session.tenant?.tenantId) {
      // fetch the conversation based on the sessionId
      const resData = await getChatHistory(session?.id, String(session?.tenant?.tenantId), Number(limit));
      return res.status(200).json(
        new APIResponse(
          true,
          200,
          "Successfully retrieved conversation",
          resData.filter((r) => r.messages.length > 0)
        )
      );
    } else {
      return res.status(400).json(new APIResponse(false, 400, "User is not in session", []));
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
