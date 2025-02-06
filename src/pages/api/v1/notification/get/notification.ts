import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

import NotificationHandler from "@/actions/notification";
import { APIResponse } from "@/types/apis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const { offSet, limit } = req.query;

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    if (token) {
      const notificationData = await NotificationHandler.getAllNotifications(token.id, Number(limit), Number(offSet));

      return res.status(notificationData.status).json(notificationData);
    } else {
      res.status(404).json(new APIResponse(false, 404, "No notifications has been found"));
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
