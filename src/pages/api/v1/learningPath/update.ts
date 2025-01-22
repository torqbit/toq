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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const { fields, files } = (await readFieldWithSingleFile(req)) as any;

    const body = JSON.parse(fields.course[0]);

    const { courses, title, description, state, pathId, banner } = body;
    const slug = createSlug(title);
    let learningPathBanner = banner;

    if (token?.role === Role.ADMIN) {
      if (files.file && files.file.length > 0) {
        const response = await uploadThumbnail(
          files.file[0],
          slug,
          FileObjectType.LEARNING_PATH,
          "learning_path",
          banner
        );
        if (response.success) {
          learningPathBanner = response.body;
        } else {
          console.log(response.error);
        }
      } else {
        throw new Error("Unable to upload the thumnail, due to missing trailer video details");
      }

      await prisma.$transaction(async (tx) => {
        let response = await tx.learningPath.update({
          where: {
            id: Number(pathId),
          },
          data: {
            title,
            description,
            slug,
            state,
            banner: learningPathBanner || banner,
          },
          select: {
            id: true,
            title: true,
            description: true,
            state: true,
            banner: true,
          },
        });

        const coursesToCreate = courses.map((courseId: number) => ({
          pathId,
          courseId,
        }));

        await prisma.learningPathCourses.createMany({
          data: coursesToCreate,
          skipDuplicates: true,
        });

        return res.status(200).json({
          success: true,
          message: "Learning path has been updated",
          learningPathDetail: response,
        });
      });
    } else {
      return res.status(403).json({ success: false, error: "You are not authorized!" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
