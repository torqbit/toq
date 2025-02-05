import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
import { DiscussionNotification, ISendNotificationProps } from "@/types/notification";
import { EntityType, Notification, NotificationType } from "@prisma/client";

class NotificationsHandler {
  async postQuery(data: ISendNotificationProps): Promise<APIResponse<string>> {
    const res = await prisma.notification.create({
      data: {
        ...data,
        activity: data.activity,
      },
    });

    return new APIResponse(true, 200, "Notification has been created");
  }

  async queryReplied(data: ISendNotificationProps) {}

  async fetchPushNotificaton(userId: string, createTime: Date): Promise<APIResponse<any>> {
    const res = await prisma.notification.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        recipientId: userId,
        hasViewed: false,
        createdAt: {
          gt: createTime,
        },
      },
    });

    if (res) {
      switch (res?.notificationType) {
        case NotificationType.POST_QUERY:
          return this.getPostQueryViewDetail(res);

        default:
          return this.getPostQueryViewDetail(res);
      }
    } else {
      return new APIResponse(false, 404, "No notification found");
    }
  }

  async getPostQueryViewDetail(detail: Notification): Promise<APIResponse<DiscussionNotification>> {
    const rawData = await prisma.$queryRaw<any[]>`
  SELECT 
    dis.id AS discussionId, 
    res.name AS lessonName, 
    usr.name AS subjectName, 
    usr.image AS subjectImage, 
    co.slug AS courseSlug
    res.resourceId AS lessonId
  FROM Discussion AS dis
  INNER JOIN Resource AS res ON dis.resourceId = res.resourceId
  INNER JOIN User AS  usr ON dis.userId = usr.id
  INNER JOIN Chapter AS ch ON res.chapterId = ch.chapterId
  INNER JOIN Course AS co ON ch.courseId = co.courseId
  WHERE dis.id = ${detail.objectId} 
  AND dis.userId = ${detail.subjectId}
  LIMIT 1;
`;

    if (rawData.length > 0) {
      let response: DiscussionNotification = {
        object: {
          _type: detail.objectType,
          id: detail.objectId,
          name: String(rawData[0].lessonName),
        },
        subject: {
          name: rawData[0].subjectName,
          image: rawData[0].subjectImage,
          _type: EntityType.USER,
        },
        notificationType: detail.notificationType,
        activity: detail.activity || undefined,
        createdAt: detail.createdAt,
        targetLink: `/courses/${rawData[0].courseSlug}/lesson/${rawData[0].lessonId}?tab=discussions&queryId=${rawData[0].discussionId}`,
      };
      return new APIResponse(true, 200, "Detail has been fetched", response);
    } else {
      return new APIResponse(false, 404, "No detail found");
    }
  }
}

export default new NotificationsHandler();
