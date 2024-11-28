import { APIResponse, APIServerError } from "@/types/cms/apis";
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
}
