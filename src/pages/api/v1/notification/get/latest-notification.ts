import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const countUnreadNotifications = await prisma.notification.count({
      where: {
        toUserId: token?.id,
        isView: false,
        NOT: {
          fromUserId: token?.id,
        },
      },
    });

    if (countUnreadNotifications && countUnreadNotifications > 0) {
      return res.status(200).json({ success: true, countUnreadNotifications });
    } else {
      res.status(200).json({ success: true, countUnreadNotifications: 0 });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
