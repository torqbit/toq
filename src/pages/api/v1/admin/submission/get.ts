import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { submissionId } = query;

    const resultRows = await prisma.$queryRaw<any[]>` 
      SELECT sub.content as content, ev.id as isEvaluated,ev.comment as comment,re.name as assignmentName, ev.score as score,assign.lessonId as lessonId,
      assign.id as assignmentId,assign.assignmentFiles as assignmentFiles FROM AssignmentSubmission as sub 
      INNER JOIN Assignment as assign ON assign.id = sub.assignmentId
      INNER JOIN Resource as re ON re.resourceId = assign.lessonId
      LEFT OUTER JOIN AssignmentEvaluation as ev ON ev.submissionId = sub.id WHERE sub.id = ${submissionId}`;

    if (resultRows.length > 0) {
      const mapData = new Map<string, string>(Object.entries(JSON.parse(String(resultRows[0].content))));
      let detail = {
        content: Array.from(mapData.entries()),
        assignmentFiles: resultRows[0].assignmentFiles,
        assignmentId: resultRows[0].assignmentId,
        isEvaluated: resultRows[0].isEvaluated ? true : false,
        comment: resultRows[0].comment,
        score: resultRows[0].score,
        lessonId: resultRows[0].lessonId,
        assignmentName: resultRows[0].assignmentName,
      };
      return res
        .status(200)
        .json({ success: true, message: "Submission Detail has been fetched", submissionDetail: detail });
    } else {
      return res.status(400).json({ success: false, error: "No submission record has found" });
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
