import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { IAssignmentDetail } from "@/types/courses/Course";
import { JsonObject } from "@prisma/client/runtime/library";
import { AssignmentType, IAssignmentDetails, MCQAssignment } from "@/types/courses/assignment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { lessonId, isNoAnswer } = query;

    const assignmentDetail = await prisma?.assignment.findUnique({
      where: {
        lessonId: Number(lessonId),
      },
      select: {
        content: true,
        estimatedDuration: true,
        submissionConfig: true,
        maximumPoints: true,
        passingScore: true,
        id: true,
        lesson: {
          select: {
            name: true,
          },
        },
      },
    });

    if (assignmentDetail) {
      let detail: IAssignmentDetail = {
        assignmentId: assignmentDetail.id,
        content: assignmentDetail.content as any,
        name: assignmentDetail.lesson.name,
        estimatedDurationInMins: Number(assignmentDetail.estimatedDuration),
        maximumScore: assignmentDetail.maximumPoints,
        passingScore: assignmentDetail.passingScore,
      };
      if (detail.content._type === AssignmentType.MCQ && isNoAnswer === "true") {
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

      return res.json({
        success: true,
        message: " Assignment detail has been fetched",
        assignmentDetail: detail,
      });
    } else {
      return res.status(400).json({ success: false, error: "No assignment has been found" });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
