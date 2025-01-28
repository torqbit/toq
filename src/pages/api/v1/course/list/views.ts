import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

import { getCouseListItems } from "@/actions/getCourseListItems";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const response = await getCouseListItems({ role: token?.role, id: token?.id });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
