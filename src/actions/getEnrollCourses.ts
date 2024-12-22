import prisma from "@/lib/prisma";

export interface IListingsCourses {
  userId?: string;
  pageNo?: number;
  pageSize?: number;
}
/**
 * List all the course Ids, that this user has enrolled
 * @param userId 
 * @returns 
 */
export const getUserEnrolledUserId = async (userId: string) => {
  try {
    const courseOrders = await prisma.courseRegistration.findMany({
      where: {
        studentId: userId,
      },
      select: {
        order: true,
      },
    });

    if (courseOrders) {
      return courseOrders.map(co => co.order.productId)
    } else {
      throw new Error("Unable to find course enrolments")
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * 
 * @param courseId 
 * @param userId 
 * @returns 
 */
export const getUserEnrolledCoursesId = async (courseId: number, userId: string) => {
  try {
    const registrations = await prisma.courseRegistration.count({
      where: {
        studentId: userId,
        order: {
          productId: courseId
        },
      },
    });

    return registrations > 0;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default async function getEnrollCourses(params: IListingsCourses) {
  try {
    const { userId, pageNo, pageSize } = params;

    let pagination: any = {};

    let query: any = {
      isActive: true,
    };

    if (userId) {
      query.studentId = userId;
    }

    if (pageNo && pageSize) {
      pagination.skip = pageNo * pageSize;
      pagination.take = pageSize;
    }

    const enrollCourses = await prisma.courseRegistration.findMany({
      where: query,
      include: {
        course: {
          include: {
            chapter: {
              where: {
                isActive: true,
              },
              include: {
                resource: {
                  where: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...pagination,
    });

    return enrollCourses;
  } catch (error: any) {
    throw new Error(error);
  }
}
