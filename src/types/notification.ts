import { NotificationType, EntityType, Notification } from "@prisma/client";

export interface ISendNotificationProps {
  notificationType: NotificationType;
  recipientId: string;
  subjectId: string;
  subjectType: EntityType;
  objectId: string;
  objectType: EntityType;
  activity?: string;
}

export interface INotificationListDetail {
  list: DiscussionNotification[];
  notificationsCount: number;
}

export interface NotificationPreview {
  notificationType: NotificationType;
  hasViewed?: boolean;
  createdAt: Date;
}

export interface DiscussionNotification extends NotificationPreview {
  object: {
    _type: EntityType;
    id: string;
    name: string;
  };
  subject: {
    name: string;
    image?: string;
    _type: EntityType;
  };
  activity?: string;
  targetLink?: string;
}
