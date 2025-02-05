import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getToken } from "next-auth/jwt";

import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const { tagCommentId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const userId = token?.id;
    await prisma.notification.updateMany({
      where: {
        toUserId: userId,
        tagCommentId: Number(tagCommentId),
        isView: false,
      },
      data: {
        isView: true,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
