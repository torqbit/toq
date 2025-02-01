import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
import { z } from "zod";
import withValidation from "@/lib/api-middlewares/with-validation";

export const validateReqQuery = z.object({
  submissionId: z.coerce.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { submissionId } = validateReqQuery.parse(req.query);

    const evaluationResult = await prisma.assignmentEvaluation.findUnique({
      where: {
        submissionId: submissionId,
      },
    });

    return res.status(200).json(new APIResponse(true, 200, "Evaluation result found", evaluationResult));
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(withValidation(validateReqQuery, handler, true)));
