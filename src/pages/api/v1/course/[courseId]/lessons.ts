import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import getLessonDetail from "@/actions/getLessonDetail";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";
import { getPercentage } from "@/services/helper";

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

    const hasAccess = await getCourseAccessRole(token?.role, token?.id, Number(courseId));

    const detail = await getLessonDetail(
      Number(courseId),
      hasAccess?.role,
      token?.id,
      hasAccess.isLearningPath ? hasAccess.productId : undefined
    );

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
            assignmentStatus: r.assignmentStatus,
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
                assignmentStatus: r.assignmentStatus,
              },
            ],
          });
        }
      });

    let totalLessons =
      chapterLessons.map((l) => l.lessons).length > 0 ? chapterLessons.map((l) => l.lessons)[0].length : 0;
    let watchedLessons =
      chapterLessons.map((l) => l.lessons).length > 0
        ? chapterLessons.map((l) => l.lessons.filter((f: any) => f.isWatched == true))[0].length
        : 0;
    const progress = getPercentage(watchedLessons, totalLessons);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetched course lessons",
      course: {
        name: courseName,
        description: description,
        previewMode: previewMode === 1 ? true : false,
        userRole: hasAccess?.role,
        progress,
      },
      lessons: chapterLessons,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
