import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";
import { APIResponse } from "@/types/cms/apis";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const vodConfig = z.object({
    provider: z.string().min(2, "Provider is required"),
    brandName: z.string().min(2, "Brand name is required"),
    replicatedRegions: z.array(z.string()).min(1, "Atleast one region must be specified"),
    mainStorageRegion: z.string().min(2, "Storage region name is required"),
});

export type CDNConfig = z.infer<typeof vodConfig>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body = await req.body;
        let response: APIResponse<any>;
        const config: CDNConfig = vodConfig.parse(body);
        const cms = new ContentManagementService().getCMS(config.provider);
        const authConfig = await cms.getAuthConfig();

        if (authConfig.success && authConfig.body) {

            response = await cms.saveCDNConfig(
                authConfig.body,
                config.brandName,
                config.mainStorageRegion,
                config.replicatedRegions,
            );
            return res.status(response.status).json({ success: response.success, message: response.message });
        } else {

            return res.status(400).json({ success: false, message: "Authentication configuration was not found" });
        }

    } catch (error) {
        return errorHandler(error, res);
    }
};

export default withMethods(["POST"], withUserAuthorized(handler));
