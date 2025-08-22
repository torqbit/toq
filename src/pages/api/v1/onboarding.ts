import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { APIResponse } from "@/types/apis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, await authOptions(req));

    await prisma.tenant.update({
      where: {
        id: session?.tenant?.tenantId,
      },
      data: {
        onBoarding: true,
      },
    });

    return res.status(200).json(new APIResponse(true, 200, "Onboarding skipped"));
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
