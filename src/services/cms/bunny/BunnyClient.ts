import { createSlug } from "@/lib/utils";
import { apiConstants, APIResponse, APIServerError } from "@/types/apis";
import { BunnyRequestError, PullZone, StorageZone, VideoLibrary, VideoLibraryResponse } from "@/types/cms/bunny";
import { VideoInfo } from "@/types/courses/Course";
import { VideoState } from "@prisma/client";
import sharp from "sharp";
import { fetchImageBuffer } from "@/actions/fetchImageBuffer";
import url from "url";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export class BunnyClient {
  accessKey: string;
  vidLibraryUrl: string = "https://video.bunnycdn.com/library";
  constructor(accessKey: string) {
    this.accessKey = accessKey;
    this.vidLibraryUrl = this.vidLibraryUrl;
  }

  getClientHeaders = () => {
    return {
      accept: "application/json",
      "content-type": "application/json",
      AccessKey: this.accessKey,
    };
  };

  getClientFileOptions = (file: Buffer) => {
    return {
      method: "PUT",
      headers: { accept: "application/json", AccessKey: this.accessKey },
      body: file,
    };
  };

  getCDNbaseEndpoint = (region: string) => {
    if (region === "DE") {
      return `storage.bunnycdn.com`;
    } else {
      return `${region.toLowerCase()}.storage.bunnycdn.com`;
    }
  };

  async tryNTimes<T>(
    times: number,
    interval: number,
    toTry: () => Promise<Response>,
    onCompletion: (len: number) => Promise<string>
  ): Promise<any> {
    if (times < 1) throw new Error(`Bad argument: 'times' must be greater than 0, but ${times} was received.`);
    let attemptCount: number;
    for (attemptCount = 1; attemptCount <= times; attemptCount++) {
      try {
        const result = await toTry();
        let vresult = await result.json();
        if (vresult.status != 4) {
          if (attemptCount < times) await delay(interval * 1000);
          else return Promise.reject(result);
        } else {
          return onCompletion(vresult.length);
        }
      } catch (error) {
        console.log(`failed due to : ${error}`);
      }
    }
  }

  trackVideo(
    videoInfo: VideoInfo,
    libraryId: number,
    onCompletion: (videoLen: number) => Promise<string>
  ): Promise<string> {
    return this.tryNTimes(
      120,
      5,
      () => {
        return fetch(`${this.vidLibraryUrl}/${libraryId}/videos/${videoInfo.videoId}`, this.getClientVideoOption());
      },
      onCompletion
    );
  }

  async uploadThumbnailToCDN(
    thumbnail: string,
    linkedHostname: string,
    mainStorageRegion: string,
    zoneName: string
  ): Promise<string | undefined> {
    if (thumbnail.includes(linkedHostname)) {
      let fullName = thumbnail.split("/")[thumbnail.split("/").length - 1];
      const fileBuffer = await fetchImageBuffer(thumbnail);
      if (fileBuffer) {
        const uploadResponse = await this.uploadCDNImage(
          fileBuffer,
          `thumbnail/${fullName}`,
          zoneName,
          mainStorageRegion,
          linkedHostname
        );

        return uploadResponse.body;
      }
    }
  }

  updateVideoThumbnail = async (
    thumbnailUrl: string,
    libraryId: number,
    videoId: string
  ): Promise<APIResponse<string>> => {
    const res = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}/thumbnail?thumbnailUrl=${encodeURIComponent(
        thumbnailUrl
      )}`,
      this.getClientPostOptions("")
    );
    const uploadRes = await res.json();

    return new APIResponse(uploadRes.statusCode === 200, uploadRes.statusCode, uploadRes.Message, thumbnailUrl);
  };

  uploadVideo = async (
    file: Buffer,
    libraryId: number,
    title: string,
    linkedHostname: string
  ): Promise<APIResponse<VideoInfo>> => {
    let guid: string;
    const res = await fetch(`${this.vidLibraryUrl}/${libraryId}/videos`, this.getClientPostOptions(title));
    const json = await res.json();

    guid = json.guid;
    const res_1 = await fetch(`${this.vidLibraryUrl}/${libraryId}/videos/${guid}`, this.getClientFileOptions(file));
    const uploadedData = await res_1.json();

    const videoResult = await fetch(`${this.vidLibraryUrl}/${libraryId}/videos/${guid}`, this.getClientVideoOption());
    let videoData = await videoResult.json();

    let state: string = "";
    if (videoData.status === 0 || videoData.status === 1 || videoData.status === 2 || videoData.status === 3) {
      state = VideoState.PROCESSING;
    }
    if (videoData.status === 4) {
      state = VideoState.READY;
    }
    if (videoData.status === 5 || videoData.status === 6) {
      state = VideoState.FAILED;
    }

    return new APIResponse(videoResult.status == 200, videoResult.status, videoResult.statusText, {
      videoId: videoData.guid as string,
      thumbnail: `https://${linkedHostname}/${videoData.guid}/${videoData.thumbnailFileName}`,
      previewUrl: `https://${linkedHostname}/${videoData.guid}/preview.webp`,
      videoUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoData.guid}`,
      mediaProviderName: "bunny",
      state: state as VideoState,
      videoDuration: videoData.length,
    });
  };

  async deleteVideo(videoProviderId: string, libraryId: number): Promise<APIResponse<string>> {
    const deleteUrl = `${this.vidLibraryUrl}/${libraryId}/videos/${videoProviderId}`;
    const response = await fetch(deleteUrl, this.getDeleteOption());
    if (response.ok) {
      return new APIResponse(true, response.status, response.statusText);
    } else {
      return new APIResponse(false, response.status, response.statusText);
    }
  }

  getDeleteOption() {
    return {
      method: "DELETE",
      headers: { accept: "application/json", AccessKey: this.accessKey },
    };
  }

  uploadCDNImage = async (
    file: Buffer,
    path: string,
    zoneName: string,
    mainStorageRegion: string,
    linkedHostname: string
  ): Promise<APIResponse<string>> => {
    // Validate and sanitize inputs
    if (!this.isValidPath(path)) {
      return new APIResponse(false, 400, "Invalid path format");
    }

    if (!zoneName.match(/^[a-zA-Z0-9-]+$/)) {
      return new APIResponse(false, 400, "Invalid zone name format");
    }

    try {
      const res = await fetch(
        `https://${this.getCDNbaseEndpoint(mainStorageRegion)}/${zoneName}/${path}`,
        this.getClientFileOptions(file)
      );
      const uploadRes = await res.json();

      return new APIResponse(
        uploadRes.HttpCode == 201,
        uploadRes.HttpCode,
        uploadRes.Message,
        uploadRes.HttpCode == 201 ? `https://${linkedHostname}/${path}` : ""
      );
    } catch (error: any) {
      return new APIResponse(false, 500, error.message || "Failed to upload image");
    }
  };

  downloadPrivateFiles = async (
    filePath: string,
    linkedHostname: string,
    zoneName: string
  ): Promise<APIResponse<ArrayBuffer>> => {
    const parseUrl = filePath && url.parse(filePath);
    const existingPath = parseUrl && parseUrl.pathname;
    if (parseUrl) {
      return new Promise(async (resolve, reject) => {
        const downloadUrl = `https://storage.bunnycdn.com/${zoneName}/${existingPath}`;
        const response = await fetch(downloadUrl, this.getClientDownloadOption());
        await response
          .arrayBuffer()
          .then((r) => {
            resolve(new APIResponse(true, response.status, response.statusText, r));
          })
          .catch((error) => {
            resolve(new APIResponse(false, response.status, error));
          });
      });
    } else {
      return new APIResponse(false, 404, "file path is missing");
    }
  };

  deleteCDNImage = async (filePath: string, linkedHostname: string, zoneName: string): Promise<APIResponse<string>> => {
    const parseUrl = filePath && url.parse(filePath);
    const existingPath = parseUrl && parseUrl.pathname;
    if (parseUrl && parseUrl.host === linkedHostname && this.isValidPath(existingPath || "")) {
      const deleteUrl = `https://storage.bunnycdn.com/${zoneName}/${encodeURIComponent(existingPath || "")}`;
      const response = await fetch(deleteUrl, this.getDeleteOption());
      if (response.ok) {
        return new APIResponse(true, response.status, response.statusText);
      } else {
        return new APIResponse(false, response.status, response.statusText);
      }
    } else {
      return new APIResponse(
        false,
        200,
        "Ignoring the delete operation as image is not stored in this storage provider"
      );
    }
  };

  getClientPostOptions(title: string) {
    return {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: this.accessKey,
      },
      body: JSON.stringify({ title: title }),
    };
  }

  getClientVideoOption() {
    return {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: this.accessKey,
      },
    };
  }

  getClientDownloadOption() {
    return {
      method: "GET",
      headers: {
        accept: "application/octet-stream",
        AccessKey: this.accessKey,
      },
      responseType: "arraybuffer",
    };
  }

  handleError = async <T>(response: Response): Promise<APIResponse<T>> => {
    if (response.status == 400) {
      const reqError = (await response.json()) as BunnyRequestError;
      return new APIResponse(false, response.status, reqError.Message);
    } else {
      return new APIResponse(false, response.status, "Failed to get response from Bunny Server");
    }
  };

  getPullZoneDetails = async (pullZoneId: number): Promise<APIResponse<PullZone | undefined>> => {
    const url = `https://api.bunny.net/pullzone/${pullZoneId}?includeCertificate=false`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: this.accessKey,
      },
    };
    try {
      const result = await fetch(url, options);
      if (result.status == 200) {
        const pullZoneDetails = (await result.json()) as PullZone;
        return new APIResponse(true, result.status, `Successfully fetched the PullZone details`, pullZoneDetails);
      } else if (result.status >= 400) {
        const reqError = (await result.json()) as BunnyRequestError;
        return new APIResponse(
          false,
          result.status,
          `Failed to fetch the pull zone details, with error : ${reqError.Message}`
        );
      } else {
        return new APIResponse(false, result.status, "Failed to get response from Bunny Server");
      }
    } catch (err: any) {
      return new APIResponse(false, 400, err);
    }
  };

  listVideoLibraries = async () => {
    const url = "https://api.bunny.net/videolibrary?page=1&perPage=1000&includeAccessKey=false";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: this.accessKey,
      },
    };
    try {
      const result = await fetch(url, options);
      if (result.status == 200) {
        const vidLibs = (await result.json()) as VideoLibrary[];
        return { status: result.status, items: vidLibs } as VideoLibraryResponse;
      } else if (result.status >= 400) {
        const reqError = (await result.json()) as BunnyRequestError;
        return new APIServerError(reqError.Message, result.status);
      } else {
        return new APIServerError("Failed to get response from Bunny Server");
      }
    } catch (err: any) {
      return new APIServerError(err);
    }
  };

  createVideoLibrary = async (brandName: string, replicatedRegions: string[]): Promise<APIResponse<VideoLibrary>> => {
    const url = "https://api.bunny.net/videolibrary";
    const options = {
      method: "POST",
      headers: this.getClientHeaders(),
      body: JSON.stringify({ Name: `${createSlug(brandName)}--videos`, ReplicationRegions: replicatedRegions }),
    };
    try {
      const result = await fetch(url, options);
      if (result.status == 201) {
        const vidLib = (await result.json()) as VideoLibrary;
        return new APIResponse(true, result.status, apiConstants.successMessage, vidLib);
      } else {
        return this.handleError(result);
      }
    } catch (err: any) {
      return new APIResponse(false, err);
    }
  };

  updateVideoLibrary = async (
    libraryId: number,
    playerColor: string,
    resolutions: string[],
    watermarkUrl?: string
  ): Promise<APIResponse<void>> => {
    const url = `https://api.bunny.net/videolibrary/${libraryId}`;
    let objectParams: any = {
      PlayerKeyColor: playerColor,
      EnabledResolutions: resolutions.join(","),
      EnableDRM: true,
    };
    if (watermarkUrl) {
      const downloadImg = await fetch(watermarkUrl);
      if (downloadImg.ok) {
        const file = await downloadImg.arrayBuffer();
        const metadata = await sharp(file).metadata();
        if (metadata.height && metadata.width) {
          // width = 1600 height = 900
          // height =>  1/(width/height)
          const heightInPercent = 10 / (metadata.width / metadata.height);
          const widthInPercent = 10;

          objectParams = {
            ...objectParams,
            WatermarkWidth: widthInPercent,
            WatermarkHeight: heightInPercent,
            WatermarkPositionLeft: 95 - widthInPercent,
            WatermarkPositionTop: 95 - heightInPercent,
          };
        }
      }
    }

    const options = {
      method: "POST",
      headers: this.getClientHeaders(),
      body: JSON.stringify(objectParams),
    };
    try {
      const result = await fetch(url, options);
      if (result.status == 200) {
        return new APIResponse(true, result.status, apiConstants.successMessage);
      } else {
        return this.handleError(result);
      }
    } catch (err: any) {
      return new APIResponse(false, err);
    }
  };

  addAllowedDomainsVOD = async (libraryId: number, domain: string): Promise<APIResponse<void>> => {
    const url = `https://api.bunny.net/videolibrary/${libraryId}/addAllowedReferrer`;

    const options = {
      method: "POST",
      headers: this.getClientHeaders(),
      body: JSON.stringify({ Hostname: domain }),
    };

    return fetch(url, options)
      .then((result) => {
        return new APIResponse<void>(
          result.ok,
          result.status,
          "Added the requested domain name in bunny.net video library"
        );
      })
      .catch((err) => {
        return new APIResponse(false, 500, err);
      });
  };

  getStorageZoneName = (brand: string, isCDN: boolean) => {
    return `${createSlug(brand)}-${isCDN ? "cdn" : "files"}`;
  };

  createStorageZone = async (
    brandName: string,
    mainStorageRegion: string,
    replicatedRegions: string[],
    isCDN: boolean
  ): Promise<APIResponse<StorageZone>> => {
    const url = "https://api.bunny.net/storagezone";
    const options = {
      method: "POST",
      headers: this.getClientHeaders(),
      body: JSON.stringify({
        Name: this.getStorageZoneName(brandName, isCDN),
        Region: mainStorageRegion,
        ReplicationRegions: replicatedRegions,
        ZoneTier: isCDN ? 1 : 0,
      }),
    };
    try {
      const result = await fetch(url, options);
      if (result.status == 201) {
        const body = (await result.json()) as StorageZone;
        return new APIResponse(true, result.status, "Your storage has been configured successfully", body);
      } else {
        return this.handleError(result);
      }
    } catch (err: any) {
      return new APIResponse(false, err);
    }
  };

  createPullZone = async (brandName: string, storageZoneId: number): Promise<APIResponse<PullZone>> => {
    const url = "https://api.bunny.net/pullzone";
    const pullzone = `${createSlug(brandName)}-pz`;

    const options = {
      method: "POST",
      headers: this.getClientHeaders(),
      body: JSON.stringify({
        Name: pullzone,
        StorageZoneId: storageZoneId,
        OriginType: 2,
      }),
    };
    try {
      const result = await fetch(url, options);
      if (result.status == 201) {
        const body = (await result.json()) as PullZone;
        return new APIResponse(true, result.status, apiConstants.successMessage, body);
      } else {
        return this.handleError(result);
      }
    } catch (err: any) {
      return new APIResponse(false, err);
    }
  };

  uploadWatermark = async (
    watermarkUrl: string,
    videoLibId: number,
    update: boolean = false
  ): Promise<APIResponse<void>> => {
    const downloadImg = await fetch(watermarkUrl);
    if (downloadImg.ok) {
      const url = `https://api.bunny.net/videolibrary/${videoLibId}/watermark`;

      if (update) {
        //delete the watermark
        const delOptions = {
          method: "DELETE",
          headers: this.getClientHeaders(),
        };
        const deletionResponse = await fetch(url, delOptions);
        if (deletionResponse.status == 204) {
        }
      }
      const file = await downloadImg.arrayBuffer();
      const result = await fetch(url, this.getClientFileOptions(Buffer.from(file)));
      if (result.status == 200) {
        return new APIResponse(true);
      } else {
        return await this.handleError(result);
      }
    } else {
      return new APIResponse(false, downloadImg.status, "Failed to download the watermark image");
    }
  };

  deleteWatermark = async (videoLibId: number): Promise<APIResponse<void>> => {
    const delOptions = {
      method: "DELETE",
      headers: this.getClientHeaders(),
    };
    const url = `https://api.bunny.net/videolibrary/${videoLibId}/watermark`;
    const deletionResponse = await fetch(url, delOptions);
    return new APIResponse(
      deletionResponse.status == 204,
      deletionResponse.status,
      "Successfully deleted the watermark"
    );
  };
  isValidPath(path: string): boolean {
    const allowedPathPattern =
      /^(https?:\/\/)?([\w-]+(\.[\w-]+)*\/)*[\w-]+\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|pdf|zip)$/i;
    return allowedPathPattern.test(path);
  }
}
