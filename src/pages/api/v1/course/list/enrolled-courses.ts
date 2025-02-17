import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { CourseState, StateType } from "@prisma/client";

/**
 * API to list all the courses enrolled by the logged in user
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const percentage = (partialValue?: number, totalValue?: number) => {
      return (100 * Number(partialValue)) / Number(totalValue) > 0
        ? (100 * Number(partialValue)) / Number(totalValue)
        : 0;
    };

    let courseProgress = await prisma.$queryRaw<
      any[]
    >`select co.courseId,co.slug as courseSlug, co.name,cr.expireIn as expiryDate, COUNT(re.resourceId) as lessons, COUNT(cp.resourceId) as watched_lessons FROM Course as co
  INNER JOIN Chapter as ch ON co.courseId = ch.courseId 
  INNER JOIN \`Order\` as ord ON ord.productId = co.courseId
  INNER JOIN CourseRegistration as cr ON ord.id = cr.orderId
  INNER JOIN Resource as re ON ch.chapterId = re.chapterId
  LEFT OUTER JOIN CourseProgress as cp ON re.resourceId = cp.resourceId AND cr.studentId = cp.studentId
  WHERE  re.state = ${StateType.ACTIVE} AND cr.studentId = ${token?.id} AND cr.courseState != ${CourseState.COMPLETED}
  GROUP BY co.courseId, co.name, cr.expireIn
  UNION
  select co.courseId,co.slug as courseSlug, co.name,cr.expireIn as expiryDate, COUNT(re.resourceId) as lessons, COUNT(cp.resourceId) as watched_lessons FROM Course as co
  INNER JOIN Chapter as ch ON co.courseId = ch.courseId 
  INNER JOIN \`Order\` as ord ON ord.productId =  co.courseId
  INNER JOIN CourseRegistration as cr ON ord.id = cr.orderId
  INNER JOIN Resource as re ON ch.chapterId = re.chapterId
  INNER JOIN CourseProgress as cp ON re.resourceId = cp.resourceId AND cr.studentId = cp.studentId
  WHERE  re.state = ${StateType.ACTIVE} AND cr.studentId = ${token?.id} AND cr.courseState = ${CourseState.COMPLETED}
  GROUP BY co.courseId, co.name, cr.expireIn

  UNION
  
  SELECT 
    co.courseId, 
    co.slug as courseSlug,
    co.name, 
   
    cr.expireIn as expiryDate,
    COUNT(re.resourceId) AS lessons, 
    COUNT(cp.resourceId) AS watched_lessons 
  FROM Course AS co
  INNER JOIN LearningPathCourses AS lpc ON co.courseId = lpc.courseId
  INNER JOIN LearningPath AS lp ON lpc.learningPathId = lp.id
  INNER JOIN \`Order\` AS ord ON ord.productId = lp.id
  INNER JOIN CourseRegistration AS cr ON ord.id = cr.orderId
  INNER JOIN Chapter AS ch ON co.courseId = ch.courseId
  INNER JOIN Resource AS re ON ch.chapterId = re.chapterId
  LEFT OUTER JOIN CourseProgress AS cp ON re.resourceId = cp.resourceId AND cr.studentId = cp.studentId
  WHERE re.state = ${StateType.ACTIVE} 
    AND cr.studentId = ${token?.id} 
    AND cr.courseState != ${CourseState.COMPLETED}
  GROUP BY co.courseId, co.name, cr.expireIn
  `;

    if (courseProgress.length > 0) {
      courseProgress = courseProgress.map((cp: any) => {
        return {
          courseName: cp.name,
          courseId: cp.courseId,
          slug: cp.courseSlug,
          isExpired: cp.expiryDate && new Date(cp.expiryDate).getTime() < new Date().getTime(),
          progress: `${Math.floor(percentage(Number(cp.watched_lessons), Number(cp.lessons)))}%`,
        };
      });
    }

    return res.status(200).json({
      info: false,
      success: true,
      message: "registered courses successfully fetched",
      progress: courseProgress,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
