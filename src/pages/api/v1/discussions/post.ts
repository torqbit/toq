import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import getRoleByLessonId from "@/actions/getRoleByLessonId";
import { Role } from "@prisma/client";

/**
 * Post a query
 * @param req
 * @param res
 * @returns
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const body = await req.body;
    const { lessonId, courseId, comment } = body;

    const isEnrolled = await prisma.courseRegistration.findFirst({
      where: {
        studentId: String(token?.id),
        order: {
          productId: Number(courseId),
        },
      },
      select: {
        user: true,
      },
    });

    const userRole = await getRoleByLessonId(lessonId, token?.role, token?.id);

    if (isEnrolled || userRole === Role.AUTHOR) {
      const addDiscussion = await prisma.discussion.create({
        data: {
          userId: String(token?.id),
          resourceId: lessonId,
          comment: comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      if (isEnrolled && isEnrolled.user.id != token?.id) {
        await prisma.notification.create({
          data: {
            notificationType: "COMMENT",
            toUserId: isEnrolled.user.id,
            commentId: addDiscussion.id,
            fromUserId: String(token?.id) || "",
            resourceId: lessonId,
          },
        });
      }

      return res.status(200).json({ success: true, comment: addDiscussion, message: "Query has been posted" });
    } else {
      return res.status(400).json({ success: false, error: "You are not enrolled to this course" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
