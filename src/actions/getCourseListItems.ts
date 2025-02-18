import { APIResponse } from "@/types/apis";
import { ICourseListItem } from "@/types/courses/Course";
import prisma from "@/lib/prisma";
import { gatewayProvider, Role, StateType } from "@prisma/client";
import { getCourseAccessRole } from "./getCourseAccessRole";
import { getCurrency } from "./getCurrency";

export const getCouseListItems = async (token?: {
  role?: Role;
  id?: string;
}): Promise<APIResponse<ICourseListItem[]>> => {
  let courses: ICourseListItem[] = [];

  const allCourses = await prisma.course.findMany({
    select: {
      courseId: true,
      name: true,
      difficultyLevel: true,
      state: true,
      description: true,
      totalResources: true,
      previewMode: true,
      tvThumbnail: true,
      coursePrice: true,
      slug: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  let courseListItems: ICourseListItem[] = await Promise.all(
    allCourses.map(async (c) => {
      let userRole: Role = Role.NOT_ENROLLED;
      if (token) {
        if (token.role === Role.ADMIN) {
          userRole = Role.ADMIN;
        } else if (token.role == Role.AUTHOR && c.user.id == token.id) {
          userRole = Role.AUTHOR;
        } else {
          const hasAccess = await getCourseAccessRole(token?.role, token?.id, Number(c.courseId));
          userRole = hasAccess.role;
        }
      }
      return {
        id: c.courseId,
        title: c.name,
        slug: c.slug || `${c.courseId}-`,
        description: c.description,
        difficultyLevel: c.difficultyLevel,
        author: c.user.name,
        price: c.coursePrice,
        trailerThumbnail: c.tvThumbnail || null,
        currency: await getCurrency(gatewayProvider.CASHFREE),
        state: c.state,
        userRole: userRole || Role.NOT_ENROLLED,
      };
    })
  );

  if (token === null || (token && token.role === Role.STUDENT)) {
    courses = courseListItems.filter((c) => c.state === StateType.ACTIVE);
  } else if (token && token.role === Role.AUTHOR) {
    courses = courseListItems.filter((c) => c.state === StateType.ACTIVE || (c.userRole && c.userRole === Role.AUTHOR));
  } else {
    courses = courseListItems;
  }

  return new APIResponse(true, 200, "Course list has been fetched", courses);
};
