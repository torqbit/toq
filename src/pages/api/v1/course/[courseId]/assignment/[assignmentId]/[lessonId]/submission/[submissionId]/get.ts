import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const { submissionId } = req.query;

    const evaluationResult = await prisma.assignmentEvaluation.findUnique({
      where: {
        submissionId: Number(submissionId),
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Evaluation result found", evaluationResult: evaluationResult });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
