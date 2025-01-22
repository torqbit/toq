import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { pathId } = req.query;
    const detail = await prisma.learningPath.findUnique({
      where: {
        id: Number(pathId),
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
      statusCode: 200,
      message: "Learning path detail has been fetched",
      learningPathDetail: detail,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
