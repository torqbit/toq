import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { StateType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { chapterId, state } = req.body;
    const findChapter = await prisma.chapter.findUnique({
      where: {
        chapterId: Number(chapterId),
      },
      select: {
        state: true,
      },
    });

    const updateState = await prisma.chapter.update({
      where: {
        chapterId: Number(chapterId),
      },
      data: {
        state: state,
      },
    });
    const courseDetails = await prisma.chapter.findFirst({
      where: {
        chapterId: Number(chapterId),
      },
      include: {
        course: {
          select: {
            courseId: true,
            totalResources: true,
          },
        },
        resource: {
          where: {
            state: "ACTIVE",
          },
        },
      },
    });
    if (courseDetails && state !== findChapter?.state && findChapter?.state === "DRAFT") {
      const updateCourse = await prisma.course.update({
        where: {
          courseId: courseDetails.course.courseId,
        },
        data: {
          totalResources: courseDetails.course.totalResources + courseDetails.resource.length,
        },
      });
    }
    if (courseDetails && state !== findChapter?.state && findChapter?.state === "ACTIVE") {
      const updateCourse = await prisma.course.update({
        where: {
          courseId: courseDetails.course.courseId,
        },
        data: {
          totalResources: courseDetails.course.totalResources - courseDetails.resource.length,
        },
      });
    }
    return res.status(200).json({
      info: false,
      success: true,
      message: state == StateType.ACTIVE ? "Chapter has been published" : "Chapter has been moved to draft",
      programs: updateState,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
