import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import fs from "fs";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import prisma from "@/lib/prisma";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { readFieldWithFile, saveToLocal } from "@/lib/upload/utils";

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
      const name = fields.title[0].replaceAll(" ", "_");
      const dir = fields.dir[0];
      const fileType = fields.hasOwnProperty("fileType") && fields.fileType[0];

      const extension = getFileExtension(files.file[0].originalFilename);
      const sourcePath = files.file[0].filepath;
      const currentTime = new Date().getTime();
      const fullName = `${name.replace(/\s+/g, "-")}-${currentTime}.${extension}`;
      const bannerPath = `${dir}${fullName}`;

      const localPath = await saveToLocal(fullName, sourcePath);

      const fileBuffer = await fs.promises.readFile(`${localPath}`);

      const serviceProviderResponse = await prisma?.serviceProvider.findFirst({
        where: {
          service_type: "media",
        },
      });
      if (serviceProviderResponse) {
        const serviceProvider = cms.getServiceProvider(
          serviceProviderResponse?.provider_name,
          serviceProviderResponse?.providerDetail
        );

        if (fields.hasOwnProperty("existingFilePath")) {
          const deletionResponse = await cms.deleteFile(`${fields.existingFilePath[0]}`, serviceProvider);
          if (!deletionResponse.success && deletionResponse.statusCode !== 404) {
            throw new Error(`Unable to delete the file due to : ${deletionResponse.message}`);
          }
        }

        const uploadResponse = await cms.uploadFile(fullName, fileBuffer, bannerPath, serviceProvider);
        if (fileType === "thumbnail") {
          await prisma.video
            .update({
              where: {
                id: Number(fields.videoId[0]),
              },
              data: {
                thumbnail: uploadResponse.fileCDNPath,
              },
            })
            .then(async (result) => {
              const videoThumbnailResponse = await cms.uploadVideoThumbnail(
                uploadResponse.fileCDNPath,
                `${fields.providerVideoId[0]}`,
                serviceProvider
              );
              if (!videoThumbnailResponse.success && videoThumbnailResponse.statusCode !== 404) {
                throw new Error(`Unable to upload the file due to : ${videoThumbnailResponse.message}`);
              }
            });
        }
        if (localPath != "") {
          fs.unlinkSync(`${localPath}`);
        }

        const findVideoState =
          fields.hasOwnProperty("videoId") &&
          (await prisma.video.findUnique({
            where: {
              id: Number(fields.videoId[0]),
            },
            select: {
              state: true,
            },
          }));

        return res
          .status(uploadResponse?.statusCode || 200)
          .json({ ...uploadResponse, videoState: findVideoState?.state });
      } else {
        throw new Error("No Media Provder has been configured");
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
