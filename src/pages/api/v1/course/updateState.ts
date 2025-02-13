import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { StateType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId, state } = req.body;
    const updateState = await prisma.course.update({
      where: {
        courseId: Number(courseId),
      },
      data: {
        state: state,
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: state == StateType.ACTIVE ? "Course has been published" : "Course has been moved to draft",
      course: updateState,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
