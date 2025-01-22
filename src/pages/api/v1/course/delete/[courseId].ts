import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import appConstant from "@/services/appConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    const findCourse = await prisma.course.findUnique({
      where: {
        courseId: Number(courseId),
      },
    });

    if (findCourse) {
      const result: any =
        await prisma.$queryRaw`SELECT COUNT(r.resourceId) > 0 AS resourceCount FROM Resource r JOIN Chapter c ON c.chapterId = r.chapterId
      JOIN Course co ON c.courseId = co.courseId WHERE co.courseId = ${Number(courseId)}`;
      const totalCount = Number(result[0].resourceCount);
      if (totalCount > 0) {
        return res.status(400).json({
          info: false,
          success: false,
          error: "You need to delete the existing lessons, before deleting the course",
        });
      } else {
        const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
        const cmsConfig = (await cms.getCMSConfig()).body?.config;
        findCourse.tvThumbnail && (await cms.deleteCDNImage(cmsConfig, findCourse.tvThumbnail));
        findCourse.tvProviderId &&
          (await cms.deleteVideo(cmsConfig, findCourse.tvProviderId, findCourse.courseId, "course"));
      }

      await prisma.course.delete({
        where: {
          courseId: Number(courseId),
        },
      });
      return res.status(200).json({
        info: false,
        success: true,
        message: "Course has been deleted.",
      });
    } else {
      return res.status(404).json({ success: false, error: "Course already deleted or not found" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));
