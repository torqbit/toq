import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { Role } from "@prisma/client";
import appConstant from "@/services/appConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const { blogId } = req.query;

    const isBlogExist = await prisma.blog.findUnique({
      where: {
        id: String(blogId),
      },
      select: {
        banner: true,
        authorId: true,
        contentType: true,
      },
    });

    if (isBlogExist) {
      let contentType = isBlogExist.contentType;

      if (token?.id === isBlogExist?.authorId || token?.role === Role.ADMIN) {
        if (isBlogExist.banner) {
          const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
          const cmsConfig = (await cms.getCMSConfig()).body?.config;
          await cms.deleteCDNImage(cmsConfig, isBlogExist.banner);
        }
        await prisma.blog.delete({
          where: {
            id: String(blogId),
            authorId: isBlogExist.authorId,
          },
        });

        return res
          .status(200)
          .json({
            success: true,
            message: contentType === "BLOG" ? "Blog has been deleted" : "Update has been deleted",
          });
      } else {
        return res.status(403).json({ success: false, error: "You are not authorized" });
      }
    } else {
      return res.status(400).json({ success: false, error: "Blog not exist" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withUserAuthorized(handler));
