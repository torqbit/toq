import React, { FC, useState } from "react";
import styles from "./Notification.module.scss";
import { Button, Divider, Flex, Skeleton } from "antd";
import moment from "moment";
import NotificationService from "@/services/NotificationService";
import { getDummyArray } from "@/lib/dummyData";
import { useRouter } from "next/router";
import { getFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import { EmptyNotification } from "@/components/SvgIcons";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { getIconTheme } from "@/services/darkThemeConfig";
import { DiscussionNotification } from "@/types/notification";
import NotificationView from "./NotificationView";

const NotificationList: FC<{
  siteConfig: PageSiteConfig;
  limit: number;
  popOver: boolean;
  setTotalNotifications: (value: number) => void;
  setOpenNotification: (value: boolean) => void;
}> = ({ siteConfig, setTotalNotifications, limit = 10, popOver, setOpenNotification }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [notificationsList, setNotificationsList] = useState<DiscussionNotification[]>();
  const { globalState } = useAppContext();

  const getNotification = async () => {
    try {
      setLoading(true);
      NotificationService.getNotifications(0, limit, (result) => {
        if (result.success && result.body) {
          setNotificationsList(result.body.list);
          setNotificationsCount(result.body?.notificationsCount);
          setTotalNotifications(result.body.notificationsCount);
        } else {
          setNotificationsList([]);
          setNotificationsCount(0);
        }

        setLoading(false);
      });
    } catch (err: any) {
      console.log(err);
      setLoading(false);
    }
  };

  const updateNotification = async (id: number, targetLink?: string) => {
    try {
      let apiPath = `/api/v1/notification/update/${id}`;
      getFetch(apiPath);
      setOpenNotification(false);

      targetLink && router.push(targetLink);
    } catch (err) {}
  };

  const onLoadMore = () => {
    setLoading(true);
    NotificationService.getNotifications(notificationsList?.length, 5, (result) => {
      if (result.success && result.body) {
        setNotificationsList(notificationsList?.concat(result.body?.list));
        setNotificationsCount(result.body.notificationsCount);
        setTotalNotifications(result.body.notificationsCount);
      }
    });
    setLoading(false);
  };

  React.useEffect(() => {
    if (popOver) {
      getNotification();
    }
  }, [popOver]);

  return (
    <div className={styles.notification__list__wrapper}>
      {(!notificationsList || loading) && (
        <Flex vertical style={{ marginTop: 10 }}>
          {getDummyArray(4).map((d, i) => {
            return (
              <Flex gap={20} key={i}>
                <Skeleton.Avatar />
                <Skeleton paragraph={{ rows: 2 }} />
              </Flex>
            );
          })}
        </Flex>
      )}
      {notificationsList && notificationsList?.length == 0 && !loading && (
        <Flex vertical align="center" justify="center">
          <EmptyNotification size="200px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />
          <h4>No Notifications found</h4>
        </Flex>
      )}

      {notificationsList && notificationsList.length > 0 && !loading && (
        <Flex vertical gap={10}>
          {notificationsList.map((item, i) => {
            const getNotificationView = NotificationView(item);
            return (
              <div
                onClick={() => {
                  updateNotification(Number(item.object.id), item.targetLink);
                }}
              >
                <Flex vertical gap={10} style={{ marginTop: 5, cursor: "pointer", maxWidth: 440 }} key={i}>
                  <Flex justify="space-between">
                    {getNotificationView.message}
                    <span>{moment(new Date(item.createdAt), "YYYY-MM-DDThh:mm:ss").fromNow()}</span>
                  </Flex>
                  {getNotificationView.description}
                </Flex>
                {notificationsList.length !== i + 1 && <Divider />}
              </div>
            );
          })}
          {notificationsCount > 5 && notificationsList.length !== notificationsCount && (
            <Divider>
              <Button onClick={onLoadMore} style={{ width: "fit-content" }} type="text">
                Load more
              </Button>
            </Divider>
          )}
        </Flex>
      )}
    </div>
  );
};

export default NotificationList;
