import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import enrollmentService from "@/actions/enrollmentService";
import { APIResponse } from "@/types/apis";

export const validateReqBody = z.object({
  courseId: z.number(),
  orderId: z.string().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const body = await req.body;
    const reqBody = validateReqBody.parse(body);
    // check is user Active

    if (!token || !token.isActive) {
      return res.status(400).json(new APIResponse(false, 400, " You are not  an active user"));
    }

    let studentInfo = {
      studentId: token.id,
      email: String(token.email),
      name: String(token.name),
      phone: token.phone,
    };

    const enrollCourse = await enrollmentService.courseEnrollment(studentInfo, reqBody.courseId);
    return res.status(enrollCourse.status).json(enrollCourse);

    // check user already enrolled
  } catch (error: any) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withAuthentication(handler)));
