import { ContentServiceProvider } from "./ContentManagementService";
import { FileUploadResponse, VideoAPIResponse } from "@/types/courses/Course";
export type GetVideo = {
  guid: string;
  libraryId: number;
};
export type BunnyConfig = {
  accessKey: string;
  libraryId: string;
  streamCDNHostname: string;
  storagePassword: string;
  storageZone: string;
  connectedCDNHostname: string;
  mediaPath: string;
};

type BunnyVideoAPIResponse = {
  videoLibraryId: number;
  guid: string;
  title: string;
  dateUploaded: Date;
  views: number;
  isPublic: boolean;
  length: number;
  status: string;
  thumbnailFileName: string;
};
export class BunnyMediaProvider implements ContentServiceProvider {
  accessKey: string;
  libraryId: string;
  streamCDNHostname: string;
  storagePassword: string;
  storageZone: string;
  mediaPath: string;
  connectedCDNHostname: string;

  constructor(
    accessKey: string,
    libraryId: string,
    streamCDNHostname: string,
    storagePassword: string,
    connectedCDNHostname: string,
    storageZone: string,
    mediaPath: string
  ) {
    this.accessKey = accessKey;
    this.libraryId = libraryId;
    this.streamCDNHostname = streamCDNHostname;
    this.storageZone = storageZone;
    this.storagePassword = storagePassword;
    this.connectedCDNHostname = connectedCDNHostname;
    this.mediaPath = mediaPath;
  }

  createVideoUrl(key: string) {
    return `https://video.bunnycdn.com/library/${key}/videos`;
  }

  getUploadUrl(id: string, libId: string) {
    return `https://video.bunnycdn.com/library/${libId}/videos/${id}`;
  }
  getVideoUrl(id: string, libId: string) {
    return `https://video.bunnycdn.com/library/${libId}/videos/${id}`;
  }

  getUploadFileUrl(file: string) {
    let path = this.mediaPath;
    if (path.endsWith("/")) {
      path = path.substring(0, path.length - 1);
    }
    return `https://storage.bunnycdn.com/${this.storageZone}/${path}/${file}`;
  }

  delay(time: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, time * 1000));
  }

  getPostOption(title: string, key: string) {
    return {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: key as string,
      },
      body: JSON.stringify({ title: title }),
    };
  }
  getUploadOption(file: Buffer, key: string) {
    console.log({ headers: { accept: "application/json", AccessKey: key } });
    return {
      method: "PUT",
      headers: { accept: "application/json", AccessKey: key },
      body: file,
    };
  }

  getVideoOption(key: string) {
    return {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: key as string,
      },
    };
  }

  async tryNTimes<T>(toTry: () => Promise<Response>, times: number, interval: number): Promise<any> {
    if (times < 1) throw new Error(`Bad argument: 'times' must be greater than 0, but ${times} was received.`);
    let attemptCount: number;
    for (attemptCount = 1; attemptCount <= times; attemptCount++) {
      let error: boolean = false;
      const result = await toTry();
      let vresult = await result.json();
      console.log(`video progress status: ${vresult.status}`);

      if (vresult.status != 4) {
        if (attemptCount < times) await this.delay(interval);
        else return Promise.reject(result);
      } else return result;
    }
  }

  async uploadVideo(title: string, file: Buffer, courseId: number, chapterId: number): Promise<VideoAPIResponse> {
    let guid: string;
    const res = await fetch(this.createVideoUrl(this.libraryId), this.getPostOption(title, this.accessKey));
    const json = await res.json();
    guid = json.guid;
    const res_1 = await fetch(this.getUploadUrl(json.guid, this.libraryId), this.getUploadOption(file, this.accessKey));
    const uploadedData = await res_1.json();
    const videoResult = await fetch(this.getVideoUrl(guid, this.libraryId), this.getVideoOption(this.accessKey));
    let videoData = await videoResult.json();

    return {
      statusCode: videoResult.status,
      success: videoResult.status == 200,
      message: videoResult.statusText,
      video: {
        videoId: videoData.guid as string,
        thumbnail: `https://${this.streamCDNHostname}/${videoData.guid}/${videoData.thumbnailFileName}`,
        previewUrl: `https://${this.streamCDNHostname}/${videoData.guid}/preview.webp`,
        videoUrl: `https://iframe.mediadelivery.net/play/${this.libraryId}/${videoData.guid}`,
      },
    };
  }

  uploadFile(
    name: string,
    file: Buffer,
    courseId: number,
    chapterId?: number | undefined
  ): Promise<FileUploadResponse> {
    let uploadFileUrl = this.getUploadFileUrl(name);
    console.log(uploadFileUrl, "upload file url");
    return fetch(uploadFileUrl, this.getUploadOption(file, this.storagePassword))
      .then((res) => {
        return res.json();
      })
      .then((uploadRes: any) => {
        console.log(uploadRes);
        return {
          statusCode: uploadRes.HttpCode,
          message: uploadRes.Message,
          success: uploadRes.HttpCode == 201,
          fileCDNPath:
            uploadRes.HttpCode == 201 ? `https://${this.connectedCDNHostname}/${this.mediaPath}/${name}` : "",
        };
      });
  }
}
