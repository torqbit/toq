import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import EmailManagemetService from "@/services/cms/email/EmailManagementService";
import { APIResponse } from "@/types/apis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await EmailManagemetService.getEmailCredentials();
    return res
      .status(result.status)
      .json(
        new APIResponse(
          result.success,
          result.status,
          "Email credentials has been fetched",
          result.body ? { ...result.body, smtpPassword: "*********************" } : undefined
        )
      );
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withUserAuthorized(handler));
