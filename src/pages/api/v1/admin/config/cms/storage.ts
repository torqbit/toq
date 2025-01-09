import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { APIResponse } from "@/types/apis";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { StorageConfig, storeConfig } from "@/types/cms/bunny";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    let response: APIResponse<any>;
    const config: StorageConfig = storeConfig.parse(body);
    const cms = new ContentManagementService().getCMS(config.provider);
    const authConfig = await cms.getAuthConfig();

    if (authConfig.success && authConfig.body) {
      response = await cms.saveCDNConfig(
        authConfig.body,
        config.brandName,
        config.mainStorageRegion,
        config.replicatedRegions
      );
      if (response.success) {
        response = await cms.configureObjectStorage(
          authConfig.body,
          config.brandName,
          config.mainStorageRegion,
          config.replicatedRegions
        );
      }

      return res.status(response.status).json(response);
    } else {
      return res.status(400).json({ success: false, message: "Authentication configuration was not found" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
