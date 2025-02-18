import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCurrency } from "@/actions/getCurrency";
import { gatewayProvider } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    const course = await prisma.course.findUnique({
      where: {
        courseId: Number(courseId),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        chapters: {
          where: {
            courseId: Number(courseId),
          },
          include: {
            resource: {
              orderBy: {
                sequenceId: "asc",
              },
              include: {
                video: {},
                assignment: {},
              },
            },
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetched course",
      courseDetails: course,
      currency: await getCurrency(gatewayProvider.CASHFREE),
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
