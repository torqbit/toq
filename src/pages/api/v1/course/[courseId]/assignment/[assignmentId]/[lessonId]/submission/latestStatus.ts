import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { getCookieName } from "@/lib/utils";
import { submissionStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { assignmentId, lessonId } = req.query;
  try {
    const cookieName = getCookieName();

    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

    const latestSubmissions = await prisma.assignmentSubmission.findMany({
      where: {
        lessonId: Number(lessonId),
        assignmentId: Number(assignmentId),
        studentId: String(token?.id),
        NOT: {
          status: submissionStatus.NOT_SUBMITTED,
        },
      },
      select: {
        status: true,
        evaluation: {
          select: {
            score: true,
            maximumScore: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestSubmissions.length > 0) {
      const maxScore = latestSubmissions.sort((a, b) => Number(b.evaluation?.score) - Number(a.evaluation?.score))[0]
        .evaluation?.score;

      let latestSubmissionStatus = latestSubmissions[0].status;
      if (latestSubmissions.length === 3 && latestSubmissionStatus !== submissionStatus.PENDING) {
        if (latestSubmissions.filter((f) => f.status === submissionStatus.FAILED).length === 3) {
          latestSubmissionStatus = submissionStatus.COMPLETED;
        } else if (latestSubmissions.filter((f) => f.status === submissionStatus.PASSED).length > 0) {
          latestSubmissionStatus = submissionStatus.PASSED;
        }
      }

      return res.status(200).json({
        success: true,
        latestSubmissionStatus,
        score: latestSubmissions[0].evaluation?.score,
        maximumScore: latestSubmissions[0].evaluation?.maximumScore,
        submitLimit: latestSubmissions.length,
      });
    } else {
      return res.status(200).json({ success: true, allSubmmissions: [], submitLimit: 0 });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
