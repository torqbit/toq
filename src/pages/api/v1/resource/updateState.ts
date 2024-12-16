import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import MailerService from "@/services/MailerService";
import { CourseState } from "@prisma/client";
import { INewLessonConfig } from "@/lib/emailConfig";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { resourceId, state, notifyStudent } = req.body;

    const findResource = await prisma.resource.findUnique({
      where: {
        resourceId: Number(resourceId),
      },
      select: {
        state: true,
        name: true,
        description: true,
        video: {
          select: {
            thumbnail: true,
          },
        },
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
      select: {
        course: {
          select: {
            courseId: true,
            totalResources: true,
            name: true,
            slug: true,
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

    // send mail
    if (notifyStudent && courseDetails) {
      const findEnrolledUsers = await prisma.courseRegistration.findMany({
        where: {
          courseId: courseDetails.course.courseId,
          courseState: CourseState.ENROLLED,
        },
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (findEnrolledUsers.length > 0) {
        let configArray = findEnrolledUsers.map((user): INewLessonConfig => {
          return {
            courseName: courseDetails.course.name,
            lessonName: String(findResource?.name),
            email: String(user.user.email),
            name: String(user.user.name),
            url: `${process.env.NEXTAUTH_URL}/courses/${courseDetails.course.slug}/lesson/${resourceId}`,
            thumbnail: String(findResource?.video?.thumbnail),
            lessonDesription: String(findResource?.description),
          };
        });

        const onComplete = async () => {
          await prisma.resource.update({
            where: { resourceId: Number(resourceId) },
            data: { isStudentNotified: true },
          });
        };

        MailerService.sendMultipleMails("NEW_LESSON", configArray, onComplete)
          .then((result) => {
            console.log("send lesson notification result:", result);
          })
          .catch((error) => {
            console.log("send lesson notification error:", error);
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
