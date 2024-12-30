import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const query = req.query;

    const { courseListPreview } = query;

    if (token?.role === Role.ADMIN || courseListPreview === "true") {
      const allCourse = await prisma.course.findMany({
        select: {
          courseId: true,
          name: true,
          difficultyLevel: true,
          state: true,
          description: true,
          totalResources: true,
          previewMode: true,
          slug: true,
          user: {
            select: {
              name: true,
            },
          },
          chapters: {
            select: {
              resource: {
                select: {
                  video: {
                    select: {
                      videoDuration: true,
                    },
                  },
                  assignment: {
                    select: {
                      estimatedDuration: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        info: false,
        success: true,
        message: "course successfully fetched",
        courses: allCourse,
      });
    } else if (token?.role === Role.AUTHOR && courseListPreview === "false") {
      const allCourse = await prisma.course.findMany({
        where: {
          authorId: token.id,
        },
        select: {
          courseId: true,
          name: true,
          difficultyLevel: true,
          state: true,
          slug: true,

          description: true,
          totalResources: true,
          previewMode: true,
          user: {
            select: {
              name: true,
            },
          },
          chapters: {
            select: {
              resource: {
                select: {
                  video: {
                    select: {
                      videoDuration: true,
                    },
                  },
                  assignment: {
                    select: {
                      estimatedDuration: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        info: false,
        success: true,
        message: "course successfully fetched",
        courses: allCourse,
      });
    } else {
      return res.status(403).json({ success: false, error: "You are not Authorized " });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);
