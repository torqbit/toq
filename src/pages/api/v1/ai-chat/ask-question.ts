import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { APIResponse } from "@/types/apis";
import EmbeddingService from "@/services/server/ai/EmbeddingService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { search, tenantId } = req.body;
    const response = await EmbeddingService.search(tenantId, search);
    return res.status(200).json(new APIResponse(true, 200, "AI Search", { response }));
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
