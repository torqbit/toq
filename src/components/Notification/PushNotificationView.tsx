import { DiscussionNotification } from "@/types/notification";
import { EntityType, NotificationType } from "@prisma/client";
import { Avatar, Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PostQueryView from "./PostQueryView";
import { ReactNode } from "react";

// create separate components

const pushNotificationView = (detail: any): { message: ReactNode; description: ReactNode; onClick?: () => void } => {
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
