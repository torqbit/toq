import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
import { verifySingleEmail } from "./validate-email";

export const checkUserExist = async (domain: string, email: string) => {
  const findUser = await prisma.user.count({
    where: {
      tenants: {
        some: {
          tenant: {
            domain: domain,
          },
        },
      },
      email: email,
    },
  });
  return findUser > 0;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, authType } = req.body;

    const validationResponse = await verifySingleEmail(email);
    if (!validationResponse.isValid) {
      return res.status(404).json(new APIResponse(false, 400, "Email is not valid"));
    }
    const isUserExist = await checkUserExist(req.headers.host || "", email);
    if (authType == "signin") {
      if (isUserExist) {
        return res.status(200).json(new APIResponse(true, 200, "User can proceed to login"));
      } else {
        return res.status(200).json(new APIResponse(false, 200, "No user found with this email"));
      }
    } else if (authType == "signup") {
      if (isUserExist) {
        return res.status(200).json(new APIResponse(false, 200, "User found with this email"));
      } else {
        return res.status(200).json(new APIResponse(true, 200, "No user found with this email"));
      }
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);
