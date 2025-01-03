import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { CourseType, Role, StateType } from "@prisma/client";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const { studentId } = req.query;

    //TODO: to be fixed later
    // const allCourse = await prisma.course.findMany({
    //   where: {
    //     authorId: token?.id,
    //     state: StateType.ACTIVE,
    //     NOT: {
    //       OR: [
    //         {
    //           CourseRegistraion: {
    //             some: {
    //               studentId: String(studentId),
    //             },
    //           },
    //         },
    //         {
    //           authorId: String(studentId),
    //         },
    //         {
    //           courseType: CourseType.FREE,
    //         },
    //       ],
    //     },
    //   },
    //   select: {
    //     courseId: true,
    //     name: true,
    //     authorId: true,
    //   },
    // });

    return res.status(200).json({
      info: false,
      success: true,
      message: "course successfully fetched",
      courses: [],
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(withUserAuthorized(handler)));
