import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { createSlug, getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
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
    const body = await req.body;
    const { title, banner, state, content, blogId } = body;

    const slug = title && createSlug(title);
    const updateObj: any = {};
    if (slug) updateObj.slug = slug;
    if (title) updateObj.title = title;
    if (content) updateObj.content = content;
    if (banner) updateObj.banner = banner;
    if (state) updateObj.state = state;

    const updateBlog = await prisma.blog.update({
      where: {
        id: blogId,
        authorId: String(token?.id),
      },
      data: {
        ...updateObj,

        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: ` Blog has been ${updateBlog.state === "ACTIVE" ? "published" : "saved as draft"}`,
      blog: updateBlog,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
