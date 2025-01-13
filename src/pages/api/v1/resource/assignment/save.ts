import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { AssignmentCreateRequest } from "@/types/courses/assignment";
import { JsonObject } from "@prisma/client/runtime/library";
import { APIResponse } from "@/types/apis";
import getUserRole from "@/actions/getRole";
import { Role } from "@prisma/client";
import { getCookieName } from "@/lib/utils";
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

    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

    const body = req.body as AssignmentCreateRequest;
    const { lessonId, title, estimatedDurationInMins, details, maximumScore, passingScore } = body;
    const unDetails = details as any;

    const lessonCount = await prisma.assignment.count({
      where: {
        lessonId: lessonId,
      },
    });

    if (title) {
      await prisma?.resource.update({
        where: {
          resourceId: lessonId,
        },
        data: {
          name: title,
        },
      });
    }

    if (lessonCount > 0) {
      await prisma.assignment.update({
        data: {
          content: unDetails as JsonObject,
          estimatedDuration: estimatedDurationInMins,
          maximumPoints: maximumScore,
          passingScore: passingScore,
        },
        where: {
          lessonId: Number(lessonId),
        },
      });

      return res.status(200).json(new APIResponse(true, 200, "Assignment has been updated"));
    } else {
      await prisma.assignment.create({
        data: {
          content: unDetails as JsonObject,
          estimatedDuration: estimatedDurationInMins,
          maximumPoints: maximumScore,
          passingScore: passingScore,
          lessonId: lessonId,
        },
      });
      return res.status(200).json(new APIResponse(true, 200, "Assignment has been created"));
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};
export default withMethods(["POST"], withUserAuthorized(handler));
