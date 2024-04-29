import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { chapterId } = req.query;

    const findChapter = await prisma.chapter.findUnique({
      where: {
        chapterId: Number(chapterId),
      },
      include: {
        resource: {
          where: {
            state: "ACTIVE",
          },
        },
      },
    });

    if (findChapter) {
      const [updateSeq, deleteCourse] = await prisma.$transaction([
        prisma.$executeRaw`UPDATE Chapter SET sequenceId = sequenceId - 1  WHERE sequenceId > ${findChapter.sequenceId}  AND  courseId = ${findChapter.courseId};`,
        prisma.chapter.delete({
          where: {
            chapterId: Number(chapterId),
          },
        }),
      ]);

      return res.status(200).json({
        info: false,
        success: true,
        message: "Chapter Deleted",
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));
