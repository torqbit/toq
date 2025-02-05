import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import getRoleByLessonId from "@/actions/getRoleByLessonId";
import { EntityType, NotificationType, ResourceContentType, Role } from "@prisma/client";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";
import NotificationHandler from "@/actions/notification";
import { ISendNotificationProps } from "@/types/notification";
/**
 * Post reply on a query
 * @param req
 * @param res
 * @returns
 */
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

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const body = await req.body;
    const { lessonId, slug, comment, parentCommentId } = body;

    const userRole = await getCourseAccessRole(token?.role, token?.id, slug, true);

    if (userRole.role !== Role.NOT_ENROLLED) {
      const addDiscussion = await prisma.discussion.create({
        data: {
          userId: String(token?.id),
          resourceId: lessonId,
          comment: comment,
          parentCommentId: parentCommentId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
          resource: {
            select: {
              contentType: true,
              chapter: {
                select: {
                  course: {
                    select: {
                      authorId: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const queryAuthor = await prisma.discussion.findUnique({
        where: {
          id: parentCommentId,
        },
        select: {
          userId: true,
        },
      });
      const courseAuthorId = addDiscussion.resource.chapter.course.authorId;

      if (queryAuthor && queryAuthor.userId !== courseAuthorId && String(token?.id) == courseAuthorId) {
        let notificationData: ISendNotificationProps = {
          notificationType: NotificationType.REPLY_QUERY,
          recipientId: queryAuthor?.userId,
          subjectId: String(token?.id),
          subjectType: EntityType.USER,
          objectId: String(addDiscussion.id),
          objectType:
            addDiscussion.resource.contentType === ResourceContentType.Video
              ? EntityType.VIDEO_LESSON
              : EntityType.ASSIGNMENT_LESSON,
        };

        NotificationHandler.createNotification(notificationData);
      }

      return res.status(200).json({ success: true, comment: addDiscussion, message: "Reply has been posted" });
    } else {
      return res.status(400).json({ success: false, error: "You are not enrolled to this course" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));
