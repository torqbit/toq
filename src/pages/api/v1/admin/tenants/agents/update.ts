import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import { APIResponse } from "@/types/apis";
import prisma from "@/lib/prisma";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import withValidation from "@/lib/api-middlewares/with-validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Define the plan schema for validation
const bodySchema = z.object({
  name: z.string(),
  model: z.string(),
  temperature: z.number(),
  agentPrompt: z.string(),
  agentId: z.string(),
});

type UpdateAssistantRequest = z.infer<typeof bodySchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, await authOptions(req));
    const body = await req.body;
    const bodyData: UpdateAssistantRequest = bodySchema.parse(body);

    await prisma.aiAgent.update({
      where: {
        id: bodyData.agentId,
        tenantId: session?.tenant?.tenantId,
      },
      data: {
        name: bodyData.name,
        model: bodyData.model,
        temperature: bodyData.temperature,
        agentPrompt: bodyData.agentPrompt,
      },
    });

    return res.status(200).json(new APIResponse(true, 200, "Agent has been updated successfully.", {}));
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withTenantOwnerAuthorized(withValidation(bodySchema, handler)));
