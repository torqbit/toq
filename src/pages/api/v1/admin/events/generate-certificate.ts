import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import { CeritificateService } from "@/services/certificate/CertificateService";
import { IEventCertificateInfo } from "@/types/courses/Course";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const { eventId, name, registrationId, email } = req.body;

    const eventInfo = await prisma.events.findUnique({
      where: {
        id: eventId,
      },
      select: {
        certificateTemplate: true,
        title: true,
        startTime: true,
        authorId: true,
        slug: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (eventInfo && eventInfo?.authorId === token?.id) {
      const eventCertificateInfo: IEventCertificateInfo = {
        eventId: eventId,
        authorName: String(eventInfo?.user.name),
        eventName: String(eventInfo?.title),
        studentEmail: email,
        studentName: name,
        certificateTemplate: String(eventInfo?.certificateTemplate),
        registrationId: registrationId,
        slug: String(eventInfo?.slug),
      };
      const response = await new CeritificateService().eventCertificate(eventCertificateInfo);
      return res.status(response.status).json({ success: response.status, message: response.message });
    } else {
      return res.status(403).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withUserAuthorized(handler)));
