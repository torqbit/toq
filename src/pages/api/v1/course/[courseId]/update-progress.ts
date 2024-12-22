import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { ResourceContentType } from "@prisma/client";
import updateCourseProgress from "@/actions/updateCourseProgress";

export const validateReqBody = z.object({
  resourceId: z.number(),
  courseId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const userId = token?.id;
    const body = await req.body;
    const { resourceId, courseId } = body;
    const isEnrolled = await prisma.courseRegistration.findFirst({
      where: {
        studentId: userId,
        order: {
          productId: Number(courseId),
        },
      },
      select: {
        certificate: true,
        registrationId: true,
      },
    });

    if (isEnrolled) {
      const courseProgress = await updateCourseProgress(
        Number(courseId),
        Number(resourceId),
        String(token?.id),
        ResourceContentType.Video,
        isEnrolled.registrationId,
        isEnrolled.certificate ? true : false
      );

      if (courseProgress) {
        return res.status(200).json({
          success: true,
          message: "Course progress updated successfully",
          progress: {
            lessonsCompleted: Number(courseProgress.lessonsCompleted),
            totalLessons: Number(courseProgress.totalLessons),
          },
        });
      } else {
        res.status(400).json({ success: false, error: "Unable to update the course progress" });
      }
    } else {
      res.status(400).json({ success: false, error: "You are not enrolled in this course" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));
