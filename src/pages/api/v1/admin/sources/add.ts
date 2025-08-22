import { NextApiResponse, NextApiRequest } from "next";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withMethods } from "@/lib/api-middlewares/with-method";
import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import JobManager from "@/services/server/admin/JobManager";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";

import { getCookieName } from "@/lib/utils";
import { APIResponse } from "@/types/apis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const validateReqBody = z.object({
  parentSourceId: z.string(),
  urlSources: z.array(
    z.object({
      url: z.string(),
      sourceId: z.string(),
    })
  ),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const reqBody = validateReqBody.parse(body);
    const session = await getServerSession(req, res, await authOptions(req));

    JobManager.addKnowledgeSourceFromUrls(reqBody.parentSourceId, reqBody.urlSources, session?.tenant?.tenantId!);
    return res.status(200).json(new APIResponse<any>(true, 200, "Successfully added sources", {}));
  } catch (error: any) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(withValidation(validateReqBody, handler)));
