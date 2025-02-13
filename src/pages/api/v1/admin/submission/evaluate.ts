import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { convertToDayMonthTime, getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { ResourceContentType, Role, submissionStatus } from "@prisma/client";
import getUserRole from "@/actions/getRole";
import appConstant from "@/services/appConstant";
import updateCourseProgress from "@/actions/updateCourseProgress";
import { IAssignmentCompletionConfig } from "@/lib/emailConfig";
import EmailManagementService from "@/services/cms/email/EmailManagementService";
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const body = req.body;
    const { assignmentId, submissionId, score, comment } = body;

    const userRole = await getUserRole(assignmentId, token?.role, String(token?.id));

    if (userRole === Role.AUTHOR || userRole === Role.MENTOR) {
      const evaluationDetail = await prisma.assignmentEvaluation.create({
        data: {
          ...body,
          authorId: String(token?.id),
        },
        select: {
          score: true,
          submission: {
            select: {
              id: true,
              createdAt: true,
              studentId: true,
              assignment: {
                select: {
                  lesson: {
                    select: {
                      resourceId: true,
                      name: true,
                      chapter: {
                        select: {
                          courseId: true,
                          course: {
                            select: {
                              slug: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      let courseId = evaluationDetail.submission.assignment.lesson.chapter.courseId;
      let courseSlug = evaluationDetail.submission.assignment.lesson.chapter.course.slug;

      let lessonId = evaluationDetail.submission.assignment.lesson.resourceId;
      let studentId = evaluationDetail.submission.studentId;

      await prisma.assignmentSubmission.update({
        where: {
          id: evaluationDetail.submission.id,
        },
        data: {
          status:
            evaluationDetail.score >= appConstant.assignmentPassingMarks
              ? submissionStatus.PASSED
              : submissionStatus.FAILED,
        },
      });
      const findTotalLessons = await prisma.course.findUnique({
        where: {
          courseId: courseId,
        },
        select: {
          totalResources: true,
        },
      });

      const findTotalWatched = await prisma.courseProgress.count({
        where: {
          courseId: courseId,
          studentId: studentId,
        },
      });
      const submissionAttempt = await prisma.assignmentSubmission.findMany({
        where: {
          lessonId: lessonId,
          assignmentId: assignmentId,
          studentId: studentId,
          NOT: {
            status: submissionStatus.NOT_SUBMITTED,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (
        evaluationDetail.score >= appConstant.assignmentPassingMarks ||
        submissionAttempt.filter((f) => f.status === submissionStatus.FAILED).length === 3
      ) {
        // await updateCourseProgress(
        //   Number(courseId),
        //   Number(lessonId),
        //   String(studentId),
        //   ResourceContentType.Assignment,
        //   findTotalLessons?.totalResources,
        //   findTotalWatched
        // );
      }

      const userDetail = await prisma.user.findUnique({
        where: {
          id: studentId,
        },
        select: {
          name: true,
          email: true,
        },
      });
      const configData: IAssignmentCompletionConfig = {
        name: String(userDetail?.name),
        email: String(userDetail?.email),
        assignmentName: evaluationDetail.submission.assignment.lesson.name,
        score: evaluationDetail.score,
        submissionDate: convertToDayMonthTime(new Date(evaluationDetail.submission.createdAt)),
        url: `${process.env.NEXTAUTH_URL}/courses/${courseSlug}/lesson/${lessonId}?tab=submission&segment=evaluations`,
      };
      const ms = await EmailManagementService.getMailerService();

      ms &&
        ms.sendMail("ASSIGNMENT_COMPLETION", configData).then((result) => {
          console.log(result.error);
        });
      return res.status(200).json({ success: true, message: "Evaluation has been completed", evaluationDetail });
    } else {
      return res.status(403).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
