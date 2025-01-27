import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import getLessonDetail from "@/actions/getLessonDetail";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;

    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    let chapterLessons: any[] = [];
    let courseName;
    let description;
    let previewMode;
    let estimatedDuration;

    const isAccess = await getCourseAccessRole(token?.role, token?.id, Number(courseId));

    const detail = await getLessonDetail(Number(courseId), isAccess?.role, token?.id);

    if (detail?.lessonDetail && detail.lessonDetail.length > 0) {
      courseName = detail?.lessonDetail[0].courseName;
      description = detail?.lessonDetail[0].description;
      previewMode = detail?.lessonDetail[0].previewMode;
      estimatedDuration = detail.lessonDetail[0].estimatedDuration;
    }
    detail?.lessonDetail &&
      detail?.lessonDetail.forEach((r) => {
        if (chapterLessons.find((l) => l.chapterSeq == r.chapterSeq)) {
          const chapter = chapterLessons.find((l) => l.chapterSeq == r.chapterSeq);
          chapter.lessons.push({
            videoId: r.videoId,
            title: r.lessonName,
            videoDuration: r.videoDuration,
            description: r.lessonDescription,
            lessonId: r.resourceId,
            videoUrl: r.videoUrl,
            isWatched: r.watchedRes != null,
            contentType: r.contentType,
            estimatedDuration: r.estimatedDuration,
          });
        } else {
          chapterLessons.push({
            chapterSeq: r.chapterSeq,
            chapterName: r.chapterName,
            lessons: [
              {
                videoId: r.videoId,
                title: r.lessonName,
                videoDuration: r.videoDuration,
                description: r.lessonDescription,
                lessonId: r.resourceId,
                videoUrl: r.videoUrl,
                isWatched: r.watchedRes != null,
                contentType: r.contentType,
                estimatedDuration: r.estimatedDuration,
              },
            ],
          });
        }
      });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetched course lessons",
      course: {
        name: courseName,
        description: description,
        previewMode: previewMode === 1 ? true : false,
        userRole: isAccess?.role,
      },
      lessons: chapterLessons,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
