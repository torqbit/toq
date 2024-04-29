import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { resourceId, state } = req.body;
    const findResource = await prisma.resource.findUnique({
      where: {
        resourceId: Number(resourceId),
      },
      include: {
        chapter: {
          select: {
            state: true,
          },
        },
      },
    });

    const updateState = await prisma.resource.update({
      where: {
        resourceId: Number(resourceId),
      },
      data: {
        state: state,
      },
    });
    const courseDetails = await prisma.chapter.findFirst({
      where: {
        chapterId: updateState.chapterId,
      },
      include: {
        course: {
          select: {
            courseId: true,
            totalResources: true,
          },
        },
      },
    });
    if (findResource?.chapter.state === "ACTIVE") {
      if (findResource && courseDetails && findResource.state === "DRAFT" && findResource.state !== state) {
        const updateCourse = await prisma.course.update({
          where: {
            courseId: courseDetails.course.courseId,
          },
          data: {
            totalResources: courseDetails.course.totalResources + 1,
          },
        });
      }
      if (findResource && courseDetails && findResource.state === "ACTIVE" && findResource.state !== state) {
        const updateCourse = await prisma.course.update({
          where: {
            courseId: courseDetails.course.courseId,
          },
          data: {
            totalResources: courseDetails.course.totalResources - 1,
          },
        });
      }
    }

    return res.status(200).json({
      info: false,
      success: true,
      message: "State updated",
      programs: updateState,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
