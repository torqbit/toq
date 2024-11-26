export type VideoLibrary = {
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
};

export const BunnyConstants = {
  accessKey: "BUNNY_API_ACCESS_KEY",
  vodAccessKey: "BUNNY_STREAM_ACCESS_KEY",
  cdnStoragePassword: "BUNNY_CDN_STORAGE_PASSWORD",
  fileStoragePassword: "BUNNY_FILE_STORAGE_PASSWORD",
};

export type BunnyCMSConfig = {
  accessKeyRef: string;
  vodAccessKeyRef: string;
  cdnStoragePasswordKeyRef: string;
  fileStoragePasswordRef: string;
  vodConfig: {
    replicatedRegions: { name: string; code: string }[];
    allowedDomains: string[];
    videoResolutions: string[];
    watermarkFile?: Buffer;
  };
};

export type VideoLibraryResponse = {
  status: 200;
  items: VideoLibrary[];
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
  Latitude: 44.30588;
  Longitude: 25.723294;
  AllowLatencyRouting: boolean;
};

export class BunnyServerError {
  error: string;
  status: number = 500;
  constructor(error: string) {
    this.error = error;
  }
}
