import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
// const cheerio = require("cheerio");

class NotificationsHandler {
  async notificationForQuery(discussionId: number): Promise<APIResponse<string>> {
    const findDiscussionDetail = await prisma.discussion.findUnique({
      where: {
        id: discussionId,
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
        comment: true,
        userId: true,
        resourceId: true,
        resource: {
          select: {
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

    if (
      findDiscussionDetail &&
      findDiscussionDetail?.resource.chapter.course.authorId !== findDiscussionDetail.userId
    ) {
      await prisma.notification.create({
        data: {
          notificationType: "COMMENT",
          toUserId: findDiscussionDetail?.resource.chapter.course.authorId,
          commentId: discussionId,
          fromUserId: findDiscussionDetail?.userId,
          resourceId: findDiscussionDetail?.resourceId,
          title: `${findDiscussionDetail.user.name} has posted a query`,
          description: "Test description",
        },
      });
      return new APIResponse(true, 200, "Notification has been created");
    } else {
      return new APIResponse(false, 404, "Discussion not found");
    }
  }
}

export default new NotificationsHandler();
