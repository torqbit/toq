import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { CourseState, orderStatus, StateType } from "@prisma/client";
import { getEnrolledListByCourse } from "@/actions/enrolledList";

/**
 * API to list all the courses enrolled by the logged in user
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const { courseId, offSet, limit } = req.query;

    const getList = await getEnrolledListByCourse(Number(courseId), Number(limit), Number(offSet));

    return res.status(getList.status).json(getList);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
