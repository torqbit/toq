import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

export const getNotifi = async (userId: string, limit: number, offSet: number) => {
  return await prisma.notification.findMany({
    where: {
      toUserId: userId,
      NOT: {
        fromUserId: userId,
      },
    },
    include: {
      comment: {
        select: {
          comment: true,
          resourceId: true,
          parentCommentId: true,
        },
      },
      resource: {
        include: {
          chapter: {
            select: {
              courseId: true,
              course: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
      },

      tagComment: {
        select: {
          comment: true,
          resource: {
            select: {
              resourceId: true,
              chapter: {
                select: {
                  courseId: true,
                  chapterId: true,
                  course: {
                    select: {
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      fromUser: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offSet,
    take: limit,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const { offSet, limit } = req.query;

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const notifications = token?.id && (await getNotifi(token?.id, Number(limit), Number(offSet)));

    if (notifications && notifications.length > 0) {
      const notificationsCount = await prisma.notification.count({
        where: {
          toUserId: token.id,
          NOT: {
            fromUserId: token.id,
          },
        },
      });
      return res.status(200).json({ success: true, notifications, notificationsCount });
    } else {
      res.status(400).json({ success: false, error: "No notifications" });
    }
  } catch (err) {
    console.log(err);
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
