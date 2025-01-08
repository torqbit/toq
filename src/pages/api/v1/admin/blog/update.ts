import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { createSlug, getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { APIResponse } from "@/types/apis";
import { uploadThumbnail } from "@/actions/courses";
import { FileObjectType } from "@/types/cms/common";
import { readFieldWithFile } from "@/lib/upload/utils";
import { Role } from "@prisma/client";
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

    const body = JSON.parse(fields.blog[0]);
    const { title, banner, state, content, blogId, contentType } = body;

    const slug = title && createSlug(title);

    let response: APIResponse<any>;
    let thumbnail;

    const findBlog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        authorId: true,
      },
    });

    if (token?.id === findBlog?.authorId || token?.role === Role.ADMIN) {
      if (files.file) {
        response = await uploadThumbnail(
          files.file[0],
          body.slug,
          contentType === "UPDATE" ? FileObjectType.UPDATE : FileObjectType.BLOG,
          "banner",
          banner
        );
        if (response.success) {
          thumbnail = response.body;
        } else {
          return res.status(response.status).json(response);
        }
      }

      const updateBlog = await prisma.blog.update({
        where: {
          id: blogId,
          authorId: findBlog?.authorId,
        },
        data: {
          title,
          content,
          state,
          banner: thumbnail ? thumbnail : banner,
          slug,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: ` ${contentType === "BLOG" ? "Blog" : "Update"} has been ${
          updateBlog.state === "ACTIVE" ? "published" : "saved as draft"
        }`,
        blog: updateBlog,
      });
    } else {
      return res.status(403).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
