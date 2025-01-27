import { ICoursePreviewDetail } from "@/types/courses/Course";
import { $Enums, CourseState, Role } from "@prisma/client";
import prisma from "@/lib/prisma";

export const learningCourseDetailForStudent = async (
  courseId: number,
  userId: string
): Promise<{
  courseDetail: ICoursePreviewDetail[];
  userRole: Role;
  userStatus?: CourseState;
}> => {
  return new Promise(async (resolve, reject) => {
    const resultRows = await prisma.$queryRaw<
      ICoursePreviewDetail[]
    >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.resourceId, re.name as lessonName, 
          co.name as courseName, co.description, co.tvUrl,co.tvThumbnail as videoThumbnail,co.previewMode,co.courseType,co.coursePrice,re.contentType as contentType,co.state as courseState,co.totalResources as totalLessons,
          co.difficultyLevel,u.name as authorName,u.image as authorImage,assign.estimatedDuration,
           vi.videoDuration, ch.chapterId, 
          ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
          INNER JOIN LearningPathCourses as pathCourse ON pathCourse.courseId = co.courseId
          INNER JOIN \`Order\` as ord ON ord.productId = pathCourse.learningPathId
          INNER JOIN CourseRegistration as cr ON   cr.orderId = ord.id
          INNER JOIN Chapter as ch ON co.courseId = ch.courseId
          INNER JOIN Resource as re ON ch.chapterId = re.chapterId
          INNER JOIN User as u ON u.id = co.authorId
          LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
          LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
          LEFT OUTER JOIN CourseProgress as cp ON cp.studentId = cr.studentId AND cp.resourceId = re.resourceId
          WHERE cr.studentId = ${userId}
          AND co.courseId = ${courseId} AND ch.state = ${$Enums.StateType.ACTIVE} AND re.state = ${$Enums.StateType.ACTIVE}
          ORDER BY chapterSeq, resourceSeq`;
    resolve({ courseDetail: resultRows, userRole: Role.STUDENT });
  });
};
