export interface VideoLibrary {
  Id: number;
  Name: string;
  VideoCount: number;
  TrafficUsage: number;
  StorageUsage: number;
  DateCreated: string;
  ReplicationRegions: string[];
  ApiKey: string;
  ReadOnlyApiKey: string;
  HasWatermark: boolean;
  PullZoneId: number;
  StorageZoneId: number;
  EnabledResolutions: string;
  AllowedReferrers: string[];
  BlockedReferrers: string[];
}

export const BunnyConstants = {
  accessKey: "BUNNY_API_ACCESS_KEY",
  vodAccessKey: "BUNNY_STREAM_ACCESS_KEY",
  cdnStoragePassword: "BUNNY_CDN_STORAGE_PASSWORD",
  fileStoragePassword: "BUNNY_FILE_STORAGE_PASSWORD",
};

export const baseBunnyConfig: BunnyCMSConfig = {
  accessKeyRef: BunnyConstants.accessKey,
  vodAccessKeyRef: BunnyConstants.vodAccessKey,
  cdnStoragePasswordRef: BunnyConstants.cdnStoragePassword,
  fileStoragePasswordRef: BunnyConstants.fileStoragePassword,
};

export type BunnyCMSConfig = {
  accessKeyRef: string;
  vodAccessKeyRef: string;
  cdnStoragePasswordRef: string;
  fileStoragePasswordRef: string;
  vodConfig?: {
    vidLibraryId: number;
    replicatedRegions: string[];
    allowedDomains: string[];
    videoResolutions: string[];
    watermarkUrl?: string;
  };
};

export type VideoLibraryResponse = {
  status: 200;
  items: VideoLibrary[];
};

export type BunnyRequestError = {
  ErrorKey: string;
  Field: string;
  Message: string;
};

export type UnAuthorizedRequest = {
  Message: string;
};
export type Region = {
  Id: number;
  Name: string;
  PricePerGigabyte: number;
  RegionCode: string;
  ContinentCode: string;
  CountryCode: string;
};

export class BunnyServerError {
  error: string;
  status: number = 500;
  constructor(error: string) {
    this.error = error;
  }
}
