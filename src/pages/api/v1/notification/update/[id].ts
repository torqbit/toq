import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await prisma.notification.update({
      where: {
        id: Number(req.query.id),
        isView: false,
      },
      data: {
        isView: true,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
