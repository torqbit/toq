import {
  BasicAPIResponse,
  FileUploadResponse,
  UploadVideoObjectType,
  VideoAPIResponse,
  VideoInfo,
} from "@/types/courses/Course";
import { BunnyConfig, BunnyMediaProvider, GetVideo } from "./BunnyMediaProvider";
import prisma from "@/lib/prisma";
import { VideoState } from "@prisma/client";

export interface ContentServiceProvider {
  name: string;
  uploadVideo(title: string, file: Buffer): Promise<VideoAPIResponse>;
  trackVideo(videoInfo: VideoInfo, onCompletion: (videoLen: number) => Promise<string>): Promise<string>;
  uploadFile(name: string, file: Buffer, bannerPath: string): Promise<FileUploadResponse>;
  deleteVideo(videoProviderId: string): Promise<BasicAPIResponse>;
  deleteFile(filePath: string): Promise<BasicAPIResponse>;
}

export class ContentManagementService {
  getServiceProvider = (name: string, config: any): ContentServiceProvider => {
    switch (name) {
      case "bunny":
        let c = config as BunnyConfig;
        return new BunnyMediaProvider(
          c.accessKey,
          c.libraryId,
          c.streamCDNHostname,
          c.storagePassword,
          c.connectedCDNHostname,
          c.storageZone,
          c.mediaPath
        );

      default:
        throw new Error("something went wrong");
    }
  };

  uploadVideo = async (
    title: string,
    file: Buffer,
    csp: ContentServiceProvider,
    id: number,
    objectType: UploadVideoObjectType
  ): Promise<VideoAPIResponse> => {
    const videoResponse = await csp.uploadVideo(title, file);
    if (objectType == "lesson") {
      const newVideo = await prisma.video.create({
        data: {
          videoDuration: videoResponse.video.videoDuration,
          videoUrl: videoResponse.video.videoUrl,
          providerVideoId: videoResponse.video.videoId,
          thumbnail: videoResponse.video.thumbnail,
          resourceId: id,
          state: videoResponse.video.state as VideoState,
          mediaProvider: csp.name,
        },
      });
      csp.trackVideo(videoResponse.video, async (videoLen: number) => {
        const updatedVideo = prisma.video.update({
          where: {
            id: newVideo.id,
          },
          data: {
            state: "READY",
            videoDuration: videoLen,
          },
        });
        const r = await updatedVideo;
        return r.state;
      });
    }
    if (objectType == "course") {
      await prisma.course.update({
        where: {
          courseId: id,
        },
        data: {
          tvProviderId: videoResponse.video.videoId,
          tvProviderName: csp.name,
          tvUrl: videoResponse.video.videoUrl,
          tvState: "PROCESSING",
          tvThumbnail: videoResponse.video.thumbnail,
        },
      });
      csp.trackVideo(videoResponse.video, async () => {
        const updatedVideo = prisma.course.update({
          where: {
            courseId: id,
          },
          data: {
            tvState: "READY",
          },
        });
        const r = await updatedVideo;
        return r.state;
      });
    }
    return videoResponse;
  };

  uploadFile = (fileName: string, file: Buffer, path: string, csp: ContentServiceProvider) => {
    return csp.uploadFile(fileName, file, path);
  };

  deleteVideo = async (
    videoProviderId: string,
    objectId: number,
    objectType: UploadVideoObjectType,
    csp: ContentServiceProvider
  ) => {
    const deleteResponse = await csp.deleteVideo(videoProviderId);
    if (deleteResponse.success && objectType == "lesson") {
      const videoDel = await prisma.video.delete({
        where: {
          resourceId: objectId,
          providerVideoId: videoProviderId,
        },
      });
    } else if (deleteResponse.success && objectType == "course") {
      await prisma.course.update({
        where: {
          courseId: objectId,
        },
        data: {
          tvProviderId: undefined,
          tvProviderName: undefined,
          tvUrl: undefined,
          tvThumbnail: undefined,
          tvState: undefined,
        },
      });
    }
    return deleteResponse;
  };

  deleteFile = (filePath: string, csp: ContentServiceProvider) => {
    return csp.deleteFile(filePath);
  };
}
