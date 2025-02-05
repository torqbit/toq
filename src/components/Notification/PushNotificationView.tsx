import { DiscussionNotification } from "@/types/notification";
import { NotificationType } from "@prisma/client";
import PostQueryView from "./PostQueryView";

// create separate components

const pushNotificationView = (
  detail: any
): { message: React.ReactNode; description: React.ReactNode; targetLink?: string } => {
  switch (detail.notificationType) {
    case NotificationType.POST_QUERY:
      let info = detail as DiscussionNotification;
      return PostQueryView(info);

    default:
      return {
        message: <></>,
        description: <></>,
      };
  }
};

export default pushNotificationView;
