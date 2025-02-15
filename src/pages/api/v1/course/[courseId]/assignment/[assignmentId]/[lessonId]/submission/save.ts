import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { compareByHash, getCookieName, mapToArray } from "@/lib/utils";
import * as z from "zod";

import { Role, submissionStatus } from "@prisma/client";
import getUserRole from "@/actions/getRole";
import { APIResponse } from "@/types/apis";
import withValidation from "@/lib/api-middlewares/with-validation";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";

export const validateReqBody = z.object({
  assignmentId: z.coerce.number(),
  lessonId: z.coerce.number(),
  content: z.unknown(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const body = req.body;
    const { assignmentId, lessonId, content } = validateReqBody.parse(body);

    const courseDetail = await prisma.assignment.findFirst({
      where: {
        lessonId: lessonId,
      },
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
    });

    const courseAccess = await getCourseAccessRole(token?.role, token?.id, courseDetail?.lesson.chapter.courseId);

    if (courseAccess.role != Role.STUDENT) {
      return res
        .status(401)
        .json(new APIResponse(false, 401, "Only enrolled students are allowed to attempt the assessment"));
    }

    const savedSubmission = await prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId: assignmentId,
        lessonId: lessonId,
        studentId: token?.id,
        status: submissionStatus.PENDING,
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
          content: content as any,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          content: true,
        },
      });

      return res.status(200).json(
        new APIResponse(true, 200, "Assignment has been saved", {
          codeDetail: updateSavedAssignment.content,
          id: updateSavedAssignment.id,
        })
      );
    } else {
      const createSavedAssignment = await prisma.assignmentSubmission.create({
        data: {
          studentId: String(token?.id),
          assignmentId,
          lessonId,
          content: content as any,
          updatedAt: new Date(),
          status: submissionStatus.PENDING,
        },
        select: {
          id: true,
          content: true,
        },
      });

      return res.status(200).json(
        new APIResponse(true, 200, "Assignment has been saved", {
          codeDetail: createSavedAssignment.content,
          id: createSavedAssignment.id,
        })
      );
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withValidation(validateReqBody, handler)));
