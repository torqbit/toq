import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { createSlug, getCookieName } from "@/lib/utils";
import { APIResponse } from "@/types/apis";
import { readFieldWithFile } from "@/lib/upload/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const user = await getServerSession(req, res, await authOptions(req));
    const { fields, files } = (await readFieldWithFile(req)) as any;

    const body = JSON.parse(fields.userInfo[0]);
    const { name, role, isActive, phone, image, userId } = body;

    const imageName = createSlug(name);

    let response: APIResponse<any>;
    let thumbnail;

    const updatedProfile = await prisma.user.update({
      where: {
        id: userId ? userId : user?.id,
      },
      data: { ...body, phone: String(phone), isActive: true, image: thumbnail ? thumbnail : image },
    });

    return res.status(200).json({ created: updatedProfile, success: true, message: "User profile has been updated" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);
