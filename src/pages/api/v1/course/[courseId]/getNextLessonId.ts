import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getCookieName } from "@/lib/utils";
import { Role, StateType } from "@prisma/client";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let cookieName = getCookieName();

  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
    cookieName,
  });
  const userId = token?.id;
  const { courseId } = req.query;
  try {
    const hasAccess = await getCourseAccessRole(token?.role, token?.id, Number(courseId));

    if (hasAccess.role == Role.STUDENT) {
      const latestLesson = await prisma.courseProgress.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          courseId: Number(courseId),
          studentId: token?.id,
          resource: {
            state: StateType.ACTIVE,
          },
        },
        select: {
          resourceId: true,
        },
      });
      if (latestLesson) {
        let nextLessonId = latestLesson?.resourceId;

        return res.status(200).json({ success: true, nextLessonId });
      } else {
        const firstResource = await prisma.chapter.findFirst({
          where: {
            courseId: Number(courseId),
            state: StateType.ACTIVE,
          },
          orderBy: {
            sequenceId: "asc",
          },
          select: {
            resource: {
              where: {
                state: StateType.ACTIVE,
                createdAt: {
                  lte: hasAccess.dateJoined,
                },
              },
              orderBy: {
                sequenceId: "asc",
              },
              select: {
                resourceId: true,
              },
            },
          },
        });

        return res.status(200).json({ success: true, nextLessonId: firstResource?.resource[0].resourceId });
      }
    } else {
      const courseDetail = await prisma.course.findUnique({
        where: {
          courseId: Number(courseId),
        },
        select: {
          authorId: true,
          chapters: {
            where: {
              state: StateType.ACTIVE,
            },
            orderBy: {
              sequenceId: "asc",
            },
            select: {
              resource: {
                where: {
                  state: StateType.ACTIVE,
                },
                orderBy: {
                  sequenceId: "asc",
                },
                select: {
                  resourceId: true,
                },
              },
            },
          },
        },
      });
      if (courseDetail?.authorId === userId || token?.role === Role.ADMIN) {
        return res.status(200).json({ success: true, nextLessonId: courseDetail?.chapters[0].resource[0].resourceId });
      }
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
