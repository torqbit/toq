import { BunnyClient } from "./BunnyClient";
import { baseBunnyConfig, BunnyCMSConfig, BunnyConstants, VideoLibrary } from "@/types/cms/bunny";
import { apiConstants, APIResponse, APIServerError } from "@/types/apis";
import { ICMSAuthConfig, IContentProvider } from "../IContentProvider";
import { ConfigurationState, ServiceType, VideoState } from "@prisma/client";
import SecretsManager from "@/services/secrets/SecretsManager";
import { VideoAPIResponse, VideoInfo } from "@/types/courses/Course";
import { FileObjectType, StaticFileCategory, VideoObjectType } from "@/types/cms/common";
import prisma from "@/lib/prisma";

export interface BunnyAuthConfig extends ICMSAuthConfig {
  accessKey: string;
}
const secretsStore = SecretsManager.getSecretsProvider();
const hostURL = new URL(process.env.NEXTAUTH_URL || "https://torqbit.com");

export class BunnyCMS implements IContentProvider<BunnyAuthConfig, BunnyCMSConfig> {
  async getCMSConfig(): Promise<APIResponse<{ config: BunnyCMSConfig; state: ConfigurationState }>> {
    const result = await prisma?.serviceProvider.findUnique({
      select: {
        providerDetail: true,
        state: true,
      },
      where: {
        provider_name: this.provider,
        service_type: this.serviceType,
      },
    });
    if (result && result.providerDetail) {
      return new APIResponse(true, 200, apiConstants.successMessage, {
        config: result.providerDetail as BunnyCMSConfig,
        state: result.state,
      });
    } else {
      return new APIResponse(false, 400, "Failed to fetch the CMS config");
    }
  }
  provider: string = "bunny.net";
  serviceType: ServiceType = ServiceType.CMS;

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
          service_type: ServiceType.CMS,
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
    videoResolutions: string[],
    playerColor: string,
    watermarkUrl?: string
  ): Promise<APIResponse<void>> {
    //create a Bunny client and create a video library with the above settings
    const bunny = new BunnyClient(authConfig.accessKey);

    //get the bunny cms config with status set as VOD_CONFIGURED
    const result = prisma?.serviceProvider
      .findUnique({
        select: {
          providerDetail: true,
        },
        where: {
          provider_name: this.provider,
          service_type: this.serviceType,
          state: ConfigurationState.VOD_CONFIGURED,
        },
      })
      .then(async (dbConfig) => {
        if (dbConfig && dbConfig.providerDetail) {
          const bunnyConfig = dbConfig.providerDetail as BunnyCMSConfig;
          if (bunnyConfig.vodConfig) {
            if (watermarkUrl && watermarkUrl.startsWith("http")) {
              await bunny.uploadWatermark(watermarkUrl, bunnyConfig.vodConfig.vidLibraryId, true);
            } else if (bunnyConfig.vodConfig.watermarkUrl && typeof watermarkUrl == "undefined") {
              //delete the water mark
              await bunny.deleteWatermark(bunnyConfig.vodConfig.vidLibraryId);
            }

            //update the resolutions and player color and watermark
            await bunny.updateVideoLibrary(
              bunnyConfig.vodConfig.vidLibraryId,
              playerColor,
              videoResolutions,
              watermarkUrl
            );

            //update the allowed domains
            let allowedDomain = hostURL.hostname;
            if (allowedDomain.startsWith("local")) {
              allowedDomain = `${allowedDomain}:${hostURL.port}`;
            }
            await bunny.addAllowedDomainsVOD(bunnyConfig.vodConfig.vidLibraryId, allowedDomain);
            const updatedBunnyConfig = {
              ...bunnyConfig,
              vodConfig: {
                ...bunnyConfig.vodConfig,
                videoResolutions: videoResolutions,
                watermarkUrl: watermarkUrl,
              },
            };
            this.saveConfiguration(updatedBunnyConfig);
            return new APIResponse<void>(true);
          } else {
            return new APIResponse<void>(false, 400, "Failed to find VOD configuration in the database");
          }
        } else {
          //Unable to find the VOD Config. Create a new VOD configuration
          return bunny.createVideoLibrary(brandName, replicatedRegions).then(async (result) => {
            if (result.success && result.body) {
              //upload the watermark url
              if (watermarkUrl && watermarkUrl.startsWith("http")) {
                bunny.uploadWatermark(watermarkUrl, result.body.Id);
              }

              //update the resolutions and the alowed domains
              bunny.updateVideoLibrary(result.body.Id, playerColor, videoResolutions, watermarkUrl);

              //update the allowed domains
              bunny.addAllowedDomainsVOD(result.body.Id, hostURL.hostname);

              //add the VOD access key
              secretsStore.put(BunnyConstants.vodAccessKey, result.body.ApiKey);

              //get the details of the pullzone Id
              const pullZone = await bunny.getPullZoneDetails(result.body.PullZoneId);

              //save the bunny config
              const bunnyConfig: BunnyCMSConfig = {
                ...baseBunnyConfig,
                vodConfig: {
                  vidLibraryId: result.body.Id,
                  replicatedRegions: replicatedRegions,
                  videoResolutions: videoResolutions,
                  watermarkUrl: watermarkUrl,
                  pullZone: {
                    id: result.body.PullZoneId,
                    hostnames: (pullZone.body?.Hostnames || []).map((h) => h.Value),
                  },
                },
              };
              this.saveConfiguration(bunnyConfig);
              return new APIResponse<void>(result.success, result.status, result.message);
            } else {
              return new APIResponse<void>(result.success, result.status, result.message);
            }
          });
        }
      })
      .catch((err) => {
        return new APIResponse<void>(false, 500, err);
      });
    return (
      result ||
      new Promise((resolve, _) => {
        resolve(new APIResponse<void>(false, 500, "Failed to create prisma client"));
      })
    );
  }

  async saveCDNConfig(
    authConfig: BunnyAuthConfig,
    brandName: string,
    mainStorageRegion: string,
    replicatedRegions: string[]
  ): Promise<APIResponse<void>> {
    const bunny = new BunnyClient(authConfig.accessKey);

    //get the bunny cms config with status set as VOD_CONFIGURED
    const result = await prisma?.serviceProvider.findUnique({
      select: {
        providerDetail: true,
        state: true,
        id: true,
      },
      where: {
        provider_name: this.provider,
        service_type: this.serviceType,
      },
    });
    if (
      result &&
      result.providerDetail &&
      (result.state == ConfigurationState.CDN_CONFIGURED || result.state == ConfigurationState.STORAGE_CONFIGURED)
    ) {
      //no work
      return new APIResponse(false, 400, "CDN Configuration can't be updated");
    } else if (result && result.providerDetail) {
      //create the cdn storage zone
      const cdnStorageZone = await bunny.createStorageZone(brandName, mainStorageRegion, replicatedRegions, true);
      if (cdnStorageZone.success && cdnStorageZone.body) {
        const cdnPullZone = await bunny.createPullZone(brandName, cdnStorageZone.body.Id);
        if (cdnPullZone.success && cdnPullZone.body) {
          //save the cdn storage zone passsword
          await secretsStore.put(BunnyConstants.cdnStoragePassword, cdnStorageZone.body.Password);

          //save the cdn pullzone
          const existingConfig = result.providerDetail as BunnyCMSConfig;
          const updatedConfig = {
            ...existingConfig,
            cdnConfig: {
              cdnStorageZoneId: cdnStorageZone.body.Id,
              cdnPullZoneId: cdnPullZone.body.Id,
              linkedHostname: cdnPullZone.body.Hostnames[0].Value,
              zoneName: cdnStorageZone.body.Name,
            },
          };
          await prisma?.serviceProvider.update({
            data: {
              providerDetail: updatedConfig,
              state: ConfigurationState.CDN_CONFIGURED,
            },
            where: {
              id: result.id,
            },
          });
        }
        return new APIResponse(cdnPullZone.success, cdnPullZone.status, cdnPullZone.message);
      }

      return new APIResponse(cdnStorageZone.success, cdnStorageZone.status, cdnStorageZone.message);
    } else {
      return new APIResponse(false, 404, "No Configuration found for the CMS");
    }
  }

  async configureObjectStorage(
    authConfig: BunnyAuthConfig,
    brandName: string,
    mainStorageRegion: string,
    replicatedRegions: string[]
  ): Promise<APIResponse<void>> {
    const bunny = new BunnyClient(authConfig.accessKey);

    //get the bunny cms config with status set as VOD_CONFIGURED
    const result = await prisma?.serviceProvider.findUnique({
      select: {
        providerDetail: true,
        state: true,
        id: true,
      },
      where: {
        provider_name: this.provider,
        service_type: this.serviceType,
      },
    });
    if (result && result.providerDetail && result.state == ConfigurationState.STORAGE_CONFIGURED) {
      //no work
      return new APIResponse(false, 400, "Storage Configuration can't be updated");
    } else if (result && result.providerDetail) {
      const objectStorageZone = await bunny.createStorageZone(brandName, mainStorageRegion, replicatedRegions, false);
      if (objectStorageZone.success && objectStorageZone.body) {
        await secretsStore.put(BunnyConstants.fileStoragePassword, objectStorageZone.body.Password);

        //save the cdn pullzone
        const existingConfig = result.providerDetail as BunnyCMSConfig;
        const updatedConfig = {
          ...existingConfig,
          storageConfig: {
            storageZoneId: objectStorageZone.body.Id,
            mainStorageRegion: mainStorageRegion,
            replicatedRegions: replicatedRegions,
            zoneName: objectStorageZone.body.Name,
          },
        };

        await prisma?.serviceProvider.update({
          data: {
            providerDetail: updatedConfig,
            state: ConfigurationState.STORAGE_CONFIGURED,
          },
          where: {
            id: result.id,
          },
        });
      }
      return new APIResponse(objectStorageZone.success, objectStorageZone.status, objectStorageZone.message);
    } else {
      return new APIResponse(false, 400, "No configuration found for the content management system");
    }
  }

  async deleteCDNImage(cmsConfig: BunnyCMSConfig, filePath: string): Promise<APIResponse<any>> {
    const storagePassword = await secretsStore.get(cmsConfig.cdnStoragePasswordRef);
    if (storagePassword && cmsConfig.cdnConfig) {
      const bunny = new BunnyClient(storagePassword);
      const deleteResponse = await bunny.deleteCDNImage(
        filePath,
        cmsConfig.cdnConfig.linkedHostname,
        cmsConfig.cdnConfig.zoneName
      );
      return new APIResponse(
        deleteResponse.success,
        deleteResponse.status,
        deleteResponse.message,
        deleteResponse.body
      );
    } else {
      return new APIResponse(false, 404, "CMS configuration is missing");
    }
  }

  async downloadPrivateFiles(cmsConfig: BunnyCMSConfig, filePath: string): Promise<APIResponse<ArrayBuffer>> {
    const storagePassword = await secretsStore.get(cmsConfig.fileStoragePasswordRef);
    if (storagePassword && cmsConfig.cdnConfig && cmsConfig.storageConfig) {
      const bunny = new BunnyClient(storagePassword);
      const deleteResponse = await bunny.downloadPrivateFiles(
        filePath,
        cmsConfig.cdnConfig.linkedHostname,
        cmsConfig.storageConfig.zoneName
      );
      return deleteResponse;
    } else {
      return new APIResponse(false, 404, "CMS configuration is missing");
    }
  }

  async uploadCDNImage(
    cmsConfig: BunnyCMSConfig,
    file: Buffer,
    objectType: FileObjectType,
    fileName: string,
    category: StaticFileCategory
  ): Promise<APIResponse<string>> {
    //get the storage password
    const storagePassword = await secretsStore.get(cmsConfig.cdnStoragePasswordRef);
    if (storagePassword && cmsConfig.storageConfig && cmsConfig.cdnConfig) {
      const bunny = new BunnyClient(storagePassword);
      const fullPath = `${objectType}/${category}/${fileName}`;
      const response = await bunny.uploadCDNImage(
        file,
        fullPath,
        cmsConfig.cdnConfig.zoneName,
        cmsConfig.storageConfig.mainStorageRegion,
        cmsConfig.cdnConfig.linkedHostname
      );
      if (response.body === "") {
        return new APIResponse(false, 400, "Unable to upload the file");
      } else {
        return new APIResponse(response.success, response.status, response.message, response.body);
      }
    } else {
      return new APIResponse(false, 404, "CMS configuration is missing");
    }
  }

  async deletePrivateFile(cmsConfig: BunnyCMSConfig, filePath: string): Promise<APIResponse<any>> {
    const storagePassword = await secretsStore.get(cmsConfig.fileStoragePasswordRef);
    if (storagePassword && cmsConfig.cdnConfig && cmsConfig.storageConfig) {
      const bunny = new BunnyClient(storagePassword);
      const deleteResponse = await bunny.deleteCDNImage(
        filePath,
        cmsConfig.cdnConfig.linkedHostname,
        cmsConfig.storageConfig.zoneName
      );
      return new APIResponse(
        deleteResponse.success,
        deleteResponse.status,
        deleteResponse.message,
        deleteResponse.body
      );
    } else {
      return new APIResponse(false, 404, "CMS configuration is missing");
    }
  }

  async uploadPrivateFile(
    cmsConfig: BunnyCMSConfig,
    file: Buffer,
    objectType: FileObjectType,
    fileName: string,
    category: StaticFileCategory
  ): Promise<APIResponse<string>> {
    //get the storage password
    const storagePassword = await secretsStore.get(cmsConfig.fileStoragePasswordRef);
    if (storagePassword && cmsConfig.storageConfig && cmsConfig.cdnConfig) {
      const bunny = new BunnyClient(storagePassword);
      const fullPath = `${objectType}/${category}/${fileName}`;
      const response = await bunny.uploadCDNImage(
        file,
        fullPath,
        cmsConfig.storageConfig.zoneName,
        cmsConfig.storageConfig.mainStorageRegion,
        cmsConfig.cdnConfig.linkedHostname
      );
      if (response.body === "") {
        return new APIResponse(false, 400, "Unable to upload the file");
      } else {
        return new APIResponse(response.success, response.status, response.message, response.body);
      }
    } else {
      return new APIResponse(false, 404, "CMS configuration is missing");
    }
  }

  async deleteVideo(
    cmsConfig: BunnyCMSConfig,
    videoId: string,
    objectId: number,
    objectType: VideoObjectType
  ): Promise<APIResponse<any>> {
    const storagePassword = await secretsStore.get(cmsConfig.vodAccessKeyRef);
    if (storagePassword && cmsConfig.vodConfig) {
      const bunny = new BunnyClient(storagePassword);
      const deleteResponse = await bunny.deleteVideo(videoId, cmsConfig.vodConfig?.vidLibraryId);
      if ((deleteResponse.success || deleteResponse.status === 404) && objectType == "lesson") {
        const videoDel = await prisma.video.delete({
          where: {
            resourceId: objectId,
            providerVideoId: videoId,
          },
        });
      } else if ((deleteResponse.success || deleteResponse.status === 404) && objectType == "course") {
        await prisma.course.update({
          where: {
            courseId: objectId,
          },
          data: {
            tvProviderId: undefined,
            tvProviderName: undefined,
            tvUrl: undefined,
            tvThumbnail: undefined,
            tvState: undefined,
          },
        });
      }

      return new APIResponse(
        deleteResponse.success,
        deleteResponse.status,
        deleteResponse.message,
        deleteResponse.body
      );
    } else {
      return new APIResponse(false, 404, "CMS configuration is missing");
    }
  }

  async uploadVideoThumbnail(
    cmsConfig: BunnyCMSConfig,
    thumbnail: Buffer,
    fileExtension: string,
    providerVideoId: string,
    objectId: number,
    objectType: VideoObjectType
  ): Promise<APIResponse<string>> {
    try {
      const videoAPIKey = await secretsStore.get(cmsConfig.vodAccessKeyRef);
      if (videoAPIKey && cmsConfig.vodConfig && cmsConfig.cdnConfig) {
        //get the course/lesson details
        const currentEpochTime = new Date().getTime();
        const thumbImg = `${objectId}-${objectType}-thumb-${currentEpochTime}.${fileExtension}`;

        const cdnUploadResponse = await this.uploadCDNImage(
          cmsConfig,
          thumbnail,
          objectType == "course" ? FileObjectType.COURSE : FileObjectType.LESSON,
          thumbImg,
          "thumbnail"
        );
        if (cdnUploadResponse.success && cdnUploadResponse.body) {
          const bunny = new BunnyClient(videoAPIKey);
          return bunny.updateVideoThumbnail(cdnUploadResponse.body, cmsConfig.vodConfig.vidLibraryId, providerVideoId);
        } else throw new Error(`Failed to upload the image to CDN. Error : ${cdnUploadResponse.error}`);
      } else throw new Error(`Failed to build the storage configuration`);
    } catch (err: any) {
      return new APIResponse(false, 400, err);
    }
  }

  async uploadVideo(
    cmsConfig: BunnyCMSConfig,
    file: Buffer,
    title: string,
    objectType: VideoObjectType,
    objectId: number
  ): Promise<APIResponse<VideoInfo>> {
    const videoAPIKey = await secretsStore.get(cmsConfig.vodAccessKeyRef);
    if (videoAPIKey && cmsConfig.vodConfig && cmsConfig.cdnConfig) {
      const bunny = new BunnyClient(videoAPIKey);
      const response = await bunny.uploadVideo(
        file,
        cmsConfig.vodConfig.vidLibraryId,
        title,
        cmsConfig.vodConfig.pullZone.hostnames[0]
      );
      if (!response.success || !response.body) {
        return new APIResponse(false, 400, "Unable to upload the video");
      } else {
        let videoResponse = response.body;

        if (objectType == "lesson") {
          const newVideo = await prisma.video.create({
            data: {
              videoDuration: videoResponse.videoDuration,
              videoUrl: videoResponse.videoUrl,
              providerVideoId: videoResponse.videoId,
              thumbnail: videoResponse.thumbnail,
              resourceId: objectId,
              state: videoResponse.state,
              mediaProvider: this.provider,
            },
          });

          bunny.trackVideo(videoResponse, cmsConfig.vodConfig.vidLibraryId, async (videoLen: number) => {
            let thumbnail = newVideo.thumbnail;

            // upload thumbnail

            // const uploadResponse =
            //   cmsConfig.cdnConfig &&
            //   cmsConfig.storageConfig &&
            //   (await bunny.uploadThumbnailToCDN(
            //     thumbnail,
            //     cmsConfig.cdnConfig.linkedHostname,
            //     cmsConfig.storageConfig.mainStorageRegion,
            //     cmsConfig.cdnConfig.zoneName
            //   ));

            // if (uploadResponse) {
            //   thumbnail = uploadResponse;
            // } else {
            // const getExistingVideoThumbnail = await prisma.video.findUnique({
            //   where: {
            //     id: newVideo.id,
            //   },
            //   select: {
            //     thumbnail: true,
            //   },
            // });
            // thumbnail = String(getExistingVideoThumbnail?.thumbnail);
            // }

            const updatedVideo = prisma.video.update({
              where: {
                id: newVideo.id,
              },
              data: {
                state: VideoState.READY,
                videoDuration: videoLen,
                thumbnail: thumbnail,
              },
            });
            const r = await updatedVideo;
            return r.state;
          });
          return new APIResponse(response.success, response.status, response.message, {
            ...videoResponse,
            id: Number(newVideo.id),
          });
        }
        if (objectType == "course") {
          await prisma.course.update({
            where: {
              courseId: objectId,
            },
            data: {
              tvProviderId: videoResponse.videoId,
              tvProviderName: this.provider,
              tvUrl: videoResponse.videoUrl,
              tvState: VideoState.PROCESSING,
              tvThumbnail: videoResponse.thumbnail,
            },
          });
          bunny.trackVideo(videoResponse, cmsConfig.vodConfig?.vidLibraryId, async () => {
            const updatedVideo = prisma.course.update({
              where: {
                courseId: objectId,
              },
              data: {
                tvState: VideoState.READY,
              },
            });
            const r = await updatedVideo;
            return r.state;
          });
        }
        return new APIResponse(response.success, response.status, response.message, videoResponse);
      }
    }
    return new APIResponse(false, 404, "CMS configuration is missing");
  }
}
