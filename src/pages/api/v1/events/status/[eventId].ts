import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { eventId } = req.query;
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const isRegistered = await prisma.eventRegistration.findUnique({
      where: {
        eventId_email: {
          eventId: Number(eventId),
          email: String(token?.email),
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (isRegistered) {
      return res.status(200).json({ success: true, eventRegistered: true, status: isRegistered.status });
    } else {
      return res.status(200).json({ success: true, eventRegistered: false, status: false });
    }
  } catch (err) {
    console.log(err);
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], handler);
