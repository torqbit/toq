import { createSlug, getFileExtension } from "@/lib/utils";
import appConstant from "@/services/appConstant";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { APIResponse } from "@/types/apis";
import { FileObjectType, StaticFileCategory } from "@/types/cms/common";
import fs from "fs";

export const uploadThumbnail = async (
  file: any,
  name: string,
  objectType: FileObjectType,
  fileType: StaticFileCategory,
  existingFilePath?: string
): Promise<APIResponse<any>> => {
  if (file) {
    let response: APIResponse<any>;
    const extension = getFileExtension(file.originalFilename);
    const sourcePath = file.filepath;
    const currentTime = new Date().getTime();

    const fullName = `${name}-${currentTime}.${extension}`;
    const fileBuffer = await fs.promises.readFile(`${sourcePath}`);

    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const authConfig = await cms.getAuthConfig();
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    // deleting thumbnail

    if (existingFilePath) {
      console.log(`deleting the thumbnail: ${existingFilePath}`);
      const deleteResponse = await cms.deleteCDNFile(authConfig.body, cmsConfig, existingFilePath);
    }

    if (authConfig.success && authConfig.body) {
      response = await cms.uploadCDNImage(authConfig.body, cmsConfig, fileBuffer, objectType, fullName, fileType);
      return response;
    } else {
      return new APIResponse(false, 400, "Authentication configuration was not found");
    }
  } else {
    return new APIResponse(false, 400, "File is missing");
  }
};
