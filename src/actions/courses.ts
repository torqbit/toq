import { createSlug, getFileExtension } from "@/lib/utils";
import appConstant from "@/services/appConstant";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { APIResponse } from "@/types/apis";
import { FileObjectType, StaticFileCategory, VideoObjectType } from "@/types/cms/common";
import fs from "fs";
import os from "os";
import prisma from "@/lib/prisma";
import path from "path";
import { IChapterView, ICourseDetailView, ILessonView, VideoAPIResponse } from "@/types/courses/Course";
import { mergeChunks, saveToLocal } from "@/lib/upload/utils";
import { courseDifficultyType, ResourceContentType } from "@prisma/client";

export const uploadThumbnail = async (
  file: any,
  name: string,
  objectType: FileObjectType,
  fileType: StaticFileCategory,
  existingFilePath?: string
): Promise<APIResponse<any>> => {
  if (file) {
    let response: APIResponse<any>;
    const extension = getFileExtension(file.originalFilename);
    const sourcePath = file.filepath;
    const currentTime = new Date().getTime();
    const fullName = `${name}-${currentTime}.${extension}`;
    const fileBuffer = await fs.promises.readFile(`${sourcePath}`);
    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    if (cmsConfig) {
      // deleting thumbnail

      if (existingFilePath) {
        await cms.deleteCDNImage(cmsConfig, existingFilePath);
      }
      // upload thumbnail
      response = await cms.uploadCDNImage(cmsConfig, fileBuffer, objectType, fullName, fileType);
      console.log(response, "thumbnail upload response");
      return response;
    } else {
      return new APIResponse(false, 400, "CMS configuration was not found");
    }
  } else {
    return new APIResponse(false, 400, "File is missing");
  }
};

export const uploadArchive = async (
  file: any,
  name: string,
  objectType: FileObjectType,
  fileType: StaticFileCategory,
  existingFilePath?: string
): Promise<APIResponse<any>> => {
  if (file) {
    let response: APIResponse<any>;
    const extension = getFileExtension(file.originalFilename);
    const sourcePath = file.filepath;
    const currentTime = new Date().getTime();
    const fullName = `${name}-${currentTime}.${extension}`;
    const fileBuffer = await fs.promises.readFile(`${sourcePath}`);
    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    if (cmsConfig) {
      // deleting thumbnail

      if (existingFilePath) {
        await cms.deleteCDNImage(cmsConfig, existingFilePath);
      }
      // upload thumbnail
      response = await cms.uploadPrivateFile(cmsConfig, fileBuffer, objectType, fullName, fileType);
      return response;
    } else {
      return new APIResponse(false, 400, "CMS configuration was not found");
    }
  } else {
    return new APIResponse(false, 400, "File is missing");
  }
};

export const uploadVideo = async (
  file: any,
  name: string,
  objectId: number,
  objectType: VideoObjectType,
  chunkIndex: number,
  totalChunks: number
): Promise<APIResponse<VideoAPIResponse>> => {
  if (file) {
    let response: APIResponse<any>;
    const extension = getFileExtension(file.originalFilename);
    const sourcePath = file.filepath;
    const currentTime = new Date().getTime();
    let fullName = `${name}.part${chunkIndex}.${extension}`;
    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    let needDeletion = false;
    let videoProviderId: string | undefined | null;

    await saveToLocal(fullName, sourcePath);

    const homeDir = os.homedir();

    const localDirPath = path.join(homeDir, `${appConstant.homeDirName}/${appConstant.staticFileDirName}`);

    const totalFile = fs.readdirSync(localDirPath).filter((file) => file.startsWith(name));
    if (totalFile.length === totalChunks) {
      const mergedFinalFilePath = path.join(localDirPath, `${name}.${currentTime}.${extension}`);
      fullName = createSlug(name);
      await mergeChunks(name, totalChunks, extension, mergedFinalFilePath);
      const fileBuffer = await fs.promises.readFile(mergedFinalFilePath);
      if (objectType == "course") {
        const trailerVideo = await prisma.course.findUnique({
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
      if (cmsConfig) {
        if (needDeletion && videoProviderId) {
          await cms.deleteVideo(cmsConfig, videoProviderId, objectId, objectType);
        }
        response = await cms.uploadVideo(cmsConfig, fileBuffer, fullName, objectType, objectId);
        if (mergedFinalFilePath != "") {
          fs.unlinkSync(mergedFinalFilePath);
        }
        return new APIResponse(response.success, response.status, response.message, response.body);
      } else {
        return new APIResponse(false, 404, "Video storage configuration was not found");
      }
    } else {
      return new APIResponse(false, 200, "uploading");
    }
  } else {
    return new APIResponse(false, 404, "File is missing");
  }
};

export const getCourseDetailedView = async (courseId: number): Promise<APIResponse<ICourseDetailView>> => {

  const courseDBDetails = await prisma.course.findUnique({
    select: {
      name: true,
      description: true,
      expiryInDays: true,
      tvUrl: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      state: true,
      chapters: {
        select: {
          name: true,
          description: true,
          resource: {
            select: {
              name: true,
              description: true,
              state: true,
              video: {
                select: {
                  videoDuration: true,
                  resourceId: true,
                },
              },
              assignment: {
                select: {
                  estimatedDuration: true,
                },
              },
            },
          },
        },
      },

      difficultyLevel: true,
      courseType: true,
      coursePrice: true,
    },
    where: {
      courseId: Number(courseId),
    },
  });

  if (courseDBDetails) {
    let contentDurationInHrs = 0;
    let assignmentCount = 0;
    const lessons = courseDBDetails.chapters.flatMap((c) => c.resource);
    lessons.forEach((l) => {
      if (l.assignment && l.assignment.estimatedDuration) {
        assignmentCount++;
        contentDurationInHrs += Number((l.assignment.estimatedDuration / 60).toFixed(1));
      } else if (l.video && l.video.videoDuration) {
        contentDurationInHrs += Number((l.video.videoDuration / 3600).toFixed(1));
      }
    });

    let chapters: IChapterView[] = courseDBDetails.chapters.map((c) => {
      const lessons: ILessonView[] = c.resource.map((l) => {
        if (l.assignment && l.assignment.estimatedDuration) {
          return {
            name: l.name,
            description: l.description || "",
            state: l.state,
            lessonType: ResourceContentType.Assignment,
            durationInMins: l.assignment.estimatedDuration,
          };
        } else {
          return {
            name: l.name,
            description: l.description || "",
            state: l.state,
            lessonType: ResourceContentType.Assignment,
            durationInMins: Number((l?.video?.videoDuration || 0 / 60).toFixed(1)),
          };
        }
      });
      return {
        name: c.name,
        description: c.description || "",
        lessons: lessons,
      };
    });

    const courseDetailedView: ICourseDetailView = {
      name: courseDBDetails.name,
      description: courseDBDetails.description,
      state: courseDBDetails.state,
      expiryInDays: courseDBDetails.expiryInDays,
      difficultyLevel: courseDBDetails.difficultyLevel || courseDifficultyType.Beginner,
      chapters: chapters,
      trailerEmbedUrl: courseDBDetails.tvUrl || undefined,
      author: {
        name: courseDBDetails.user.name,
        imageUrl: courseDBDetails.user.image || undefined,
        designation: `Software engineer`,
      },
      pricing: {
        amount: courseDBDetails.coursePrice || 0,
        currency: "INR",
      },
      contentDurationInHrs: contentDurationInHrs,
      assignmentsCount: assignmentCount,
    };

    return new APIResponse(true, 200, `Succesfully fetched course detailed view`, courseDetailedView);
  } else return new APIResponse(true, 200, `Succesfully fetched course detailed view`);


}
