import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { getToken } from "next-auth/jwt";
import { createSlug, getCookieName } from "@/lib/utils";
import { ProductType, Role } from "@prisma/client";
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

    const { courses, title, description, state } = body;
    const slug = createSlug(title);
    let learningPathBanner: string;

    const authorId = token?.id;

    if (token?.role === Role.ADMIN) {
      if (files.file && files.file.length > 0) {
        const response = await uploadThumbnail(files.file[0], slug, FileObjectType.LEARNING_PATH, "learing_path");
        if (response.success) {
          learningPathBanner = response.body;
        } else {
          console.log(response.error);
        }
      } else {
        throw new Error("Unable to upload the thumnail, due to missing trailer video details");
      }

      await prisma.$transaction(async (tx) => {
        const productCreate = await tx.product.create({
          data: {
            ptype: ProductType.LEARNING_PATH,
          },
        });

        let response = await tx.learningPath.create({
          data: {
            id: productCreate.productId,
            title,
            description,
            slug,
            state,
            authorId: authorId || "",
            banner: learningPathBanner || "",
          },
          select: {
            id: true,
            title: true,
            description: true,
            state: true,
            banner: true,
          },
        });

        let learningPathId = response.id;

        const coursesToCreate = courses.map((courseId: number) => ({
          learningPathId,
          courseId,
        }));

        await prisma.learningPathCourses.createMany({
          data: coursesToCreate,
          skipDuplicates: true,
        });

        return res.status(200).json({
          success: true,
          message: "Learning path has been created",
          learingPathDetail: response,
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
