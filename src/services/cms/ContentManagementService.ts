import { BasicAPIResponse, FileUploadResponse, UploadVideoObjectType, VideoAPIResponse, VideoInfo } from "@/types/courses/Course";
import { BunnyConfig, BunnyMediaProvider } from "./BunnyMediaProvider";
import prisma from "@/lib/prisma";
import { VideoState } from "@prisma/client";
import { IContentProvider } from "./IContentProvider";
import { BunnyCMS } from "./bunny/BunnyCMS";

export interface ContentServiceProvider {
  name: string;
  uploadVideo(title: string, file: Buffer): Promise<VideoAPIResponse>;
  trackVideo(videoInfo: VideoInfo, onCompletion: (videoLen: number) => Promise<string>): Promise<string>;
  uploadFile(name: string, file: Buffer, bannerPath: string): Promise<FileUploadResponse>;
  deleteVideo(videoProviderId: string): Promise<BasicAPIResponse>;
  deleteFile(filePath: string): Promise<BasicAPIResponse>;
  uploadVideoThumbnail(thumbnail: string, videoId: string): Promise<BasicAPIResponse>;
  uploadThumbnailToCdn(thumbnail: string): Promise<string | undefined>;
}

export class ContentManagementService {
  getCMS = (name: string): IContentProvider<any, any> => {
    return new BunnyCMS();
  };
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

  uploadThumbnailToCdn = async (thumbnail: string, csp: ContentServiceProvider): Promise<string | undefined> => {
    return csp.uploadThumbnailToCdn(thumbnail);
  };

  uploadVideoThumbnail = async (thumbnail: string, videoId: string, csp: ContentServiceProvider): Promise<BasicAPIResponse> => {
    return csp.uploadVideoThumbnail(thumbnail, videoId);
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
        let thumbnail = newVideo.thumbnail;

        const uploadResponse = await csp.uploadThumbnailToCdn(thumbnail);
        if (uploadResponse) {
          thumbnail = uploadResponse;
        } else {
          const getExistingVideoThumbnail = await prisma.video.findUnique({
            where: {
              id: newVideo.id,
            },
            select: {
              thumbnail: true,
            },
          });
          thumbnail = String(getExistingVideoThumbnail?.thumbnail);
        }

        const updatedVideo = prisma.video.update({
          where: {
            id: newVideo.id,
          },
          data: {
            state: VideoState.READY,
            videoDuration: videoLen,
            thumbnail: thumbnail,
          },
        });
        const r = await updatedVideo;
        return r.state;
      });
      return { ...videoResponse, video: { ...videoResponse.video, id: Number(newVideo.id) } };
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
          tvState: VideoState.PROCESSING,
          tvThumbnail: videoResponse.video.thumbnail,
        },
      });
      csp.trackVideo(videoResponse.video, async () => {
        const updatedVideo = prisma.course.update({
          where: {
            courseId: id,
          },
          data: {
            tvState: VideoState.READY,
          },
        });
        const r = await updatedVideo;
        return r.state;
      });
      return videoResponse;
    }
    return videoResponse;
  };

  uploadFile = (fileName: string, file: Buffer, path: string, csp: ContentServiceProvider) => {
    return csp.uploadFile(fileName, file, path);
  };

  deleteVideo = async (videoProviderId: string, objectId: number, objectType: UploadVideoObjectType, csp: ContentServiceProvider) => {
    const deleteResponse = await csp.deleteVideo(videoProviderId);
    if ((deleteResponse.success || deleteResponse.statusCode === 404) && objectType == "lesson") {
      const videoDel = await prisma.video.delete({
        where: {
          resourceId: objectId,
          providerVideoId: videoProviderId,
        },
      });
    } else if ((deleteResponse.success || deleteResponse.statusCode === 404) && objectType == "course") {
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
