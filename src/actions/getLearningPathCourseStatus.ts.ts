import { APIResponse } from "@/types/apis";
import prisma from "@/lib/prisma";
import { orderStatus, StateType } from "@prisma/client";
import { ILearningPathCourseStatus } from "@/types/learingPath";

export const getLearningPathCourseStatus = async (
  pathId: number,
  userId: string
): Promise<APIResponse<ILearningPathCourseStatus[]>> => {
  const resultRows = await prisma.$queryRaw<ILearningPathCourseStatus[]>`
  SELECT 
      co.courseId,
      co.slug,
      COUNT(DISTINCT r.resourceId) AS totalLessons,  
      COUNT(DISTINCT cp.courseProgressId) AS watchedLesson,  
      MAX(cp.createdAt) AS latestProgressDate,  
       (SELECT r.resourceId
       FROM Resource r
       WHERE r.chapterId = ch.chapterId AND
       r.state = ${StateType.ACTIVE}
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

  if (resultRows.length > 0) {
    return new APIResponse(true, 200, "Detail has been fetched", resultRows);
  } else {
    return new APIResponse(false, 404, "Unable to find the learning path detail");
  }
};
