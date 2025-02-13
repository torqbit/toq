import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { compareByHash, convertToDayMonthTime, getCookieName, mapToArray } from "@/lib/utils";
import appConstant from "@/services/appConstant";
import { submissionStatus } from "@prisma/client";
import { IAssignmentSubmissionConfig } from "@/lib/emailConfig";
import EmailManagementService from "@/services/cms/email/EmailManagementService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const body = req.body;
    const { assignmentId, lessonId, content } = body;

    const latestSubmission = await prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId: Number(assignmentId),
        lessonId: Number(lessonId),
        studentId: String(token?.id),
        NOT: {
          status: submissionStatus.NOT_SUBMITTED,
        },
      },
      select: {
        content: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const previousMap =
      latestSubmission && new Map<string, string>(Object.entries(JSON.parse(String(latestSubmission?.content))));
    const currentMap = latestSubmission && new Map<string, string>(Object.entries(JSON.parse(String(content))));

    const isSameContent =
      latestSubmission && previousMap && currentMap && compareByHash(mapToArray(previousMap), mapToArray(currentMap));

    if (isSameContent) {
      return res.status(400).json({ success: false, error: "You have already submitted this code " });
    } else {
      const totalSubmissions = await prisma.assignmentSubmission.count({
        where: {
          studentId: String(token?.id),
          assignmentId: assignmentId,
          NOT: {
            status: submissionStatus.NOT_SUBMITTED,
          },
        },
      });

      if (totalSubmissions < appConstant.assignmentSubmissionLimit) {
        const savedSubmission = await prisma.assignmentSubmission.findFirst({
          where: {
            assignmentId: Number(assignmentId),
            lessonId: Number(lessonId),
            studentId: String(token?.id),
            status: submissionStatus.NOT_SUBMITTED,
          },
          select: {
            id: true,
          },
        });

        const submissionDetail = await prisma.assignmentSubmission.create({
          data: {
            studentId: String(token?.id),
            assignmentId,
            lessonId,
            content,
            updatedAt: new Date(),
            status: submissionStatus.PENDING,
          },
          select: {
            content: true,
            createdAt: true,
            id: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
            assignment: {
              select: {
                lesson: {
                  select: {
                    name: true,
                    chapter: {
                      select: {
                        course: {
                          select: {
                            user: {
                              select: {
                                name: true,
                                email: true,
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

        if (submissionDetail) {
          let authorName = submissionDetail.assignment.lesson.chapter.course.user.name;
          let authorEmail = submissionDetail.assignment.lesson.chapter.course.user.email;
          let assignmentName = submissionDetail.assignment.lesson.name;

          let config: IAssignmentSubmissionConfig = {
            studentName: String(submissionDetail.user.name),
            url: `${process.env.NEXTAUTH_URL}admin/content/submission/${submissionDetail.id}/evaluate`,
            submissionDate: convertToDayMonthTime(new Date(submissionDetail.createdAt)),
            authorEmail: String(authorEmail),
            authorName: String(authorName),
            assignmentName: String(assignmentName),
            submissionCount: totalSubmissions,
          };

          const ms = await EmailManagementService.getMailerService();

          ms &&
            ms.sendMail("ASSIGNMENT_SUBMISSION", config).then(async (result) => {
              console.log(result.error);
            });
        }

        if (savedSubmission) {
          await prisma.assignmentSubmission.updateMany({
            where: {
              assignmentId: Number(assignmentId),
              lessonId: Number(lessonId),
              studentId: String(token?.id),
              status: submissionStatus.NOT_SUBMITTED,
            },
            data: {
              content: content,
            },
          });
        } else {
          await prisma.assignmentSubmission.create({
            data: {
              studentId: String(token?.id),
              assignmentId,
              lessonId,
              content,
              updatedAt: new Date(),
            },
          });
        }

        return res.status(200).json({
          success: true,
          message: "Assignment has been submitted",
          codeDetail: submissionDetail.content,
          totalSubmissions: totalSubmissions + 1,
        });
      } else {
        return res.status(400).json({
          success: true,
          error: "You have crossed the submission limit",

          totalSubmissions: totalSubmissions,
        });
      }
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
