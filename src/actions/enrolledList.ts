import { getPercentage } from "@/services/helper";
import { orderStatus, StateType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
import { IEnrolledListResponse } from "@/types/courses/Course";
import { generateDayAndYear } from "@/lib/utils";

export const getEnrolledListByCourse = async (
  courseId: number,
  limit: number,
  offSet: number
): Promise<APIResponse<{ list: IEnrolledListResponse[]; total: number }>> => {
  const removeDuplicates = (data: IEnrolledListResponse[]) => {
    const result = [];
    const seen: any = {};

    data.forEach((item) => {
      const { studentName, dateJoined } = item;

      if (!seen[studentName] || new Date(item.dateJoined) > new Date(seen[studentName].dateJoined)) {
        seen[studentName] = item;
      }
    });

    for (const student in seen) {
      result.push(seen[student]);
    }

    return result;
  };

  let result = await prisma.$queryRaw<
    any[]
  >` SELECT   usr.name as studentName, Count(cp.resourceId) as watchedLessons,MAX(cp.createdAt) as lastActivity, COUNT(re.resourceId) as TotalLessons,o.updatedAt as dateJoined From \`Order\` as o
   INNER JOIN Course as co ON co.courseId = o.productId
   INNER JOIN Chapter as ch ON ch.courseId = co.courseId 
   INNER JOIN Resource as re ON re.chapterId = ch.chapterId 
   LEFT OUTER JOIN CourseProgress as cp ON cp.resourceId = re.resourceId AND cp.studentId = o.studentId 
   INNER JOIN User as usr ON usr.id = o.studentId 
   WHERE o.productId = ${courseId} AND o.orderStatus = ${orderStatus.SUCCESS} AND re.state = ${StateType.ACTIVE}  GROUP BY usr.id,o.updatedAt
   UNION
    SELECT   usr.name as StudentName,Count(cp.resourceId) as watchedLessons,MAX(cp.createdAt) as lastActivity, COUNT(re.resourceId) as TotalLessons,o.updatedAt as dateJoined From LearningPathCourses as lpc
    INNER JOIN \`Order\` as o ON o.productId = lpc.learningPathId AND o.orderStatus = ${orderStatus.SUCCESS} 
   INNER JOIN Course as co ON co.courseId = lpc.courseId
   INNER JOIN Chapter as ch ON ch.courseId = co.courseId 
   INNER JOIN Resource as re ON re.chapterId = ch.chapterId 
   LEFT OUTER JOIN CourseProgress as cp ON cp.resourceId = re.resourceId AND cp.studentId = o.studentId 
   INNER JOIN User as usr ON usr.id = o.studentId  
      WHERE lpc.courseId = ${courseId} AND re.state = ${StateType.ACTIVE} GROUP BY usr.id,o.updatedAt ORDER BY dateJoined ASC  LIMIT ${limit} OFFSET ${offSet}`;
  if (result.length > 0) {
    const isLearningPathExist = await prisma.learningPathCourses.findFirst({
      where: {
        courseId: courseId,
      },
      select: {
        learningPathId: true,
      },
    });

    let whereCluase = isLearningPathExist
      ? {
          OR: [
            {
              productId: courseId,
              orderStatus: orderStatus.SUCCESS,
            },
            {
              product: {
                learningPath: {
                  id: isLearningPathExist?.learningPathId,
                },
              },
            },
          ],
        }
      : {
          productId: courseId,
          orderStatus: orderStatus.SUCCESS,
        };

    const getTotalEnrolled = await prisma.order.findMany({
      distinct: ["studentId"],
      where: whereCluase,
      orderBy: {
        createdAt: "desc",
      },
    });

    const courseProgress = result.map((cp: any) => {
      return {
        studentName: cp.studentName,
        dateJoined: generateDayAndYear(cp.dateJoined),
        lastActivity: cp.lastActivity ? generateDayAndYear(cp.lastActivity) : "N/A",
        progress: Math.floor(getPercentage(Number(cp.watchedLessons), Number(cp.TotalLessons))),
      };
    });
    return new APIResponse(true, 200, "Enrolled users list has been fetched", {
      list: removeDuplicates(courseProgress),
      total: getTotalEnrolled ? getTotalEnrolled.length : 0,
    });
  } else {
    return new APIResponse(false, 404, "No enrolled users found", { list: [], total: 0 });
  }
};
