import { orderStatus, Role } from "@prisma/client";
import prisma from "@/lib/prisma";

const getEnrollmentDetails = async (userId: string, productId: number) => {
  const getLatestOrder = await prisma.order.findFirst({
    where: {
      studentId: userId,
      productId: productId,
      orderStatus: orderStatus.SUCCESS,
    },
    select: {
      updatedAt: true,
      createdAt: true,
      registeredCourse: {
        select: {
          registrationId: true,
          createdAt: true,
          expireIn: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return getLatestOrder?.registeredCourse;
};

export const getCourseAccessRole = async (
  userRole?: Role,
  userId?: string,
  courseId?: number | string,
  courseSlug: boolean = false
) => {
  let cId = courseId;
  let role: Role = Role.NOT_ENROLLED;
  let isLearningPath = false;
  let dateJoined: Date | undefined;
  let dateExpiry: Date | undefined;
  let productId: number | undefined;
  let isExpired;

  if (courseSlug && typeof courseId == "string") {
    const findCourse = await prisma.course.findUnique({
      where: {
        slug: courseId,
      },
      select: {
        courseId: true,
      },
    });
    cId = findCourse?.courseId;
  }
  const findLearningPathCourse = await prisma.learningPathCourses.findFirst({
    where: {
      courseId: Number(cId),
    },
    select: {
      learningPathId: true,
      course: {
        select: {
          authorId: true,
        },
      },
    },
  });

  if (
    findLearningPathCourse &&
    userId &&
    userRole != Role.ADMIN &&
    userRole !== Role.AUTHOR &&
    findLearningPathCourse?.course.authorId !== userId
  ) {
    const enrollmentDetails = await getEnrollmentDetails(userId, findLearningPathCourse.learningPathId);

    if (enrollmentDetails) {
      isExpired = enrollmentDetails.expireIn && enrollmentDetails.expireIn?.getTime() < new Date().getTime();

      if (!isExpired) {
        return {
          role: Role.STUDENT,
          dateJoined: enrollmentDetails.createdAt as Date,
          isExpired: false,
          dateExpiry: enrollmentDetails.expireIn as Date,
          isLearningPath: true,
          productId: findLearningPathCourse.learningPathId,
        };
      }
    }
  }
  if (
    cId &&
    userId &&
    userRole != Role.ADMIN &&
    userRole !== Role.AUTHOR &&
    findLearningPathCourse?.course.authorId !== userId
  ) {
    const enrollmentDetails = await getEnrollmentDetails(userId, Number(cId));
    if (enrollmentDetails) {
      isExpired = enrollmentDetails.expireIn && enrollmentDetails.expireIn?.getTime() < new Date().getTime();
      if (!isExpired) {
        return {
          role: Role.STUDENT,
          dateJoined: enrollmentDetails.createdAt as Date,
          dateExpiry: enrollmentDetails.expireIn as Date,
          isExpired: false,
          isLearningPath: false,
          productId: Number(cId),
        };
      }
    }
  }

  productId = Number(cId);
  if (isExpired) {
    role = Role.NOT_ENROLLED;
  } else {
    if (userRole === Role.ADMIN) {
      role = Role.ADMIN;
    } else if (userRole === Role.AUTHOR && findLearningPathCourse?.course.authorId === userId) {
      role = Role.AUTHOR;
    }
  }

  return { role, dateJoined, dateExpiry, isLearningPath, productId };
};
