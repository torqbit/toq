import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { $Enums, submissionStatus } from "@prisma/client";
import { generateDayAndYear, getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

export const validateReqQuery = z.object({
  courseId: z.coerce.number(),
});
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = validateReqQuery.parse(req.query);
    const cookieName = getCookieName();
    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const resultRows = await prisma.$queryRaw<
      any[]
    >`   SELECT sub.id as subId, sub.studentId as studentId, sub.createdAt as submissionDate,
      assign.id as assignmentId,co.courseId as courseId, co.name as courseName,re.name as assignmentName,u.name as studentName,
      ev.id as status
      FROM AssignmentSubmission as sub
      INNER JOIN Assignment as assign ON sub.assignmentId = assign.id
      INNER JOIN User as u ON u.id = sub.studentId 
      INNER JOIN Resource as re ON assign.lessonId = re.resourceId
      INNER JOIN Chapter as ch ON re.chapterId = ch.chapterId
      INNER JOIN Course as co ON co.courseId = ch.courseId 
      LEFT OUTER JOIN AssignmentEvaluation as ev ON ev.submissionId = sub.id
      WHERE ch.state = ${$Enums.StateType.ACTIVE} AND co.courseId = ${courseId}  AND re.state = ${$Enums.StateType.ACTIVE} AND co.authorId = ${token?.id} AND sub.status <> ${submissionStatus.NOT_SUBMITTED}
      ORDER BY submissionDate;`;

    const mapByCourseId: Map<string, string> = resultRows.reduce((map, submission) => {
      let data = {
        subId: submission.subId,
        assignmentName: submission.assignmentName,
        studentName: submission.studentName,
        assignmentId: submission.assignmentId,
        studentId: submission.studentId,
        submissionDate: generateDayAndYear(submission.submissionDate),
        isEvaluated: submission.status ? true : false,
      };
      if (!map[`${submission.courseId}--${submission.courseName}`]) {
        map[`${submission.courseId}--${submission.courseName}`] = [];
      }
      map[`${submission.courseId}--${submission.courseName}`].push(data);
      return map;
    }, {});

    return res.status(200).json({
      success: true,
      message: "Submission list has been fetched",
      submissionList: mapByCourseId,
    });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};
export default withMethods(["GET"], withAuthentication(withUserAuthorized(handler)));
