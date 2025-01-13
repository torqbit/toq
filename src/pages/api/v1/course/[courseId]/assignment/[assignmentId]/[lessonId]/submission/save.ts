import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { compareByHash, getCookieName, mapToArray } from "@/lib/utils";

import { Role, submissionStatus } from "@prisma/client";
import getUserRole from "@/actions/getRole";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const body = req.body;
    const { assignmentId, lessonId, content } = body;
    const userRole = await getUserRole(Number(assignmentId), token?.role, String(token?.id));
    if (userRole === Role.AUTHOR || userRole === Role.MENTOR) {
      const savedSubmission = await prisma.assignmentSubmission.findFirst({
        where: {
          assignmentId: Number(assignmentId),
          lessonId: Number(lessonId),
          studentId: String(token?.id),
          status: submissionStatus.NOT_SUBMITTED,
        },
        select: {
          content: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (savedSubmission) {
        const updateSavedAssignment = await prisma.assignmentSubmission.update({
          where: {
            id: savedSubmission.id,
          },
          data: {
            content: content,
            updatedAt: new Date(),
          },
        });

        return res
          .status(200)
          .json({ success: true, message: "Assignment has been saved", codeDetail: updateSavedAssignment.content });
      } else {
        const createSavedAssignment = await prisma.assignmentSubmission.create({
          data: {
            studentId: String(token?.id),
            assignmentId,
            lessonId,
            content,
            updatedAt: new Date(),
          },
          select: {
            content: true,
          },
        });

        return res
          .status(200)
          .json({ success: true, message: "Assignment has been saved", codeDetail: createSavedAssignment.content });
      }
    } else {
      return res.status(403).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
