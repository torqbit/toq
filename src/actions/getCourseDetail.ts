import { ICoursePreviewDetail } from "@/types/courses/Course";
import { $Enums, CourseState, orderStatus, Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolve } from "path";
import { learningCourseDetailForStudent } from "./getLearningCourseDetail";

export const extractLessonAndChapterDetail = (
  courseDetail: ICoursePreviewDetail[],
  userStatus: CourseState,
  userRole: Role
) => {
  let chapterLessons: any[] = [];
  let lessonProgress = 0;

  let courseInfo = {
    name: courseDetail[0]?.courseName,
    description: courseDetail[0]?.description,
    courseTrailer: courseDetail[0]?.tvUrl,
    previewMode: courseDetail[0]?.previewMode,
    courseType: courseDetail[0]?.courseType,
    coursePrice: courseDetail[0]?.coursePrice,
    userRole: userRole,
    difficultyLevel: courseDetail[0]?.difficultyLevel,
    courseState: courseDetail[0]?.courseState,
    authorImage: courseDetail[0]?.authorImage,
    authorName: courseDetail[0]?.authorName,
    userStatus: userStatus,
    videoThumbnail: courseDetail[0].videoThumbnail,
  };

  courseDetail.forEach((r) => {
    if (r.watchedRes) {
      lessonProgress++;
    }

    if (chapterLessons.find((l) => l.chapterSeq == r.chapterSeq)) {
      const chapter = chapterLessons.find((l) => l.chapterSeq == r.chapterSeq);
      chapter.lessons.push({
        title: r.lessonName,
        videoDuration: r.videoDuration,
        lessonId: r.resourceId,
        isWatched: r.watchedRes != null,
        contentType: r.contentType,
        estimatedDuration: r.estimatedDuration,
      });
    } else {
      chapterLessons.push({
        chapterSeq: r.chapterSeq,
        chapterName: r.chapterName,
        lessons: [
          {
            title: r.lessonName,
            videoDuration: r.videoDuration,
            lessonId: r.resourceId,
            isWatched: r.watchedRes != null,
            contentType: r.contentType,
            estimatedDuration: r.estimatedDuration,
          },
        ],
      });
    }
  });

  return { courseInfo, chapterLessons, progress: lessonProgress };
};

const courseDetailForStudent = async (
  courseId: number,
  userId: string
): Promise<{
  courseDetail: ICoursePreviewDetail[];
  userRole: Role;
  userStatus?: CourseState;
}> => {
  const findLearningPathCourse = await prisma.learningPathCourses.findFirst({
    where: {
      courseId: courseId,
    },
    select: {
      courseId: true,
      learningPathId: true,
      path: {
        select: {
          authorId: true,
        },
      },
    },
  });

  const isLearningRegistered =
    findLearningPathCourse &&
    (await prisma.order.findFirst({
      where: {
        studentId: userId,
        productId: findLearningPathCourse.learningPathId,
        orderStatus: orderStatus.SUCCESS,
      },
      orderBy: {
        createdAt: "desc",
      },
    }));

  if (isLearningRegistered) {
    return await learningCourseDetailForStudent(courseId, userId);
  } else {
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

    return new Promise(async (resolve, reject) => {
      if (isCourseRegistered) {
        if (isCourseRegistered.courseState === CourseState.COMPLETED) {
          const resultRows = await prisma.$queryRaw<
            ICoursePreviewDetail[]
          >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.resourceId, re.name as lessonName,
        co.name as courseName, co.description, co.tvUrl,co.tvThumbnail as videoThumbnail,co.previewMode,co.courseType,co.coursePrice,re.contentType as contentType,co.state as courseState,co.totalResources as totalLessons,
        co.difficultyLevel,u.name as authorName,u.image as authorImage,assign.estimatedDuration,
        vi.videoDuration, ch.chapterId,
        ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co
        INNER JOIN \`Order\` as ord ON ord.productId = co.courseId
        INNER JOIN CourseRegistration as cr ON  cr.orderId = ord.id
        INNER JOIN Chapter as ch ON co.courseId = ch.courseId
        INNER JOIN Resource as re ON ch.chapterId = re.chapterId
        LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId
        LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
        INNER JOIN User as u ON u.id = co.authorId
        INNER JOIN CourseProgress as cp ON cp.studentId = cr.studentId AND cp.resourceId = re.resourceId
        WHERE cr.studentId = ${userId}
        AND co.courseId = ${courseId} AND ch.state = ${$Enums.StateType.ACTIVE} AND re.state = ${$Enums.StateType.ACTIVE}
        ORDER BY chapterSeq, resourceSeq`;
          resolve({
            courseDetail: resultRows,
            userRole: Role.STUDENT,
            userStatus: CourseState.COMPLETED,
          });
        } else {
          const resultRows = await prisma.$queryRaw<
            ICoursePreviewDetail[]
          >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.resourceId, re.name as lessonName,
        co.name as courseName, co.description, co.tvUrl,co.tvThumbnail as videoThumbnail,co.previewMode,co.courseType,co.coursePrice,re.contentType as contentType,co.state as courseState,co.totalResources as totalLessons,
        co.difficultyLevel,u.name as authorName,u.image as authorImage,assign.estimatedDuration,
         vi.videoDuration, ch.chapterId,
        ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co
        INNER JOIN \`Order\` as ord ON ord.productId = co.courseId
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
        }
      } else {
        resolve(courseDetail(courseId, Role.NOT_ENROLLED));
      }
    });
    return await courseDetail(courseId, Role.NOT_ENROLLED);
  }
};
const courseDetail = async (
  courseId: number,
  userRole: Role
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
    ch.name as chapterName, NULL as watchedRes FROM Course as co 
    INNER JOIN User as u ON u.id = co.authorId
    INNER JOIN Chapter as ch ON co.courseId = ch.courseId
    INNER JOIN Resource as re ON ch.chapterId = re.chapterId
    LEFT OUTER JOIN Video as vi ON re.resourceId = vi.resourceId   
    LEFT OUTER JOIN Assignment as assign ON re.resourceId = assign.lessonId
    WHERE co.courseId = ${courseId} AND ch.state = ${$Enums.StateType.ACTIVE} AND re.state = ${$Enums.StateType.ACTIVE}
    ORDER BY chapterSeq, resourceSeq`;
    resolve({ courseDetail: resultRows, userRole: userRole });
  });
};

const courseDetailForAuthor = async (courseId: number, userId: string) => {
  const getCourseDetail = await prisma.course.findUnique({
    where: {
      courseId: courseId,
    },
    select: {
      authorId: true,
    },
  });
  if (userId === getCourseDetail?.authorId) {
    return courseDetail(courseId, Role.AUTHOR);
  } else {
    return courseDetailForStudent(courseId, String(userId));
  }
};

const getCourseDetail = async (courseId: number, role?: Role, userId?: string) => {
  switch (role) {
    case Role.AUTHOR:
      return courseDetailForAuthor(courseId, String(userId));
    case Role.ADMIN:
      return courseDetailForAuthor(courseId, String(userId));
    case Role.STUDENT:
      return courseDetailForStudent(courseId, String(userId));
    default:
      return courseDetail(courseId, Role.NA);
  }
};

export default getCourseDetail;
