import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { createSlug, getFileExtension } from "@/lib/utils";
import fs from "fs";
import { uploadThumbnail } from "@/actions/courses";
import { APIResponse } from "@/types/apis";
import { FileObjectType } from "@/types/cms/common";
import { readFieldWithSingleFile } from "@/lib/upload/utils";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import appConstant from "@/services/appConstant";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Updates an existing course based on the provided course Id, and upload the thumbnail if file has been uploaded
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithSingleFile(req)) as any;

    const body = JSON.parse(fields.course[0]);
    const name = createSlug(body.name);
    let courseId = Number(body.courseId);

    const existingCourse = await prisma.course.findUnique({
      where: {
        courseId: body.courseId,
      },
      select: {
        tvThumbnail: true,
        tvProviderId: true,
      },
    });

    if (existingCourse) {
      //need to update
      let trailerThumbnail = existingCourse.tvThumbnail;

      //first check if new thumbnail has been uploaded
      if (files.file && files.file.length > 0) {
        //Make sure the trailer video provider Id exists
        if (existingCourse.tvProviderId) {
          const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
          const cmsConfig = (await cms.getCMSConfig()).body?.config;

          if (existingCourse.tvThumbnail) {
            //delete the existing thumbnail
            console.log(`deleting the thumnail: ${existingCourse.tvThumbnail}`);
            await cms.deleteCDNImage(cmsConfig, existingCourse.tvThumbnail);
          }

          const extension = getFileExtension(files.file[0].originalFilename);
          const sourcePath = files.file[0].filepath;
          const fileBuffer = await fs.promises.readFile(`${sourcePath}`);
          //now upload the image
          const newThumbnailResponse = await cms.uploadVideoThumbnail(
            cmsConfig,
            fileBuffer,
            extension,
            existingCourse.tvProviderId,
            courseId,
            "course"
          );
          console.log(newThumbnailResponse);
          if (newThumbnailResponse.success && newThumbnailResponse.body) {
            console.log(`New thumbnail: ${newThumbnailResponse.body}`);
            trailerThumbnail = newThumbnailResponse.body;
          }
        } else {
          throw new Error("Unable to upload the thumnail, due to missing trailer video details");
        }
      }

      await prisma.course.update({
        where: {
          courseId: Number(courseId),
        },
        data: {
          ...body,
          tvThumbnail: trailerThumbnail,
          slug: name,
        },
      });
      return res.status(200).json(new APIResponse(true, 200, `Course has been successfully updated`));
    } else {
      return res.status(404).json({ success: false, error: "Course not found" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
