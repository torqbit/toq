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

const getLatestLesson = async (
  pathId: number,
  userId: string
): Promise<
  APIResponse<{
    courseId: number;
    totalLessons: number;
    watchedLesson: number;
    slug: string;
    latestProgressDate: Date;
    latestLessonId: number;
    firstLessonId: number;
  }>
> => {
  const resultRows = await prisma.$queryRaw<
    {
      courseId: number;
      totalLessons: number;
      watchedLesson: number;
      slug: string;
      latestProgressDate: Date;
      latestLessonId: number;
      firstLessonId: number;
    }[]
  >`
SELECT 
    co.courseId,
    co.slug,
    COUNT(DISTINCT r.resourceId) AS totalLessons,  
    COUNT(DISTINCT cp.courseProgressId) AS watchedLesson,  
    MAX(cp.createdAt) AS latestProgressDate,  
     (SELECT r.resourceId
     FROM Resource r
     WHERE r.chapterId = ch.chapterId
     ORDER BY r.createdAt ASC LIMIT 1) AS firstLessonId ,
    (SELECT cpr.resourceId
     FROM CourseProgress cpr
     WHERE cpr.courseId = co.courseId
     AND cpr.studentId = o.studentId
      
     ORDER BY cpr.createdAt DESC LIMIT 1) AS latestLessonId  
FROM LearningPath AS lp
INNER JOIN \`Order\` AS o 
    ON o.productId = lp.id 
    AND o.orderStatus = ${orderStatus.SUCCESS}
INNER JOIN CourseRegistration AS cr 
    ON cr.orderId = o.id
INNER JOIN LearningPathCourses AS lc 
    ON lc.learningPathId = lp.id
INNER JOIN Course AS co 
    ON co.courseId = lc.courseId
INNER JOIN Chapter AS ch 
    ON ch.courseId = co.courseId 
    AND ch.state = ${StateType.ACTIVE}
INNER JOIN Resource AS r 
    ON r.chapterId = ch.chapterId 
    AND r.state = ${StateType.ACTIVE}
LEFT JOIN CourseProgress AS cp 
    ON cp.courseId = co.courseId 
    AND cp.studentId = o.studentId
WHERE lp.id = ${pathId}
  AND o.studentId = ${userId}
  AND r.createdAt <= cr.dateJoined
GROUP BY co.courseId, lp.id,ch.chapterId,cr.dateJoined,o.studentId
ORDER BY lc.sequenceId ASC;


`;

  console.log(resultRows);
  if (resultRows.length > 0) {
    const totalCompletedCourses = resultRows.filter(
      (row) => row.watchedLesson > 0 && row.watchedLesson == row.totalLessons
    );
    const inCompletedCourses = resultRows.filter((row) => row.watchedLesson < row.totalLessons);
    if (totalCompletedCourses.length == resultRows.length) {
      return new APIResponse(true, 200, "Detail has been fetched", totalCompletedCourses[0]);
    } else {
      return new APIResponse(true, 200, "Detail has been fetched", inCompletedCourses[0]);
    }
  } else {
    return new APIResponse(false, 404, "Unable to find the learning path detail");
  }
};

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
      const latestLessonDetail = await getLatestLesson(Number(pathId), String(userId));
      if (latestLessonDetail.body) {
        let lessonId;
        if (latestLessonDetail.body && latestLessonDetail.body.watchedLesson == 0) {
          lessonId = latestLessonDetail.body.firstLessonId;
        } else {
          lessonId = latestLessonDetail.body.latestLessonId;
        }
        let redirectLink = `courses/${latestLessonDetail.body.slug}/lesson/${lessonId}`;
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
