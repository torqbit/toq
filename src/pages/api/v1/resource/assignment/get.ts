import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { IAssignmentDetail } from "@/types/courses/Course";
import { AssignmentType, IAssignmentDetails, IEvaluationResult, MCQAssignment } from "@/types/courses/assignment";
import { APIResponse } from "@/types/apis";
import { submissionStatus } from "@prisma/client";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import withValidation from "@/lib/api-middlewares/with-validation";

export const validateReqQuery = z.object({
  lessonId: z.coerce.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { lessonId } = validateReqQuery.parse(query);
    let cookieName = getCookieName();

    const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

    const assignmentDetail = await prisma?.assignment.findUnique({
      where: {
        lessonId: lessonId,
      },
      select: {
        content: true,
        estimatedDuration: true,
        submissionConfig: true,
        maximumPoints: true,
        passingScore: true,
        id: true,
        submission: {
          where: {
            studentId: user?.id,
          },
          select: {
            id: true,
            status: true,
            content: true,
          },
        },
        lesson: {
          select: {
            name: true,
          },
        },
      },
    });

    let evaluationResult;
    if (assignmentDetail?.submission[0]?.id) {
      evaluationResult = await prisma.assignmentEvaluation.findUnique({
        where: {
          submissionId: assignmentDetail?.submission[0].id,
        },
      });
    }

    if (assignmentDetail) {
      let detail: IAssignmentDetail = {
        assignmentId: assignmentDetail.id,
        content: assignmentDetail.content as any,
        submission: assignmentDetail.submission[0] as any,
        evaluatedData: evaluationResult as any,
        name: assignmentDetail.lesson.name,
        estimatedDurationInMins: Number(assignmentDetail.estimatedDuration),
        status: assignmentDetail?.submission[0]?.status,
        maximumScore: assignmentDetail.maximumPoints,
        passingScore: assignmentDetail.passingScore,
      };

      let isNoAnswer =
        assignmentDetail?.submission[0]?.status === undefined && query.isNoAnswer === "true" ? true : false;

      if (detail.content._type === AssignmentType.MCQ && isNoAnswer) {
        let assignmentContent = detail.content as MCQAssignment;
        let questions = assignmentContent.questions;
        let updateQuestion = questions.map((question) => {
          return {
            ...question,
            correctOptionIndex: [],
          };
        });

        detail.content = {
          _type: AssignmentType.MCQ,
          questions: updateQuestion as MCQAssignment["questions"],
        } as IAssignmentDetails;
      }

      return res.status(200).json(new APIResponse(true, 200, "Assignment detail has been fetched", detail));
    } else {
      return res.status(400).json(new APIResponse(false, 400, "No assignment has been found"));
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(withValidation(validateReqQuery, handler, true)));
