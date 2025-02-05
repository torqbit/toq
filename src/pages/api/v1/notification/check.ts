import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

export const getCheckNewOne = async (userId: string) => {
  return await prisma.notification.findMany({
    where: {
      toUserId: userId,
      isView: false,
    },
    select: {
      id: true,
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const notifications = token?.id && (await getCheckNewOne(token?.id));

    return res.status(200).json({
      success: true,
      isNew: notifications && notifications.length > 0 ? true : false,
      length: notifications && notifications.length,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
