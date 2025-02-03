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
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const startTime = new Date();
    const intervalId = setInterval(async () => {
      const notifications = token?.id && (await fetchPushNotification(token?.id, startTime));

      if (notifications && notifications.length === 0) {
        return; // No new notifications to send
      } else if (notifications) {
        res.write(JSON.stringify(notifications));
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
