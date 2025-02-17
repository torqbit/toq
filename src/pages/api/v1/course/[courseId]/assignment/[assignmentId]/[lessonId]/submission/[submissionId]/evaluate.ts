import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import * as z from "zod";

import { ResourceContentType, submissionStatus } from "@prisma/client";
import {
  AssignmentType,
  IAssignmentDetails,
  MCQAssignment,
  MCQASubmissionContent,
  SubjectiveAssignment,
} from "@/types/courses/assignment";
import AssignmentEvaluationService, { EvaluationResult } from "@/services/lesson/AssignmentEvaluateService";
import { APIResponse } from "@/types/apis";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";
import updateCourseProgress from "@/actions/updateCourseProgress";
import withValidation from "@/lib/api-middlewares/with-validation";

export const validateReqQuery = z.object({
  assignmentId: z.coerce.number(),
  lessonId: z.coerce.number(),
  submissionId: z.coerce.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const { submissionId, lessonId, assignmentId } = validateReqQuery.parse(req.query);
    const { comment, score } = req.body;
    const savedSubmission = await prisma.assignmentSubmission.update({
      where: {
        id: submissionId,
      },
      select: {
        content: true,
        user: {
          select: {
            id: true,
            role: true,
          },
        },
        assignment: {
          select: {
            lesson: {
              select: {
                chapter: {
                  select: {
                    courseId: true,
                  },
                },
              },
            },
          },
        },
      },
      data: {
        status: submissionStatus.COMPLETED,
      },
    });

    const assignmentDetail = await prisma?.assignment.findUnique({
      where: {
        lessonId: lessonId,
      },
      select: {
        content: true,
        maximumPoints: true,
        passingScore: true,
      },
    });

    const assignmentData = assignmentDetail?.content as unknown as IAssignmentDetails;
    const courseId = savedSubmission.assignment.lesson.chapter.courseId;

    let evaluatedData: EvaluationResult;

    const hasAccess = await getCourseAccessRole(savedSubmission.user.role, savedSubmission.user.id, courseId);

    let pId = hasAccess.productId;
    const cr = await prisma.courseRegistration.findFirst({
      where: {
        studentId: token?.id,
        order: {
          productId: pId,
        },
      },
      select: {
        registrationId: true,
        user: {
          select: {
            name: true,
          },
        },
        certificate: {
          select: {
            productId: true,
            id: true,
          },
        },
      },
    });
    const isExist = cr?.certificate.find((c) => c.productId === courseId);

    if (assignmentData._type === AssignmentType.MCQ) {
      const savedSubmissionData = savedSubmission?.content as unknown as MCQASubmissionContent;
      evaluatedData = AssignmentEvaluationService.evaluateMCQAssignment(
        savedSubmissionData?.selectedAnswers as any,
        assignmentDetail?.maximumPoints as number,
        assignmentDetail?.passingScore as number,
        assignmentDetail?.content as unknown as MCQAssignment
      );
    } else if (assignmentData._type === AssignmentType.SUBJECTIVE) {
      evaluatedData = AssignmentEvaluationService.evaluateSubjectiveAssignment(
        Number(score),
        assignmentDetail?.maximumPoints as number,
        assignmentDetail?.passingScore as number,
        comment as string
      );
    } else {
      return res.status(404).json(new APIResponse(false, 404, "Evaluation not submitted"));
    }

    if (evaluatedData.maximumScore) {
      await prisma.$transaction([
        prisma.assignmentSubmission.update({
          where: {
            id: submissionId,
          },
          data: {
            status: evaluatedData.isPassed ? submissionStatus.PASSED : submissionStatus.FAILED,
          },
        }),
        prisma.assignmentEvaluation.create({
          data: {
            assignmentId: assignmentId,
            submissionId: submissionId,
            authorId: String(token?.id),
            score: evaluatedData.score,
            passingScore: evaluatedData.passingScore,
            maximumScore: evaluatedData.maximumScore,
            scoreSummary: {
              _type: assignmentData._type,
              eachQuestionScore: evaluatedData.eachQuestionScore,
            },
            comment: evaluatedData.comment,
          },
        }),
      ]);

      await updateCourseProgress(
        courseId,
        lessonId,
        String(token?.id),
        ResourceContentType.Assignment,
        cr?.registrationId,
        typeof isExist !== "undefined",

        hasAccess.isLearningPath ? hasAccess.productId : undefined
      );
    } else {
      return res.status(404).json(new APIResponse(false, 404, "Evaluation not submitted"));
    }
    return res.status(200).json(new APIResponse(true, 200, "Evaluation has been completed"));
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withValidation(validateReqQuery, handler, true)));
