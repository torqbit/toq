import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { APIResponse } from "@/types/apis";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const reqSchema = z.object({
  conversationId: z.string().min(5),
  sessionId: z.string().optional(),
});

const getConversationList = async (conversationId: string, sessionId: string, tenantId: string) => {
  // fetch the conversation based on the sessionId
  const findAiConversation = await prisma.assistantConversation.findMany({
    select: {
      messages: {
        select: {
          content: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    where: {
      sessionId: sessionId,
      tenantId: tenantId,
      id: conversationId,
    },
  });

  let resData = findAiConversation.length > 0 ? findAiConversation.map((m) => m.messages).flat() : [];
  return resData.length > 0
    ? resData.map((m) => {
        return {
          content: m.content,
          userType: m.role,
          createdAt: m.createdAt,
        };
      })
    : [];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { conversationId, sessionId } = reqSchema.parse(req.body);
    const findTenant = await prisma.tenant.findUnique({
      select: {
        id: true,
      },
      where: {
        domain: req.headers.host || "",
      },
    });
    const session = await getServerSession(req, res, await authOptions(req));

    if (session?.id && session.tenant?.tenantId) {
      // fetch the conversation based on the sessionId
      const resData = await getConversationList(conversationId, session?.id, String(session?.tenant?.tenantId));
      return res.status(200).json(new APIResponse(true, 200, "Successfully retrieved conversation", resData));
    } else if (sessionId) {
      // fetch the conversation based on the userId
      const resData = await getConversationList(conversationId, sessionId, String(findTenant?.id));

      return res.status(200).json(new APIResponse(true, 200, "Successfully retrieved conversation", resData));
    } else {
      return res.status(400).json(new APIResponse(false, 400, "Invalid session ID/ conversation ID", null));
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);
