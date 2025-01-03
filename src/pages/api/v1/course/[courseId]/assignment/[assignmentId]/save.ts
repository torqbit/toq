import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCookieName } from "@/lib/utils";
import { AssignmentConfig } from "@/types/courses/assignment";
import { NextApiRequest, NextApiResponse } from "next";
import AssignmentFileManagement from "@/services/ams/AssignmentFileManagement";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const query = req.query;
    const { assignmentId, courseId } = query;
    const body = req.body;
    const { codeData } = body;

    const getFileName = await prisma.assignment.findUnique({
      where: {
        lessonId: Number(assignmentId),
      },
    });
    // if (getFileName && getFileName.assignmentFiles) {
    //   let fileArray = getFileName?.assignmentFiles as string[];
    //   let fileName = fileArray.find((f) => f.includes(".html"));
    //   let assignmentConfig: AssignmentConfig = {
    //     codeData: codeData,
    //     courseId: Number(courseId),
    //     lessonId: Number(assignmentId),
    //     userId: String(token?.id),
    //     previewFileName: String(fileName),
    //   };

    //   AssignmentFileManagement.saveToLocal(assignmentConfig)
    //     .then((result) => {
    //       return res.status(200).json({ success: true, preview: result, message: "Updated successfully" });
    //     })
    //     .catch((err) => {
    //       return res.status(400).json({ success: false, error: ` ${err}` });
    //     });
    // }
  } catch (error) {
    return errorHandler(error, res);
  }
};
export default handler;
