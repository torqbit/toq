import { ILessonPreviewDetail } from "@/types/courses/Course";
import { $Enums, CourseState, Role } from "@prisma/client";
import prisma from "@/lib/prisma";

const lessonForStudent = async (
  courseId: number,
  userId: string
): Promise<{ lessonDetail: ILessonPreviewDetail[]; userRole: string }> => {
  return new Promise(async (resolve, reject) => {
    const isCourseRegistered = await prisma.courseRegistration.findFirst({
      where: {
        studentId: userId,
        order: {
          productId: courseId,
        },
      },
      select: {
        courseState: true,
      },
    });
    if (isCourseRegistered && isCourseRegistered.courseState === CourseState.COMPLETED) {
      let resultRows = await prisma.$queryRaw<
        ILessonPreviewDetail[]
      >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.resourceId, re.name as lessonName, co.name as courseName, co.description,co.previewMode,
        re.description as lessonDescription, vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId,re.contentType as contentType , assign.estimatedDuration,
        ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
        INNER JOIN \`Order\` as ord ON ord.productId = co.courseId
        INNER JOIN CourseRegistration as cr ON   cr.orderId = ord.id
        INNER JOIN Chapter as ch ON co.courseId = ch.courseId
        INNER JOIN Resource as re ON ch.chapterId = re.chapterId
        LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
        LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
        INNER JOIN CourseProgress as cp ON cp.studentId = cr.studentId AND cp.resourceId = re.resourceId
        WHERE cr.studentId = ${userId} AND  re.state = ${$Enums.StateType.ACTIVE} 
        AND co.courseId = ${courseId}
        ORDER BY chapterSeq, resourceSeq`;
      resolve({ lessonDetail: resultRows, userRole: Role.STUDENT });
    } else {
      let resultRows = await prisma.$queryRaw<
        ILessonPreviewDetail[]
      >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.resourceId, re.name as lessonName, co.name as courseName, co.description,co.previewMode,
        re.description as lessonDescription, vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId,re.contentType as contentType ,assign.estimatedDuration,
        ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
        INNER JOIN \`Order\` as ord ON ord.productId = co.courseId
        INNER JOIN CourseRegistration as cr ON   cr.orderId = ord.id
        INNER JOIN Chapter as ch ON co.courseId = ch.courseId
        INNER JOIN Resource as re ON ch.chapterId = re.chapterId
        LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
        LEFT OUTER JOIN  Video as vi ON re.resourceId = vi.resourceId
        LEFT OUTER JOIN CourseProgress as cp ON cp.studentId = cr.studentId AND cp.resourceId = re.resourceId
        WHERE cr.studentId = ${userId}
        AND co.courseId = ${courseId} AND
        re.state = ${$Enums.StateType.ACTIVE} 
        ORDER BY chapterSeq, resourceSeq`;
      resolve({ lessonDetail: resultRows, userRole: Role.STUDENT });
    }
  });
};
const lessonDetail = async (
  courseId: number,
  userId: string,
  userRole: string
): Promise<{ lessonDetail: ILessonPreviewDetail[]; userRole: string }> => {
  return new Promise(async (resolve, reject) => {
    let resultRows = await prisma.$queryRaw<
      ILessonPreviewDetail[]
    >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.resourceId, re.name as lessonName, co.name as courseName, co.description,co.previewMode,
re.description as lessonDescription, vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId,re.contentType as contentType ,assign.estimatedDuration,
ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
INNER JOIN Chapter as ch ON co.courseId = ch.courseId
INNER JOIN Resource as re ON ch.chapterId = re.chapterId
LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
LEFT OUTER JOIN CourseProgress as cp ON cp.studentId = ${userId}  AND cp.resourceId = re.resourceId
WHERE  re.state = ${$Enums.StateType.ACTIVE} 
AND co.courseId = ${courseId}
ORDER BY chapterSeq, resourceSeq;`;
    resolve({ lessonDetail: resultRows, userRole: userRole });
  });
};

const getLessonDetailForAuthor = async (courseId: number, userId: string) => {
  const getCourseDetail = await prisma.course.findUnique({
    where: {
      courseId: courseId,
    },
    select: {
      authorId: true,
    },
  });
  if (userId === getCourseDetail?.authorId) {
    return lessonDetail(courseId, String(userId), Role.AUTHOR);
  } else {
    return lessonForStudent(courseId, String(userId));
  }
};

const getLessonDetail = async (courseId: number, role?: Role, userId?: string) => {
  switch (role) {
    case Role.AUTHOR:
      return getLessonDetailForAuthor(courseId, String(userId));
    case Role.ADMIN:
      return getLessonDetailForAuthor(courseId, String(userId));
    case Role.MENTOR:
      return lessonDetail(courseId, String(userId), Role.MENTOR);
    case Role.STUDENT:
      return lessonForStudent(courseId, String(userId));
  }
};

export default getLessonDetail;
