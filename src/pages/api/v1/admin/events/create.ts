import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCookieName } from "@/lib/utils";
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

    let response: APIResponse<any>;
    let thumbnail;

    if (files.file) {
      response = await uploadThumbnail(files.file[0], body.slug, FileObjectType.EVENT, "banner");
      if (response.success) {
        thumbnail = response.body;
      } else {
        return res.status(response.status).json(response);
      }
    }

    await prisma.events.create({
      data: {
        ...body,
        authorId: String(token?.id),
        banner: thumbnail ? thumbnail : body.banner,
      },
      select: {
        id: true,
      },
    });

    return res.status(200).json({ success: true, message: "Event has been created" });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withUserAuthorized(handler)));
