import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { createSlug, getCookieName } from "@/lib/utils";
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
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const { fields, files } = (await readFieldWithFile(req)) as any;

    const body = JSON.parse(fields.userInfo[0]);
    const { name, role, isActive, phone, image, userId } = body;
    const imageName = createSlug(name);

    let response: APIResponse<any>;
    let thumbnail;

    if (files.file) {
      response = await uploadThumbnail(files.file[0], imageName, FileObjectType.USER, "profile", image);
      if (response.success) {
        thumbnail = response.body;
      } else {
        return res.status(response.status).json(response);
      }
    }
    const newResource = await prisma.user.update({
      where: {
        id: userId ? userId : token?.id,
      },
      data: { ...body, phone: String(phone), isActive: true, image: thumbnail ? thumbnail : image },
    });

    return res.status(200).json({ created: newResource, success: true, message: "User profile has been updated" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);
