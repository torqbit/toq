import { NextApiResponse, NextApiRequest } from "next";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withMethods } from "@/lib/api-middlewares/with-method";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { APIResponse } from "@/types/apis";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const validateReqBody = z.object({
  sourceId: z.string(),
  pageSize: z.number(),
  pageNumber: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const reqBody = validateReqBody.parse(body);
    const session = await getServerSession(req, res, await authOptions(req));

    //list the knowledge source based on the tenantId and parentSourceId using prisma
    const knowledgeSources = await prisma.knowledgeSource.findMany({
      select: {
        id: true,
        sourceUrl: true,
      },
      where: {
        tenantId: session?.tenant?.tenantId || "",
        parentSourceId: reqBody.sourceId,
      },
      take: reqBody.pageSize,
      skip: (reqBody.pageNumber - 1) * reqBody.pageSize,
    });
    return res.status(200).json(new APIResponse<any>(true, 200, "Fetched knowledge sources", knowledgeSources));
  } catch (error: any) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(withValidation(validateReqBody, handler)));
