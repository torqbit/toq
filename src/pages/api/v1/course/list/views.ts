import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { CourseState, Role, StateType } from "@prisma/client";
import { ICourseListItem } from "@/types/courses/Course";
import { APIResponse } from "@/types/apis";
import appConstant from "@/services/appConstant";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

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
            const isAccess = await getCourseAccessRole(token?.role, token?.id, Number(c.courseId));
            userRole = isAccess.role;
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
          currency: appConstant.currency,
          state: c.state,
          userRole: userRole,
        };
      })
    );

    if (token === null || (token && token.role === Role.STUDENT)) {
      courses = courseListItems.filter((c) => c.state === StateType.ACTIVE);
    } else if (token && token.role === Role.AUTHOR) {
      courses = courseListItems.filter(
        (c) => c.state === StateType.ACTIVE || (c.userRole && c.userRole === Role.AUTHOR)
      );
    } else {
      courses = courseListItems;
    }
    return res.status(200).json(new APIResponse(true, 200, `Fetched the courses list`, courses));
  } catch (error) {
    console.error(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
