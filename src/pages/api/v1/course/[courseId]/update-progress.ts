import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { ResourceContentType, Role } from "@prisma/client";
import updateCourseProgress from "@/actions/updateCourseProgress";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";

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

    const hasAccess = await getCourseAccessRole(token?.role, userId, Number(courseId));

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
      orderBy: {
        createdAt: "desc",
      },
    });
    const isExist = cr?.certificate.find((c) => c.productId === Number(courseId));

    if (hasAccess.role === Role.STUDENT) {
      const courseProgress = await updateCourseProgress(
        Number(courseId),
        Number(resourceId),
        String(token?.id),
        ResourceContentType.Video,
        cr?.registrationId,
        typeof isExist !== "undefined",

        hasAccess.isLearningPath ? hasAccess.productId : undefined
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
      res.status(403).json({ success: false, error: "You are not enrolled in this course" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));
