import { BunnyClient } from "./BunnyClient";
import { baseBunnyConfig, BunnyCMSConfig, BunnyConstants, VideoLibrary } from "@/types/cms/bunny";
import { apiConstants, APIResponse, APIServerError } from "@/types/cms/apis";
import { ICMSConfig, IContentProvider } from "../IContentProvider";
import { ConfigurationState } from "@prisma/client";
import SecretsManager from "@/services/secrets/SecretsManager";

export interface BunnyAuthConfig extends ICMSConfig {
  accessKey: string;
}
const secretsStore = SecretsManager.getSecretsProvider();

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

  async getAuthConfig(): Promise<APIResponse<BunnyAuthConfig>> {
    const accessKey = await secretsStore.get(BunnyConstants.accessKey);
    if (accessKey) {
      return new APIResponse(true, 200, apiConstants.successMessage, { accessKey: accessKey });
    } else {
      return new APIResponse(true, 200, apiConstants.successMessage);
    }
  }

  /**
   * Test and save/update the configuration
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

          secretsStore.put(baseBunnyConfig.accessKeyRef, config.accessKey);
          this.saveConfiguration(baseBunnyConfig);

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
    brandName: string,
    replicatedRegions: string[],
    allowedDomains: string[],
    videoResolutions: string[],
    playerColor: string,
    watermarkUrl?: string
  ): Promise<APIResponse<void>> {
    //create a Bunny client and create a video library with the above settings
    const bunny = new BunnyClient(authConfig.accessKey);
    return bunny.createVideoLibrary(brandName, replicatedRegions).then((result) => {
      if (result.success && result.body) {
        //upload the watermark url
        if (watermarkUrl && watermarkUrl.startsWith("http")) {
          bunny.uploadWatermark(watermarkUrl, result.body.Id);
        }

        //update the resolutions and the alowed domains
        bunny.updateVideoLibrary(result.body.Id, playerColor, videoResolutions, typeof watermarkUrl !== "undefined");

        //update the allowed domains
        bunny.addAllowedDomainsVOD(result.body.Id, allowedDomains);

        //add the VOD access key
        secretsStore.put(BunnyConstants.vodAccessKey, result.body.ApiKey);

        //save the bunny config
        const bunnyConfig: BunnyCMSConfig = {
          ...baseBunnyConfig,
          vodConfig: {
            replicatedRegions: replicatedRegions,
            allowedDomains: allowedDomains,
            videoResolutions: videoResolutions,
            watermarkUrl: watermarkUrl,
          },
        };
        this.saveConfiguration(bunnyConfig);
        return new APIResponse<void>(result.success, result.status, result.message);
      } else {
        return new APIResponse<void>(result.success, result.status, result.message);
      }
    });
  }
}
