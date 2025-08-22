import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { APIResponse } from "@/types/apis";

import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import prisma from "@/lib/prisma";
import EmbeddingService from "@/services/server/ai/EmbeddingService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { KnowledgeSourceType, SourceStatus } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await getServerSession(req, res, await authOptions(req));
    const { sourceId } = req.query;

    if (!sourceId || typeof sourceId !== "string") {
      return res.status(400).json(new APIResponse(false, 400, "Invalid source ID", {}));
    }

    const parentSources = await prisma.knowledgeSource.findMany({
      where: { parentSourceId: sourceId },
      select: { id: true },
    });

    // Delete embeddings for all parent sources in parallel
    await Promise.all(
      parentSources.map((parent) => EmbeddingService.deleteDocument(user?.tenant?.tenantId as string, parent.id))
    );

    // Delete embedding for the main source
    await EmbeddingService.deleteDocument(user?.tenant?.tenantId as string, sourceId);

    await prisma.$transaction([
      prisma.knowledgeSource.deleteMany({
        where: {
          parentSourceId: sourceId,
        },
      }),
      prisma.knowledgeSource.delete({
        where: {
          id: sourceId,
          tenantId: user?.tenant?.tenantId as string,
        },
      }),
    ]);

    // update the usage based on the size of the doc
    const sources = await prisma.knowledgeSource.findMany({
      where: {
        tenantId: user?.tenant?.tenantId as string,
        status: SourceStatus.ADDED,
        sourceType: {
          notIn: [KnowledgeSourceType.SITEMAP, KnowledgeSourceType.DOCS_WEB_URL],
        },
      },
      select: {
        metadata: true,
      },
    });

    return res.status(200).json(new APIResponse(true, 200, "Source deleted success from your chat knowledge ", {}));
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
