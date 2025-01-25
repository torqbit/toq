import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import learningPath from "@/actions/learningPath";
import { StateType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const { state } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const response = await learningPath.listLearningPath(token?.role, token?.id, state as StateType);
    return res.status(response.status).json(response);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
