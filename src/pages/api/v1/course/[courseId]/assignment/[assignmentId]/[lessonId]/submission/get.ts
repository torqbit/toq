import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { APIResponse } from "@/types/apis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const { lessonId } = req.query;

    const savedSubmission = await prisma.assignmentSubmission.findFirst({
      where: {
        lessonId: Number(lessonId),
        studentId: String(token?.id),
      },
      select: {
        content: true,
        status: true,
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(new APIResponse(true, 200, "Submission found", savedSubmission));
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
