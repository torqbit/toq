import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";
import { APIResponse } from "@/types/apis";
import { KnowledgeSourceType, SourceStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { page = 1, limit = 10, search, statusfilter } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const session = await getServerSession(req, res, await authOptions(req));

    const whereClause: any = {
      tenantId: session?.tenant?.tenantId,
      parentSourceId: null,
    };

    if (search) {
      whereClause.OR = [{ title: { contains: search as string, mode: "insensitive" } }];
    }

    if (statusfilter) {
      whereClause.status = statusfilter as string;
    }
    const totalSourceList = await prisma.knowledgeSource.count({
      where: whereClause,
    });

    const sourceList = await prisma.knowledgeSource.findMany({
      where: { ...whereClause },
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: "asc",
      },
    });

    const enhancedSourceList = await Promise.all(
      sourceList.map(async (source) => {
        // add the where clause with metadata is not null
        const isAddedAnySource = await prisma.knowledgeSource.findMany({
          where: {
            OR: [{ parentSourceId: source.id }, { id: source.id }],
            status: SourceStatus.ADDED,
            sourceType: {
              notIn: [KnowledgeSourceType.SITEMAP, KnowledgeSourceType.DOCS_WEB_URL],
            },
          },
          select: {
            id: true,
            metadata: true,
          },
        });
        return {
          ...source,
          addedLinks: isAddedAnySource?.length,
          totalLinks: await prisma.knowledgeSource.count({
            where: {
              OR: [{ parentSourceId: source.id }, { id: source.id }],
            },
          }),
          sourceSize: isAddedAnySource.reduce((acc, curr: any) => {
            return acc + (curr.metadata?.sizeInBytes || 0);
          }, 0),
        };
      })
    );

    //get the current usage of the tenant

    return res
      .status(200)
      .json(new APIResponse(true, 200, "AI chat source", { sourceList: enhancedSourceList, totalSourceList }));
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withTenantOwnerAuthorized(handler));
