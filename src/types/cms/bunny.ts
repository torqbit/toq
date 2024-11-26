export type VideoLibrary = {
  Id: number;
  Name: string,
  VideoCount: number,
  TrafficUsage: number,
  StorageUsage: number,
  DateCreated: string,
  ReplicationRegions: string[],
  ApiKey: string,
  ReadOnlyApiKey: string,
  HasWatermark: boolean,
  PullZoneId: number,
  StorageZoneId: number,
  EnabledResolutions: string,
  AllowedReferrers: string[],
  BlockedReferrers: string[],
}

export type VideoLibraryResponse = {
  status: 200,
  items: VideoLibrary[]
}

export type UnAuthorizedRequest = {
  Message: string;
}
export type Region = {
  Id: number,
  Name: string,
  PricePerGigabyte: number,
  RegionCode: string,
  ContinentCode: string,
  CountryCode: string,
  Latitude: 44.30588,
  Longitude: 25.723294,
  AllowLatencyRouting: boolean
}

export class BunnyServerError {
  error: string;
  status: number = 500;
  constructor(error: string) {
    this.error = error;
  }
}