import appConstant from "@/services/appConstant";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { APIResponse } from "@/types/apis";

export const downloadPrivateFile = async (file: string): Promise<APIResponse<ArrayBuffer>> => {
  const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
  const cmsConfig = (await cms.getCMSConfig()).body?.config;

  const response = await cms.downloadPrivateFiles(cmsConfig, file);
  return response;
};
