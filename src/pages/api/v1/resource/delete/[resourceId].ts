import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import appConstant from "@/services/appConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { resourceId, courseId } = req.query;
    const findResource = await prisma.resource.findUnique({
      where: {
        resourceId: Number(resourceId),
      },
    });

    if (findResource) {
      const videoLesson = await prisma.video.findUnique({
        where: {
          resourceId: Number(resourceId),
        },
        select: {
          providerVideoId: true,
        },
      });
      if (videoLesson) {
        if (videoLesson.providerVideoId != null) {
          const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
          const cmsConfig = (await cms.getCMSConfig()).body?.config;

          await cms.deleteVideo(cmsConfig, videoLesson.providerVideoId, Number(resourceId), "lesson");
        }
        const [updateSeq, deleteResource] = await prisma.$transaction([
          prisma.$executeRaw`UPDATE Resource SET sequenceId = sequenceId - 1  WHERE sequenceId > ${findResource.sequenceId}  AND  chapterId = ${findResource.chapterId};`,
          prisma.resource.delete({
            where: {
              resourceId: Number(resourceId),
            },
          }),
        ]);
      }
      if (!videoLesson) {
        const [updateSeq, deleteResource] = await prisma.$transaction([
          prisma.$executeRaw`UPDATE Resource SET sequenceId = sequenceId - 1  WHERE sequenceId > ${findResource.sequenceId}  AND  chapterId = ${findResource.chapterId};`,
          prisma.resource.delete({
            where: {
              resourceId: Number(resourceId),
            },
          }),
        ]);
      }

      if (findResource.state == "ACTIVE") {
        const totalCourseLessons = await prisma.course.findUnique({
          where: {
            courseId: Number(courseId),
          },
        });
        const updateCourse = await prisma.course.update({
          where: {
            courseId: Number(courseId),
          },
          data: {
            totalResources: totalCourseLessons?.totalResources && totalCourseLessons?.totalResources - 1,
          },
        });
      }

      return res.status(200).json({
        info: false,
        success: true,
        message: "Lesson has been deleted",
      });
    } else {
      return res.status(404).json({
        info: false,
        success: false,
        message: "Resource not found",
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));
