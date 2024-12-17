import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { createSlug, getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const body = await req.body;
    const { contentType } = body;

    const findUntitled = await prisma.blog.count({
      where: {
        title: "Untitled",
      },
    });
    if (findUntitled > 0) {
      await prisma.blog.deleteMany({
        where: {
          title: "Untitled",
          contentType,
        },
      });
    }

    const createBlog = await prisma.blog.create({
      data: {
        authorId: String(token?.id),
        state: "DRAFT",
        banner: "",
        slug: "",
        content: "",
        title: "Untitled",
        contentType: String(contentType),
      },
      select: {
        id: true,
      },
    });

    return res.status(200).json({ success: true, message: "Blog has been created", blog: createBlog });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
