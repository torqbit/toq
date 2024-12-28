import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const data = await prisma.blog.findUnique({
      where: {
        id: `${id}`,
      },
      select: {
        banner: true,
        state: true,
        content: true,
        title: true,
        contentType: true,
      },
    });
    if (data) {
      let contentData = {
        htmlData: data?.content,
        bannerImage: data?.banner,
        title: data?.title,
        state: data.state,
        contentType: data.contentType,
      };
      return res.status(200).json({ success: true, message: "Content data has been fetched", contentData });
    } else {
      return res.status(404).json({ success: false, message: "Content not found" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
