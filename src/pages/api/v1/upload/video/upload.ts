import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import path from "path";
import fs from "fs";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { UploadVideoObjectType } from "@/types/courses/Course";
import prisma from "@/lib/prisma";
import { createSlug, getFileExtension, mergeChunks, readFieldWithFile } from "@/lib/utils";
import { createTempDir } from "@/actions/checkTempDirExist";
import appConstant from "@/services/appConstant";

export const config = {
  api: {
    bodyParser: false,
  },
};
const cms = new ContentManagementService();

export const saveToDir = async (fullName: string, sourcePath: string, res: NextApiResponse) => {
  if (!createTempDir(process.env.MEDIA_UPLOAD_PATH, appConstant.mediaTempDir)) {
    return res.status(400).json({ success: false, error: "Environment variable MEDIA_UPLOAD_PATH is not set." });
  }

  const destinationPath = path.join(`${process.env.MEDIA_UPLOAD_PATH}/${appConstant.mediaTempDir}`, fullName);

  fs.copyFileSync(sourcePath, destinationPath);

  fs.unlinkSync(sourcePath);
  return destinationPath;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    if (files.file) {
      const name = fields.title[0].replaceAll(" ", "_");
      const objectId = Number(fields.objectId[0]);

      const objectType = fields.objectType[0] as UploadVideoObjectType;
      const extension = getFileExtension(files.file[0].originalFilename);
      const sourcePath = files.file[0].filepath;
      const currentTime = new Date().getTime();
      let fullName = ``;

      let needDeletion = false;
      let videoProviderId: string | undefined | null;

      const chunkIndex = Number(fields.chunkIndex[0]);
      const totalChunks = Number(fields.totalChunks[0]);
      fullName = `${name}.part${chunkIndex}.${extension}`;
      if (objectType == "course") {
        const trailerVideo = await prisma?.course.findUnique({
          where: {
            courseId: objectId,
          },
          select: {
            tvProviderId: true,
          },
        });
        videoProviderId = trailerVideo?.tvProviderId;
        needDeletion = typeof trailerVideo !== undefined || trailerVideo != null;
      } else if (objectType == "lesson") {
        const videoLesson = await prisma?.video.findUnique({
          where: {
            resourceId: objectId,
          },
          select: {
            providerVideoId: true,
          },
        });
        videoProviderId = videoLesson?.providerVideoId;
        needDeletion = typeof videoLesson !== undefined || videoLesson != null;
      }

      await saveToDir(fullName, sourcePath, res);
      // trailer videos
      const totalFile = fs
        .readdirSync(`${process.env.MEDIA_UPLOAD_PATH}/${appConstant.mediaTempDir}`)
        .filter((file) => file.startsWith(name));

      if (totalFile.length === totalChunks) {
        const mergedFinalFilePath = path.join(
          `${process.env.MEDIA_UPLOAD_PATH}/${appConstant.mediaTempDir}`,
          `${name}.${currentTime}.${extension}`
        );
        fullName = createSlug(name);
        await mergeChunks(name, totalChunks, extension, mergedFinalFilePath);

        const fileBuffer = await fs.promises.readFile(mergedFinalFilePath);

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
          if (needDeletion && videoProviderId) {
            const deletionResponse = await cms.deleteVideo(videoProviderId, objectId, objectType, serviceProvider);

            if (!deletionResponse.success && deletionResponse.statusCode !== 404) {
              throw new Error(`Unable to delete the video due to : ${deletionResponse.message}`);
            }
            if (fields.hasOwnProperty("existingFilePath")) {
              const deletionResponse = await cms.deleteFile(`${fields.existingFilePath[0]}`, serviceProvider);
              if (!deletionResponse.success && deletionResponse.statusCode !== 404) {
                throw new Error(`Unable to delete the file due to : ${deletionResponse.message}`);
              }
            }
          }
          const uploadResponse = await cms.uploadVideo(fullName, fileBuffer, serviceProvider, objectId, objectType);
          if (mergedFinalFilePath != "") {
            console.log(`deleting the file - ${mergedFinalFilePath}`);
            fs.unlinkSync(mergedFinalFilePath);
          } else {
            console.log(`unable to delete video : ${mergedFinalFilePath} . response ${uploadResponse?.statusCode}`);
          }
          return res.status(uploadResponse?.statusCode || 200).json({ ...uploadResponse });
        } else {
          throw new Error("No Media Provder has been configured");
        }
      }

      if (totalFile.length < totalChunks) {
        res.status(200).json({ success: false, message: "uploading" });
      }
    }

    if (!files) {
      return res.status(400).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {
    console.log(error, "error");
    return res.status(400).json({ success: false, message: `${error}` });
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
