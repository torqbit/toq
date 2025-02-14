import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import fs from "fs";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import prisma from "@/lib/prisma";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { readFieldWithFile, saveToLocal } from "@/lib/upload/utils";
import { ServiceType } from "@prisma/client";
import appConstant from "@/services/appConstant";

export const config = {
  api: {
    bodyParser: false,
  },
};
const cms = new ContentManagementService();
export function getFileExtension(fileName: string) {
  const parts = fileName.split(".");

  const extension = parts[parts.length - 1];

  return extension.toLowerCase();
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;

    if (files.file) {
      if (fields.hasOwnProperty("videoId")) {
        const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
        const cmsConfig = (await cms.getCMSConfig()).body?.config;

        if (fields.hasOwnProperty("existingFilePath")) {
          //delete the existing thumbnail
          await cms.deleteCDNImage(cmsConfig, fields.existingFilePath[0]);
        }

        const extension = getFileExtension(files.file[0].originalFilename);
        const sourcePath = files.file[0].filepath;
        const fileBuffer = await fs.promises.readFile(`${sourcePath}`);
        //now upload the image
        const newThumbnailResponse = await cms.uploadVideoThumbnail(
          cmsConfig,
          fileBuffer,
          extension,
          fields.providerVideoId[0],
          Number(fields.videoId[0]),
          "lesson"
        );

        if (newThumbnailResponse.success && newThumbnailResponse.body) {
          const trailerThumbnail = newThumbnailResponse.body;
          await prisma.video.update({
            where: {
              id: Number(fields.videoId[0]),
            },
            data: {
              thumbnail: trailerThumbnail,
            },
          });
          return res.status(200).json({
            success: true,
            message: "Thumbnail has been successfully uploaded",
            fileCDNPath: trailerThumbnail,
          });
        } else {
          throw new Error("Unable to upload the thumnail, due to missing trailer video details");
        }
      }
    }

    if (!files) {
      return res.status(400).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: `${error}` });
  }
};

export default withMethods(["POST"], withAuthentication(handler));
