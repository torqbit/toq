import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getCookieName } from "@/lib/utils";
import { orderStatus, Role, StateType } from "@prisma/client";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";
import { getLearningPathAccessRole } from "@/actions/getLearningPathAccessRole";
import { APIResponse } from "@/types/apis";
import { getLearningPathCourseStatus } from "@/actions/getLearningPathCourseStatus";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let cookieName = getCookieName();

  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
    cookieName,
  });
  const userId = token?.id;
  const { pathId } = req.query;

  try {
    const hasAccess = await getLearningPathAccessRole(Number(pathId), token?.role, token?.id);
    if (hasAccess.role == Role.STUDENT) {
      const latestLessonDetail = await getLearningPathCourseStatus(Number(pathId), String(userId));
      if (latestLessonDetail.body && latestLessonDetail.body.length > 0) {
        let lessonId;
        let slug;

        const totalCompletedCourses = latestLessonDetail.body.filter(
          (row) => row.watchedLesson > 0 && row.watchedLesson == row.totalLessons
        );

        const inCompletedCourses = latestLessonDetail.body.filter((row) => row.watchedLesson < row.totalLessons);
        if (totalCompletedCourses.length == latestLessonDetail.body.length) {
          lessonId = totalCompletedCourses[0].firstLessonId;
          slug = totalCompletedCourses[0].slug;
        } else {
          lessonId =
            inCompletedCourses[0].watchedLesson == 0
              ? inCompletedCourses[0].firstLessonId
              : inCompletedCourses[0].latestLessonId;
          slug = inCompletedCourses[0].slug;
        }

        let redirectLink = `courses/${slug}/lesson/${lessonId}`;
        return res
          .status(latestLessonDetail.status)
          .json(
            new APIResponse(
              latestLessonDetail.success,
              latestLessonDetail.status,
              latestLessonDetail.message,
              redirectLink
            )
          );
      } else {
        return res.status(latestLessonDetail.status).json(latestLessonDetail);
      }
      // return
    } else if (hasAccess.role == Role.ADMIN || hasAccess.role == Role.AUTHOR) {
      const findTotalCourses = await prisma.learningPathCourses.findMany({
        where: {
          learningPathId: Number(pathId),
        },
        select: {
          course: {
            select: {
              slug: true,
              chapters: {
                where: {
                  state: StateType.ACTIVE,
                },
                select: {
                  resource: {
                    where: {
                      state: StateType.ACTIVE,
                    },
                    select: {
                      resourceId: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          sequenceId: "asc",
        },
      });
      let redirectLink = `courses/${findTotalCourses[0].course.slug}/lesson/${findTotalCourses[0]?.course.chapters[0].resource[0].resourceId}`;

      return res.status(200).json(new APIResponse(true, 200, "", redirectLink));
    } else {
      return res.status(403).json({ success: false, error: "You are not authorized" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
