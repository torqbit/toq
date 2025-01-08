import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getCookieName } from "@/lib/utils";
import { StateType } from "@prisma/client";

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
    const alreadyRegistered = await prisma.courseRegistration.findFirst({
      where: {
        studentId: userId,
        order: {
          productId: Number(courseId),
        },
      },
      select: {
        courseState: true,
      },
    });

    if (alreadyRegistered) {
      const latestLesson = await prisma.courseProgress.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          courseId: Number(courseId),
          studentId: token?.id,
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

      if (courseDetail?.authorId === userId) {
        return res.status(200).json({ success: true, nextLessonId: courseDetail?.chapters[0].resource[0].resourceId });
      }
    }

    return res.status(400).json({
      success: false,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
