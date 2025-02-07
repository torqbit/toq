import { DiscussionNotification } from "@/types/notification";
import { NotificationType } from "@prisma/client";
import QueryView from "./QueryView";
import EnrolledView from "./EnrolledView";

// create separate components

const NotificationView = (
  detail: any
): { message: React.ReactNode; description: React.ReactNode; objectId?: string; targetLink?: string } => {
  switch (detail.notificationType) {
    case NotificationType.POST_QUERY:
      let info = detail as DiscussionNotification;
      return QueryView(info);
    case NotificationType.REPLY_QUERY:
      let replyInfo = detail as DiscussionNotification;
      return QueryView(replyInfo);
    case NotificationType.ENROLLED:
      let enrollInfo = detail as DiscussionNotification;
      return EnrolledView(enrollInfo);
    default:
      return {
        message: <></>,
        description: <></>,
      };
  }
};

export default NotificationView;
