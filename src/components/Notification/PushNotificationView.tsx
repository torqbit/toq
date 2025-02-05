import { DiscussionNotification } from "@/types/notification";
import { EntityType, NotificationType } from "@prisma/client";
import { Avatar, Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PostQueryView from "./PostQueryView";

// create separate components

const pushNotificationView = (detail: any) => {
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
