import { BunnyClient } from "./BunnyClient";
import { BunnyCMSConfig, BunnyConstants, BunnyServerError } from "@/types/cms/bunny";
import { APIServerError } from "@/types/cms/apis";
import { ICMSConfig, IContentProvider } from "../IContentProvider";
import { ConfigurationState } from "@prisma/client";
import SecretsManager from "@/services/secrets/SecretsManager";

export interface BunnyAuthConfig extends ICMSConfig {
  accessKey: string;
}
export class BunnyCMS implements IContentProvider<BunnyAuthConfig> {
  provider: string = "bunny.net";
  serviceType: string = "cms";

  async saveConfiguration(config: BunnyCMSConfig): Promise<boolean> {
    //based on the config object values, save in the database
    let configId;
    let configState: ConfigurationState = ConfigurationState.AUTHENTICATED;
    if (config.vodConfig) {
      configState = ConfigurationState.VOD_CONFIGURED;
    }

    const existingSP = await prisma?.serviceProvider.findUnique({
      where: {
        service_type: this.serviceType,
      },
    });

    if (existingSP) {
      const result = await prisma?.serviceProvider.update({
        data: {
          provider_name: this.provider,
          providerDetail: config,
          state: configState,
        },
        where: {
          service_type: this.serviceType,
        },
      });
      configId = result?.id;
    } else {
      const result = await prisma?.serviceProvider.create({
        data: {
          service_type: "cms",
          provider_name: this.provider,
          providerDetail: config,
          state: configState,
        },
      });
      configId = result?.id;
    }

    return typeof configId != "undefined";
  }

  /**
   *
   * @param config
   * @returns true if Access Key is valid, throws error if it fails
   */
  testConfiguration(config: BunnyAuthConfig): Promise<Boolean | APIServerError> {
    const bunny = new BunnyClient(config.accessKey);
    return bunny
      .listVideoLibraries()
      .then(async (r) => {
        if (r.status == 200) {
          //save the configuration in database
          const bunnyConfig: BunnyCMSConfig = {
            accessKeyRef: BunnyConstants.accessKey,
            vodAccessKeyRef: BunnyConstants.vodAccessKey,
            cdnStoragePasswordRef: BunnyConstants.cdnStoragePassword,
            fileStoragePasswordRef: BunnyConstants.fileStoragePassword,
          };

          const secretsStore = SecretsManager.getSecretsProvider();
          secretsStore.put(bunnyConfig.accessKeyRef, config.accessKey);
          this.saveConfiguration(bunnyConfig);

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
    authConfig: BunnyAuthConfig,
    replicatedRegions: string[],
    allowedDomains: string[],
    videoResolutions: string[],
    playerColor?: string,
    watermarkFile?: Buffer
  ): Promise<Boolean | APIServerError> {
    //create a Bunny client and create a video library with the above settings

    //Update the video library based on the above configuration

    //Save the video library and accessKey in the database
    throw new Error("Method not implemented.");
  }
}
