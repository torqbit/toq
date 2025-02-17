import { ILessonPreviewDetail } from "@/types/courses/Course";
import { $Enums, CourseState, Role, StateType } from "@prisma/client";
import prisma from "@/lib/prisma";
const lessonDetailForStudentByLearningPath = async (
  learningPathId: number,
  courseId: number,

  userId: string,

  courseState?: CourseState
): Promise<{ lessonDetail: ILessonPreviewDetail[]; userRole: string }> => {
  if (courseState && courseState == CourseState.COMPLETED) {
    return new Promise(async (resolve, reject) => {
      let resultRows = await prisma.$queryRaw<
        ILessonPreviewDetail[]
      >`SELECT DISTINCT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq,sub.status as assignmentStatus , re.resourceId, re.name as lessonName, co.name as courseName, co.description,co.previewMode,
  re.description as lessonDescription, vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId,re.contentType as contentType ,assign.estimatedDuration,
  ch.name as chapterName, cp.resourceId as watchedRes FROM LearningPath as lp
  INNER JOIN LearningPathCourses as lpc ON lpc.learningPathId = lp.id
  INNER JOIN Course as co ON co.courseId = lpc.courseId
  INNER JOIN \`Order\` as o ON o.productId = lp.id
  INNER JOIN CourseRegistration as cr ON cr.orderId = o.id
  INNER JOIN Chapter as ch ON co.courseId = ch.courseId
  INNER JOIN Resource as re ON ch.chapterId = re.chapterId
  LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
  LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
  LEFT OUTER JOIN AssignmentSubmission as sub ON re.resourceId = sub.lessonId AND sub.studentId = o.studentId
  INNER JOIN CourseProgress as cp ON cp.studentId = o.studentId  AND cp.resourceId = re.resourceId
  WHERE  re.state = ${$Enums.StateType.ACTIVE}  AND ch.state = ${StateType.ACTIVE}
  AND lp.id = ${learningPathId} AND co.courseId = ${courseId}  AND o.studentId = ${userId}
  ORDER BY chapterSeq, resourceSeq;`;

      resolve({ lessonDetail: resultRows, userRole: Role.STUDENT });
    });
  } else {
    return new Promise(async (resolve, reject) => {
      let resultRows = await prisma.$queryRaw<
        ILessonPreviewDetail[]
      >`SELECT DISTINCT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq,sub.status as assignmentStatus , re.resourceId, re.name as lessonName, co.name as courseName, co.description,co.previewMode,
  re.description as lessonDescription, vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId,re.contentType as contentType ,assign.estimatedDuration,
  ch.name as chapterName, cp.resourceId as watchedRes FROM LearningPath as lp
 INNER JOIN LearningPathCourses as lpc ON lpc.learningPathId = lp.id
  INNER JOIN Course as co ON co.courseId = lpc.courseId
  INNER JOIN \`Order\` as o ON o.productId = lp.id
  INNER JOIN CourseRegistration as cr ON cr.orderId = o.id
  INNER JOIN Chapter as ch ON co.courseId = ch.courseId
  INNER JOIN Resource as re ON ch.chapterId = re.chapterId
  LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
  LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
  LEFT OUTER JOIN AssignmentSubmission as sub ON re.resourceId = sub.lessonId AND sub.studentId = o.studentId
  LEFT OUTER JOIN CourseProgress as cp ON cp.studentId = o.studentId  AND cp.resourceId = re.resourceId
  WHERE  re.state = ${$Enums.StateType.ACTIVE}  AND ch.state = ${StateType.ACTIVE}
  AND lp.id = ${learningPathId} AND co.courseId = ${courseId}  AND o.studentId = ${userId}
  ORDER BY chapterSeq, resourceSeq;`;

      resolve({ lessonDetail: resultRows, userRole: Role.STUDENT });
    });
  }
};
const lessonDetailForStudentByCourse = async (
  productId: number,

  userId: string,
  courseState?: CourseState
): Promise<{ lessonDetail: ILessonPreviewDetail[]; userRole: string }> => {
  if (courseState && courseState == CourseState.COMPLETED) {
    return new Promise(async (resolve, reject) => {
      let resultRows = await prisma.$queryRaw<
        ILessonPreviewDetail[]
      >`SELECT DISTINCT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq,sub.status as assignmentStatus , re.resourceId, re.name as lessonName, co.name as courseName, co.description,co.previewMode,
  re.description as lessonDescription, vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId,re.contentType as contentType ,assign.estimatedDuration,
  ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
  INNER JOIN \`Order\` as o ON o.productId = co.courseId
  INNER JOIN CourseRegistration as cr ON cr.orderId = o.id
  INNER JOIN Chapter as ch ON co.courseId = ch.courseId
  INNER JOIN Resource as re ON ch.chapterId = re.chapterId
  LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
  LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
  LEFT OUTER JOIN AssignmentSubmission as sub ON re.resourceId = sub.lessonId AND sub.studentId = o.studentId
  INNER JOIN CourseProgress as cp ON cp.studentId = o.studentId  AND cp.resourceId = re.resourceId
  WHERE  re.state = ${$Enums.StateType.ACTIVE}  AND ch.state = ${StateType.ACTIVE}
  AND co.courseId = ${productId}  AND o.studentId = ${userId}
  ORDER BY chapterSeq, resourceSeq;`;

      resolve({ lessonDetail: resultRows, userRole: Role.STUDENT });
    });
  } else {
    return new Promise(async (resolve, reject) => {
      let resultRows = await prisma.$queryRaw<
        ILessonPreviewDetail[]
      >`SELECT DISTINCT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq,sub.status as assignmentStatus , re.resourceId, re.name as lessonName, co.name as courseName, co.description,co.previewMode,
  re.description as lessonDescription, vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId,re.contentType as contentType ,assign.estimatedDuration,
  ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
  INNER JOIN \`Order\` as o ON o.productId = co.courseId
  INNER JOIN CourseRegistration as cr ON cr.orderId = o.id
  INNER JOIN Chapter as ch ON co.courseId = ch.courseId
  INNER JOIN Resource as re ON ch.chapterId = re.chapterId
  LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
  LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
  LEFT OUTER JOIN AssignmentSubmission as sub ON re.resourceId = sub.lessonId AND sub.studentId = o.studentId
  LEFT OUTER JOIN CourseProgress as cp ON cp.studentId = o.studentId  AND cp.resourceId = re.resourceId
  WHERE  re.state = ${$Enums.StateType.ACTIVE}  AND ch.state = ${StateType.ACTIVE}
  AND co.courseId = ${productId}  AND o.studentId = ${userId}
  ORDER BY chapterSeq, resourceSeq;`;

      resolve({ lessonDetail: resultRows, userRole: Role.STUDENT });
    });
  }
};

const lessonDetailForStudent = async (
  courseId: number,
  userId: string,
  learningPathId?: number
): Promise<{ lessonDetail: ILessonPreviewDetail[]; userRole: string }> => {
  const isRegistered = await prisma.courseRegistration.findFirst({
    where: {
      studentId: userId,
      order: {
        productId: learningPathId ? learningPathId : courseId,
      },
    },
    select: {
      courseState: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (learningPathId) {
    return lessonDetailForStudentByLearningPath(learningPathId, courseId, userId, isRegistered?.courseState);
  } else {
    return lessonDetailForStudentByCourse(courseId, userId, isRegistered?.courseState);
  }
};
const lessonDetail = async (
  courseId: number,
  userId: string,
  userRole: string
): Promise<{ lessonDetail: ILessonPreviewDetail[]; userRole: string }> => {
  return new Promise(async (resolve, reject) => {
    let resultRows = await prisma.$queryRaw<
      ILessonPreviewDetail[]
    >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq,sub.status as assignmentStatus , re.resourceId, re.name as lessonName, co.name as courseName, co.description,co.previewMode,
re.description as lessonDescription, vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId,re.contentType as contentType ,assign.estimatedDuration,
ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
INNER JOIN Chapter as ch ON co.courseId = ch.courseId
INNER JOIN Resource as re ON ch.chapterId = re.chapterId
LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
LEFT OUTER JOIN AssignmentSubmission as sub ON re.resourceId = sub.lessonId AND sub.studentId = ${userId}
LEFT OUTER JOIN CourseProgress as cp ON cp.studentId = ${userId}  AND cp.resourceId = re.resourceId
WHERE  re.state = ${$Enums.StateType.ACTIVE} 
AND co.courseId = ${courseId}
ORDER BY chapterSeq, resourceSeq;`;
    resolve({ lessonDetail: resultRows, userRole: userRole });
  });
};

const getLessonDetailForAuthor = async (courseId: number, userId: string, userRole: Role, learningPathId?: number) => {
  const getCourseDetail = await prisma.course.findUnique({
    where: {
      courseId: courseId,
    },
    select: {
      authorId: true,
    },
  });
  if (userId === getCourseDetail?.authorId || userRole === Role.ADMIN) {
    return lessonDetail(courseId, String(userId), Role.AUTHOR);
  } else {
    return lessonDetailForStudent(courseId, String(userId), learningPathId);
  }
};

const getLessonDetail = async (courseId: number, role?: Role, userId?: string, learningPathId?: number) => {
  switch (role) {
    case Role.AUTHOR:
      return getLessonDetailForAuthor(courseId, String(userId), role, learningPathId);
    case Role.ADMIN:
      return getLessonDetailForAuthor(courseId, String(userId), role, learningPathId);
    case Role.MENTOR:
      return lessonDetail(courseId, String(userId), Role.MENTOR);
    case Role.STUDENT:
      return lessonDetailForStudent(courseId, String(userId), learningPathId);
  }
};

export default getLessonDetail;
