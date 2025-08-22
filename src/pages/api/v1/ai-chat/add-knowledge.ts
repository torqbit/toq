import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import { APIResponse } from "@/types/apis";
import { getCookieName } from "@/lib/utils";

import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import JobManager from "@/services/server/admin/JobManager";
import withValidation from "@/lib/api-middlewares/with-validation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

// Define the plan schema for validation
const bodySchema = z.object({
  docsUrl: z.string(),
});

type CreateEmbeddingRequest = z.infer<typeof bodySchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, await authOptions(req));
    const body = await req.body;
    const bodyData: CreateEmbeddingRequest = bodySchema.parse(body);

    // Start scraping the url
    await JobManager.addDocSite(bodyData.docsUrl, session?.tenant?.tenantId as string);

    return res
      .status(200)
      .json(
        new APIResponse(true, 200, "Knowledge base is being updated. Please wait while we process your request.", {})
      );
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(withValidation(bodySchema, handler)));
