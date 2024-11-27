import { APIServerError } from "@/types/cms/apis";

export type ICMSConfig = {
  accessKey: string;
};
export interface IContentProvider<T extends ICMSConfig> {
  provider: string;
  testConfiguration(config: T): Promise<Boolean | APIServerError>;
  listReplicationRegions(): Promise<{ name: string; code: string }[]>;
  saveVODConfig(
    authConfig: T,
    brandName: string,
    replicatedRegions: string[],
    allowedDomains: string[],
    videoResolutions: string[],
    playerColor?: string,
    watermarkFile?: Buffer
  ): Promise<Boolean | APIServerError>;
}
