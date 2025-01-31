import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { getToken } from "next-auth/jwt";
import { createSlug, getCookieName } from "@/lib/utils";
import { Role } from "@prisma/client";
import { readFieldWithSingleFile } from "@/lib/upload/utils";
import { uploadThumbnail } from "@/actions/courses";
import { FileObjectType } from "@/types/cms/common";
import learningPath from "@/actions/learningPath";
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
    const { fields, files } = (await readFieldWithSingleFile(req)) as any;

    const body = JSON.parse(fields.learingPath[0]);

    const { courses, title, description, state, pathId, banner } = body;
    const slug = createSlug(title);

    if (token?.role === Role.ADMIN) {
      const response = await learningPath.updateLearningPath(
        files.file && files.file.length > 0 ? files.file[0] : undefined,
        pathId,
        slug,
        title,
        description,
        state,
        token.id || "",
        courses,
        banner,
        token.role
      );

      return res.status(response.status).json(response);
    } else {
      return res.status(403).json({ success: false, error: "You are not authorized!" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
