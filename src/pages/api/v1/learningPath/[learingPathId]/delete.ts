import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import appConstant from "@/services/appConstant";
import { ProductType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { learingPathId } = req.query;
    const findLearingPath = await prisma.learningPath.findUnique({
      where: {
        id: Number(learingPathId),
      },
      select: {
        banner: true,
        id: true,
      },
    });

    if (findLearingPath) {
      const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
      const cmsConfig = (await cms.getCMSConfig()).body?.config;

      findLearingPath.banner && (await cms.deleteCDNImage(cmsConfig, findLearingPath.banner));

      await prisma.product.delete({
        where: {
          productId: findLearingPath.id,
          ptype: ProductType.LEARNING_PATH,
        },
      });
      return res.status(200).json({
        info: false,
        success: true,
        message: "Learing path been deleted.",
      });
    } else {
      return res.status(404).json({ success: false, error: "Learing path already deleted or not found" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));
