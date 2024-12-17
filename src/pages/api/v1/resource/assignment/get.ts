import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { IAssignmentDetail } from "@/types/courses/Course";
import { IAssignmentSubmission } from "@/types/courses/assignment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { lessonId } = query;

    const assignmentDetail = await prisma?.assignment.findUnique({
      where: {
        lessonId: Number(lessonId),
      },
      select: {
        content: true,
        assignmentFiles: true,
        estimatedDuration: true,
        submissionConfig: true,
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
        content: assignmentDetail.content as string,
        assignmentFiles: assignmentDetail.assignmentFiles as string[],
        name: assignmentDetail.lesson.name,
        estimatedDuration: Number(assignmentDetail.estimatedDuration),
        submissionConfig: assignmentDetail.submissionConfig as unknown as IAssignmentSubmission,
      };
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
