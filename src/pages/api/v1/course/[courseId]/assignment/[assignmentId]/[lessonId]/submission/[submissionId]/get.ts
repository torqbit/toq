import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { submissionId } = req.query;

    const evaluationResult = await prisma.assignmentEvaluation.findUnique({
      where: {
        submissionId: Number(submissionId),
      },
    });

    if (evaluationResult?.id) {
      return res
        .status(200)
        .json(new APIResponse(true, 200, "Evaluation result found", { evaluationResult: evaluationResult }));
    } else {
      return res.status(404).json(new APIResponse(false, 404, "Evaluation result not found"));
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
