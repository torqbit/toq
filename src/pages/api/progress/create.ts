import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import appConstant from "@/services/appConstant";
import { getToken } from "next-auth/jwt";
export let cookieName = appConstant.development.cookieName;

if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

export const validateReqBody = z.object({
  resourceId: z.number(),
  sequenceId: z.number(),
  courseId: z.number(),
  chapterId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const userId = token?.id;
    const body = await req.body;
    const { resourceId, chapterId, sequenceId, courseId } = body;
    const findTotalResourceCompleted = await prisma.courseProgress.count({
      where: {
        studentId: userId,
        courseId: Number(courseId),
      },
    });
    const newProgress =
      userId &&
      (await prisma.courseProgress.create({
        data: {
          courseId: Number(courseId),
          resourceId: resourceId,
          sequenceId: sequenceId,
          studentId: userId,
          chapterId: chapterId,
          lessonsCompleted: findTotalResourceCompleted > 0 ? findTotalResourceCompleted + 1 : 1,
        },
      }));

    return res.status(200).json({ success: true, message: "Resource updated successfully" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));
