import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { Role } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const { blogId, state } = req.body;

    const blogAuthor = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        authorId: true,
      },
    });

    const authorId = token?.id;

    if (authorId === blogAuthor?.authorId || token?.role === Role.ADMIN) {
      await prisma.blog.update({
        where: {
          authorId: blogAuthor?.authorId,
          id: blogId,
        },
        data: {
          state,
        },
      });
      return res.status(200).json({
        info: false,
        success: true,
        message: `State has been updated`,
      });
    } else {
      return res.status(403).json({
        info: false,
        success: false,
        error: `You are not authorized`,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
