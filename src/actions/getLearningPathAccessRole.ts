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

export const getLearningPathAccessRole = async (
  pathId: number,

  userRole?: Role,
  userId?: string
) => {
  let role: Role = Role.NOT_ENROLLED;
  let dateJoined: Date | undefined;
  let dateExpiry: Date | undefined;
  let isExpired;

  const learnindDetail = await prisma.learningPath.findUnique({
    where: {
      id: pathId,
    },
    select: {
      authorId: true,
      learningPathCourses: {
        select: {
          course: {
            select: {
              authorId: true,
            },
          },
        },
      },
    },
  });
  const coursesAuthor = learnindDetail?.learningPathCourses.map((c) => c.course.authorId);
  if (userId && userRole) {
    if (userRole == Role.STUDENT) {
      const enrollmentDetails = await getEnrollmentDetails(userId, pathId);
      if (enrollmentDetails) {
        isExpired = enrollmentDetails.expireIn && enrollmentDetails.expireIn?.getTime() < new Date().getTime();
        if (!isExpired) {
          return {
            role: Role.STUDENT,
            dateJoined: enrollmentDetails.createdAt as Date,
            isExpired: false,
            dateExpiry: enrollmentDetails.expireIn as Date,
            isLearningPath: true,
            productId: pathId,
          };
        }
      }
    }
  } else {
    role = Role.NOT_ENROLLED;
  }

  if (isExpired) {
    role = Role.NOT_ENROLLED;
  } else {
    if (userRole === Role.ADMIN) {
      role = Role.ADMIN;
    } else if (
      userRole === Role.AUTHOR &&
      (learnindDetail?.authorId === userId ||
        (coursesAuthor && coursesAuthor.length > 0 && coursesAuthor.includes(String(userId))))
    ) {
      role = Role.AUTHOR;
    }
  }

  return { role, dateJoined, dateExpiry, isLearningPath: true, productId: pathId };
};
