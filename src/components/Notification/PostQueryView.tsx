import { DiscussionNotification } from "@/types/notification";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex } from "antd";
import styles from "./Notification.module.scss";
import { NotificationType } from "@prisma/client";

const PostQueryView = (info: DiscussionNotification) => {
  return {
    message: (
      <div className={styles.message__wrapper} style={{ display: "flex", gap: 10 }}>
        <Avatar
          src={info.subject.image}
          className={styles.notification__avatar}
          icon={<UserOutlined size={25} />}
          alt="Profile"
        />
        <div>
          <span>{info.subject.name}</span>{" "}
          {info.notificationType == NotificationType.POST_QUERY ? "posted a query" : "replied to a query"} in
          <span> {info.object.name}</span>
        </div>
      </div>
    ),
    description: (
      <>
        {info.activity ? (
          <div style={{ padding: 10, borderRadius: 4, backgroundColor: "var(--bg-secondary)" }}>
            <p style={{ textAlign: "left" }}>{info.activity}</p>
          </div>
        ) : (
          <></>
        )}
      </>
    ),
    targetLink: info.targetLink,
  };
};

export default PostQueryView;
