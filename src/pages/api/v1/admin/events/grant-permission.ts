import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { IEventAccessDeniedMailConfig, IEventAccessMailConfig } from "@/lib/emailConfig";
import { EventAccess } from "@prisma/client";
import EmailManagementService from "@/services/cms/email/EmailManagementService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const { status, comment, email, eventId, name } = req.body;

    const grantPermission = await prisma.eventRegistration.update({
      where: {
        eventId_email: {
          email: email,
          eventId: eventId,
        },
      },
      data: req.body,
      select: {
        status: true,
        comment: true,
        event: {
          select: {
            title: true,
            slug: true,
            banner: true,
            startTime: true,
            eventInstructions: true,
            location: true,
            eventLink: true,
          },
        },
      },
    });

    if (grantPermission.status === EventAccess.ACCEPTED) {
      let configData: IEventAccessMailConfig = {
        name: name,
        eventName: String(grantPermission.event.title),
        url: `${process.env.NEXTAUTH_URL}/events/${grantPermission.event.slug}`,
        email: email,
        startTime: grantPermission.event.startTime as Date,
        instructions: String(grantPermission.event.eventInstructions),
        thumbnail: String(grantPermission.event.banner),
        loactionUrl: String(grantPermission.event.eventLink),
        location: String(grantPermission.event.location),
      };
      const ms = await EmailManagementService.getMailerService();

      ms &&
        (await ms.sendMail("GRANT_ACCESS", configData).then((r) => {
          if (r.error) {
            console.log(r.error);
          }
          return res.status(200).json({
            success: true,
            status: grantPermission.status,
            message: `Booking has been accepted for ${name}`,
          });
        }));
    } else {
      let configData: IEventAccessDeniedMailConfig = {
        name: name,
        eventName: String(grantPermission.event.title),
        email: email,
        reason: comment,
      };
      const ms = await EmailManagementService.getMailerService();

      ms &&
        (await ms.sendMail("DENIED_ACCESS", configData).then((r) => {
          if (r.error) {
            console.log(r.error);
          }
          return res.status(200).json({
            success: true,
            status: grantPermission.status,
            message: `Booking has been rejected for ${name}`,
          });
        }));
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withUserAuthorized(handler)));
