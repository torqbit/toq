import { APIResponse, APIServerError } from "@/types/apis";
import { FileObjectType, StaticFileCategory, VideoObjectType } from "@/types/cms/common";
import { ConfigurationState } from "@prisma/client";

export type ICMSAuthConfig = {
  accessKey: string;
};
export interface IContentProvider<T extends ICMSAuthConfig, U> {
  provider: string;
  testConfiguration(config: T): Promise<Boolean | APIServerError>;
  getAuthConfig(): Promise<APIResponse<T>>;

  getCMSConfig(): Promise<APIResponse<{ config: U; state: ConfigurationState }>>;

  listReplicationRegions(): Promise<{ name: string; code: string }[]>;
  saveVODConfig(
    authConfig: T,
    brandName: string,
    replicatedRegions: string[],
    videoResolutions: string[],
    playerColor?: string,
    watermarkUrl?: string
  ): Promise<APIResponse<void>>;

  saveCDNConfig(
    authConfig: T,
    brandName: string,
    mainStorageRegion: string,
    replicatedRegions: string[]
  ): Promise<APIResponse<void>>;

  configureObjectStorage(
    authConfig: T,
    brandName: string,
    mainStorageRegion: string,
    replicatedRegions: string[]
  ): Promise<APIResponse<void>>;

  uploadCDNImage(
    cmsConfig: U,
    file: Buffer,
    objectType: FileObjectType,
    fileName: string,
    category: StaticFileCategory
  ): Promise<APIResponse<any>>;

  downloadPrivateFiles(cmsConfig: U, filePath: string): Promise<APIResponse<any>>;

  uploadPrivateFile(
    cmsConfig: U,
    file: Buffer,
    objectType: FileObjectType,
    fileName: string,
    category: StaticFileCategory
  ): Promise<APIResponse<any>>;
  deletePrivateFile(cmsConfig: U, filePath: string): Promise<APIResponse<any>>;

  uploadVideo(
    cmsConfig: U,
    file: Buffer,
    title: string,
    objectType: VideoObjectType,
    objectId: number
  ): Promise<APIResponse<any>>;

  uploadVideoThumbnail(
    cmsConfig: U,
    thumbnail: Buffer,
    fileExtension: string,
    providerVideoId: string,
    objectId: number,
    objectType: VideoObjectType
  ): Promise<APIResponse<string>>;
  deleteCDNImage(cmsConfig: U, filePath: string): Promise<APIResponse<any>>;
  deleteVideo(cmsConfig: U, videoId: string, objectId: number, objectType: VideoObjectType): Promise<APIResponse<any>>;
}
