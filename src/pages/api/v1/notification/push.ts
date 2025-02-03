import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

export const fetchPushNotification = async (userId: string, createTime: Date) => {
  return await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    where: {
      toUserId: userId,
      isView: false,
      createdAt: {
        gt: createTime,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      notificationType: true,
    },
  });
};

/**
 * Fetch the latest push notification after this request has been created
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });
    // Send an initial event to trigger onopen
    res.write("event: open\ndata: connected\n\n");

    // Function to send events
    const sendEvent = (data: any) => {
      startTime = new Date();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    let startTime = new Date();
    const intervalId = setInterval(async () => {
      const notifications = token?.id && (await fetchPushNotification(token?.id, startTime));
      if (notifications && notifications.length > 0) {
        sendEvent(notifications[0]);
      }
    }, 3000);

    req.on("close", () => {
      clearInterval(intervalId);
      res.end();
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
