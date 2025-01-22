import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { Role, StateType } from "@prisma/client";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    if (token?.role == Role.ADMIN) {
      const learningPathList = await prisma.learningPath.findMany({
        select: {
          title: true,
          description: true,
          state: true,
          banner: true,
          author: {
            select: {
              name: true,
            },
          },
          learningPathCourses: {
            select: {
              courseId: true,
            },
          },
        },
      });
      return res.status(200).json({
        success: true,
        message: "Learing path list has been fetched",
        learningPathList,
      });
    } else {
      const learningPathList = await prisma.learningPath.findMany({
        where: {
          state: StateType.ACTIVE,
        },
        select: {
          title: true,
          description: true,
          state: true,
          banner: true,
          author: {
            select: {
              name: true,
            },
          },
          learningPathCourses: {
            select: {
              courseId: true,
            },
          },
        },
      });
      return res.status(200).json({
        success: true,
        message: "Learing path list has been fetched",
        learningPathList,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
