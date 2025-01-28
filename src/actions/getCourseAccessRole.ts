import { orderStatus, Role } from "@prisma/client";
import prisma from "@/lib/prisma";

export const getCourseAccessRole = async (
  userRole?: Role,
  userId?: string,
  courseId?: number | string,
  courseSlug: boolean = false
) => {
  let cId = courseId;
  let role: Role = Role.NOT_ENROLLED;
  let isLearningPath = false;
  let dateJoined: Date = new Date();
  let pathId: number | undefined;

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

  const isLearningRegistered =
    findLearningPathCourse &&
    userId &&
    (await prisma.order.findUnique({
      where: {
        studentId_productId: {
          studentId: userId,
          productId: findLearningPathCourse.learningPathId,
        },
        orderStatus: orderStatus.SUCCESS,
      },
      select: {
        updatedAt: true,
      },
    }));

  if (isLearningRegistered) {
    isLearningPath = true;
    pathId = findLearningPathCourse.learningPathId;
    if (userRole === Role.ADMIN) {
      role = Role.ADMIN;
    } else if (userRole === Role.AUTHOR && findLearningPathCourse.course.authorId === userId) {
      role = Role.AUTHOR;
    } else {
      dateJoined = isLearningRegistered.updatedAt;
      role = Role.STUDENT;
    }
  } else {
    const registrationDetails =
      userId &&
      (await prisma.courseRegistration.findFirst({
        where: {
          studentId: userId,

          order: {
            product: {
              productId: Number(cId),
            },
          },
        },
        select: {
          dateJoined: true,
          order: {
            select: {
              product: {
                select: {
                  course: {
                    select: {
                      authorId: true,
                    },
                  },
                },
              },
            },
          },
        },
      }));

    if (registrationDetails) {
      if (userRole === Role.ADMIN) {
        role = Role.ADMIN;
      } else if (userRole === Role.AUTHOR && registrationDetails.order.product.course?.authorId === userId) {
        role = Role.AUTHOR;
      } else {
        role = Role.STUDENT;
        dateJoined = registrationDetails.dateJoined;
      }
    } else {
      if (userRole == Role.STUDENT) {
        role = Role.NOT_ENROLLED;
      } else {
        role = userRole as Role;
      }
    }
  }

  return { role, dateJoined, isLearningPath, pathId };
};
