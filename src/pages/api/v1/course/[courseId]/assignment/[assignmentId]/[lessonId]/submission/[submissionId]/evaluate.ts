import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

import { submissionStatus } from "@prisma/client";
import {
  AssignmentType,
  IAssignmentDetails,
  MCQAssignment,
  MCQASubmissionContent,
  SelectedAnswersType,
} from "@/types/courses/assignment";
import { AssignmentEvaluationService } from "@/services/lesson/AssignmentEvaluateService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const { submissionId, lessonId } = req.query;

    const savedSubmission = await prisma.assignmentSubmission.update({
      where: {
        id: Number(submissionId),
      },
      select: {
        content: true,
      },
      data: {
        status: "COMPLETED",
      },
    });

    const assignmentDetail = await prisma?.assignment.findUnique({
      where: {
        lessonId: Number(lessonId),
      },
      select: {
        content: true,
        maximumPoints: true,
        passingScore: true,
      },
    });

    const assignmentData = assignmentDetail?.content as unknown as IAssignmentDetails;

    if (assignmentData._type === AssignmentType.MCQ) {
      const savedSubmissionData = savedSubmission?.content as unknown as MCQASubmissionContent;
      const { totalScore, isPassed, passingScore, totalMarks, eachQuestionScore } =
        new AssignmentEvaluationService().evaluateMCQAssignment(
          savedSubmissionData?.selectedAnswers as any,
          assignmentDetail?.maximumPoints as number,
          assignmentDetail?.passingScore as number,
          assignmentDetail?.content as unknown as MCQAssignment
        );

      await prisma.assignmentSubmission.update({
        where: {
          id: Number(submissionId),
        },
        select: {
          content: true,
        },
        data: {
          status: isPassed ? submissionStatus.PASSED : submissionStatus.FAILED,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Submission completed",
      });
    } else {
      return res.status(200).json({ success: false, message: "Assignment evaluation completed" });
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
