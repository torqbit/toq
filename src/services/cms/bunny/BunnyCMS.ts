import { BunnyClient } from "./BunnyClient";
import { BunnyServerError } from "@/types/cms/bunny";
import { APIServerError } from "@/types/cms/apis";
import { ICMSConfig, IContentProvider } from "../IContentProvider";

export interface BunnyConfig extends ICMSConfig {
  accessKey: string;
  secretKey: string;
}
export class BunnyCMS implements IContentProvider<BunnyConfig> {
  provider: string = "bunny.net";

  /**
   *
   * @param config
   * @returns true if Access Key is valid, throws error if it fails
   */
  testConfiguration(config: BunnyConfig): Promise<Boolean | APIServerError> {
    const bunny = new BunnyClient(config.accessKey);
    return bunny
      .listVideoLibraries()
      .then((r) => {
        if (r.status == 200) {
          return new Boolean(true);
        } else {
          return r as APIServerError;
        }
      })
      .catch((err) => new APIServerError(err));
  }

  listReplicationRegions(): Promise<{ name: string; code: string }[]> {
    return new Promise((resolve, reject) => {
      resolve([
        { name: "London, UK", code: "UK" },
        { name: "New York, US", code: "NY" },
        { name: "Sydney, Oceania", code: "SYD" },
        { name: "Singapore, Asia", code: "SG" },
        { name: "Johannesburg, Africa", code: "JH" },
        { name: "Sao Paulo, LATAM", code: "BR" },
        { name: "Los Angeles, US West", code: "LA" },
        { name: "Falkenstein, Europe", code: "DE" },
        { name: "Stockholm, Europe", code: "SY" },
      ]);
    });
  }

  /**
   * Saves the configuration to database
   * @param authConfig
   * @param replicatedRegions
   * @param allowedDomains
   * @param videoResolutions
   * @param watermarkFile
   */
  saveVODConfig(
    authConfig: BunnyConfig,
    replicatedRegions: { name: string; code: string }[],
    allowedDomains: string[],
    videoResolutions: string[],
    watermarkFile?: Buffer
  ): Promise<Boolean | APIServerError> {
    //create a Bunny client and create a video library with the above settings

    //Update the video library based on the above configuration

    //Save the video library and accessKey in the database
    throw new Error("Method not implemented.");
  }
}
