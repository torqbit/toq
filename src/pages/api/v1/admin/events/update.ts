import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { createSlug, getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { APIResponse } from "@/types/apis";
import { uploadThumbnail } from "@/actions/courses";
import { FileObjectType } from "@/types/cms/common";
import { readFieldWithFile } from "@/lib/upload/utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const { fields, files } = (await readFieldWithFile(req)) as any;

    const body = JSON.parse(fields.event[0]);

    const { title, id } = body;
    if (title) {
      const findExistingEvent = await prisma.events.findUnique({
        where: {
          title: title,
          NOT: {
            id: id,
          },
        },
        select: {
          title: true,
        },
      });

      if (findExistingEvent) {
        return res.status(403).json({ success: true, error: "Event already exist with this title" });
      }
    }

    let response: APIResponse<any>;
    let thumbnail;

    if (files.file) {
      response = await uploadThumbnail(files.file[0], body.slug, FileObjectType.EVENT, "banner", body.banner);
      if (response.success) {
        thumbnail = response.body;
      } else {
        return res.status(response.status).json(response);
      }
    }

    const updatedEvent = await prisma.events.update({
      where: {
        id: id,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({ success: true, message: "Event has been updated", updatedEvent });
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withUserAuthorized(handler)));
