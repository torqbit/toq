import { NextApiResponse, NextApiRequest } from "next";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withMethods } from "@/lib/api-middlewares/with-method";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { APIResponse } from "@/types/apis";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";

import { getCookieName } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const validateReqBody = z.object({
  sourceId: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const reqBody = validateReqBody.parse(body);
    const session = await getServerSession(req, res, await authOptions(req));

    await prisma.knowledgeSource.deleteMany({
      where: {
        tenantId: session?.tenant?.tenantId || "",
        OR: [{ parentSourceId: reqBody.sourceId }, { id: reqBody.sourceId }],
      },
    });
    return res.status(200).json(new APIResponse<any>(true, 200, "Discovered links discarded ", {}));
  } catch (error: any) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(withValidation(validateReqBody, handler)));
