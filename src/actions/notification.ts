import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
import { DiscussionNotification, INotificationListDetail, ISendNotificationProps } from "@/types/notification";
import { EntityType, Notification, NotificationType } from "@prisma/client";

class NotificationsHandler {
  async createNotification(data: ISendNotificationProps): Promise<APIResponse<string>> {
    const res = await prisma.notification.create({
      data: {
        ...data,
        activity: data.activity,
      },
    });

    return new APIResponse(true, 200, "Notification has been created");
  }

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
          return this.discussionViewDetail(res);
        case NotificationType.REPLY_QUERY:
          return this.discussionViewDetail(res);

        case NotificationType.ENROLLED:
          return this.enrolledViewDetail(res);
        default:
          return this.discussionViewDetail(res);
      }
    } else {
      return new APIResponse(false, 404, "No notification found");
    }
  }

  async getAllNotifications(
    userId: string,
    limit: number,
    offSet: number
  ): Promise<APIResponse<INotificationListDetail>> {
    let totalNotifications = 0;
    const allNotifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },

      orderBy: {
        createdAt: "desc",
      },
      skip: offSet,
      take: limit,
    });
    if (allNotifications && allNotifications.length > 0) {
      totalNotifications = await prisma.notification.count({
        where: {
          recipientId: userId,
        },
      });

      let detail = await Promise.all(
        allNotifications.map((res) => {
          switch (res.notificationType) {
            case NotificationType.POST_QUERY:
              return this.discussionViewDetail(res);
            case NotificationType.REPLY_QUERY:
              return this.discussionViewDetail(res);

            case NotificationType.ENROLLED:
              return this.enrolledViewDetail(res);
            default:
              return this.discussionViewDetail(res);
          }
        })
      );

      const list = detail && detail.length > 0 ? detail.map((d) => d.body as DiscussionNotification) : [];

      return new APIResponse(true, 200, "Notification list has been fetched", {
        list: list,
        notificationsCount: totalNotifications,
      });
    } else {
      return new APIResponse(false, 404, "No Notification found");
    }
  }

  async enrolledViewDetail(detail: Notification): Promise<APIResponse<DiscussionNotification>> {
    let rawData: any[];
    let targetLink;

    if (detail.objectType == EntityType.COURSE) {
      rawData = await prisma.$queryRaw<any[]>`
      SELECT 
        co.name AS name,
        usr.name AS subjectName,
        usr.image AS subjectImage
      FROM Course AS co
      INNER JOIN User AS  usr ON  usr.id = ${detail.subjectId}
      WHERE co.courseId = ${detail.objectId} 
      LIMIT 1;
    `;
      targetLink = `/academy/course/${detail.objectId}/manage`;
    } else {
      rawData = await prisma.$queryRaw<any[]>`
      SELECT 
      lPath.title AS name,
        usr.name AS subjectName,
        usr.image AS subjectImage
      FROM LearningPath AS lPath
      INNER JOIN User AS  usr ON  usr.id = ${detail.subjectId}
      WHERE lPath.id = ${detail.objectId} 
      LIMIT 1;
    `;
      targetLink = `/academy/path/${detail.objectId}/manage`;
    }

    if (rawData.length > 0) {
      let response: DiscussionNotification = {
        object: {
          _type: detail.objectType,
          id: detail.objectId,
          name: String(rawData[0].name),
        },
        subject: {
          name: rawData[0].subjectName,
          image: rawData[0].subjectImage,
          _type: EntityType.USER,
        },
        notificationType: detail.notificationType,

        createdAt: detail.createdAt,
        targetLink,
        hasViewed: detail.hasViewed,
      };
      return new APIResponse(true, 200, "Detail has been fetched", response);
    } else {
      return new APIResponse(false, 404, "No detail found");
    }
  }

  async discussionViewDetail(detail: Notification): Promise<APIResponse<DiscussionNotification>> {
    const rawData = await prisma.$queryRaw<any[]>`
  SELECT 
    dis.id AS discussionId, 
    res.name AS lessonName, 
    usr.name AS subjectName, 
    usr.image AS subjectImage, 
    co.slug AS courseSlug,
    dis.parentCommentId as pId,
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
    let targetLink;

    if (rawData.length > 0) {
      switch (detail.notificationType) {
        case NotificationType.POST_QUERY:
          targetLink = `/courses/${rawData[0].courseSlug}/lesson/${rawData[0].lessonId}?tab=discussions&queryId=${rawData[0].discussionId}`;

          break;

        case NotificationType.REPLY_QUERY:
          targetLink = `/courses/${rawData[0].courseSlug}/lesson/${rawData[0].lessonId}?tab=discussions&threadId=${rawData[0].pId}`;
          break;

        default:
          targetLink = undefined;
          break;
      }
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
        targetLink,
        hasViewed: detail.hasViewed,
      };
      return new APIResponse(true, 200, "Detail has been fetched", response);
    } else {
      return new APIResponse(false, 404, "No detail found");
    }
  }
}

export default new NotificationsHandler();
