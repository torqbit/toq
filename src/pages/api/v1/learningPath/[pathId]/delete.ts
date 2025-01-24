import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import appConstant from "@/services/appConstant";
import { ProductType } from "@prisma/client";
import { APIResponse } from "@/types/apis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { pathId } = req.query;
    const findLearningPath = await prisma.learningPath.findUnique({
      where: {
        id: Number(pathId),
      },
      select: {
        banner: true,
        id: true,
      },
    });

    if (findLearningPath) {
      const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
      const cmsConfig = (await cms.getCMSConfig()).body?.config;

      findLearningPath.banner && (await cms.deleteCDNImage(cmsConfig, findLearningPath.banner));

      await prisma.product.delete({
        where: {
          productId: findLearningPath.id,
          ptype: ProductType.LEARNING_PATH,
        },
      });
      return res.status(200).json(new APIResponse(true, 200, "Learning path has been deleted."));
    } else {
      return res.status(404).json(new APIResponse(false, 404, "Learning path has been already deleted or not found."));
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));
