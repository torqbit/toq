import { z } from "zod";

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
    videoResolutions: string[];
    pullZone: {
      id: number;
      hostnames: string[];
    };
    watermarkUrl?: string;
  };
  cdnConfig?: {
    cdnStorageZoneId: number;
    zoneName: string;
    cdnPullZoneId: number;
    linkedHostname: string;
  };
  storageConfig?: {
    storageZoneId: number;
    mainStorageRegion: string;
    zoneName: string;
    replicatedRegions: string[];
  };
};
export type Hostname = {
  Id: number;
  Value: string;
  ForceSSL: boolean;
  IsSystemHostname: boolean;
  HasCertificate: boolean;
};
export type PullZone = {
  Id: number;
  Name: string;
  OriginUrl: string;
  Enabled: boolean;
  storageZoneId: number;
  AllowedReferrers: string[];
  Hostnames: Hostname[];
};
export type StorageZone = {
  Id: number;
  UserId: string;
  Name: string;
  Password: string;
  StorageUsed: number;
  Region: string;
  PullZones: PullZone[];
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

export const storeConfig = z.object({
  provider: z.string().min(2, "Provider is required"),
  brandName: z.string().min(2, "Brand name is required"),
  replicatedRegions: z.array(z.string()).min(1, "Atleast one region must be specified"),
  mainStorageRegion: z.string().min(2, "Storage region name is required"),
});

export type StorageConfig = z.infer<typeof storeConfig>;
