import { DiscussionNotification } from "@/types/notification";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Flex } from "antd";
import styles from "./Notification.module.scss";
import { NotificationType } from "@prisma/client";

const QueryView = (info: DiscussionNotification) => {
  return {
    message: (
      <div className={styles.message__wrapper} style={{ display: "flex", gap: 10 }}>
        <Badge
          style={{
            color: "var(--btn-primary)",
            background: "var(--btn-primary)",
          }}
          dot={!info.hasViewed}
        >
          <Avatar
            src={info.subject.image}
            className={styles.notification__avatar}
            icon={<UserOutlined size={25} />}
            alt="Profile"
          />
        </Badge>
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
          <div className={styles.description__wrapper}>
            <p>{info.activity}</p>
          </div>
        ) : (
          <></>
        )}
      </>
    ),
    objectId: info.object.id,
    targetLink: info.targetLink,
  };
};

export default QueryView;
