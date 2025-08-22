import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getCookieName } from "@/lib/utils";
import { IFeedBackConfig } from "@/lib/emailConfig";
import { EmailManagementService } from "@/services/email/EmailManagementService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

/**
 * Post a conversation
 * @param req
 * @param res
 * @returns
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await getServerSession(req, res, await authOptions(req));

    const body = await req.body;
    const { feedback } = body;
    let config = {
      name: user?.name,
      email: user?.email,
      feedback: feedback,
    } as IFeedBackConfig;

    const ms = await new EmailManagementService().getMailerService(String(user?.tenant?.tenantId));

    ms &&
      (await ms.sendMail("FEEDBACK", config).then((result) => {
        if (result.error) {
          res.status(400).json({ success: false, error: result.error, user });
        } else {
          res.status(200).json({ success: true, message: "Mail has been sent to admin", user });
        }
      }));
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
