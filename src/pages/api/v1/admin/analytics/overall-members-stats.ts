import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    const totalMembers = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
    });
    const enrolledMembers = await prisma.courseRegistration.findMany({
      distinct: ["studentId"],
      select: {
        registrationId: true,
      },
      where: {
        order: {
          productId: Number(courseId),
        },
      },
    });
    let weekAgoDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

    const membersActiveInlastWeek = await prisma.courseProgress.findMany({
      distinct: ["studentId"],

      where: {
        courseId: Number(courseId),

        createdAt: {
          gte: weekAgoDate,
        },
      },
    });

    const totalEnrolled = enrolledMembers.length;

    return res.status(200).json({
      info: false,
      success: true,
      message: "members successfully fetched",
      totalMembers: totalMembers.length,
      totalEnrolled,
      activeMembers: membersActiveInlastWeek.length,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
