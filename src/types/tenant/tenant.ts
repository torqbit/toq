import { APIResponse } from "../apis";

export interface TenantProvisionerProvider {
  userId: string;
  updateTenant(
    brandName: string,
    brandColor: string,
    brandTitle: string,
    domain: string,
    email: string,
    streamData: any
  ): Promise<APIResponse<any>>;
  deleteTenant(tenantId: string): Promise<APIResponse<any>>;

  provision(
    brandName: string,
    brandColor: string,
    brandTitle: string,
    email: string,
    name: string,
    tenantId: string
  ): Promise<APIResponse<any>>;
}

export interface IVodConfigResponse {
  vodAccessKey: string;
  vodConfig: {
    vidLibraryId: number;
    replicatedRegions: string[];
    videoResolutions: string[];
    pullZone: {
      id: number;
      hostnames: string[];
    };
    watermarkUrl?: string;
  };
}

export interface ICdnConfigResponse {
  cdnStoragePassword: string;
  cdnConfig: {
    cdnStorageZoneId: number;
    zoneName: string;
    cdnPullZoneId: number;
    linkedHostname: string;
    mainStorageRegion: string;
  };
}
export interface IStorageConfigResponse {
  fileStoragePassword: string;
  storageConfig: {
    storageZoneId: number;
    mainStorageRegion: string;
    zoneName: string;
    replicatedRegions: string[];
  };
}

export interface IStreamData {
  vodResponse: IVodConfigResponse;
  cdnResponse: ICdnConfigResponse;
  storageResponse: IStorageConfigResponse;
}
