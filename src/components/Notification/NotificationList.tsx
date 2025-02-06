import React, { FC, useState } from "react";
import styles from "./Notification.module.scss";
import { useSession } from "next-auth/react";
import { Avatar, Badge, Button, Divider, Flex, List, Skeleton } from "antd";

import Link from "next/link";
import { truncateString } from "@/services/helper";
import moment from "moment";
import NotificationService from "@/services/NotificationService";
import { INotification } from "@/lib/types/discussions";
import { DummydataList, getDummyArray } from "@/lib/dummyData";
import { useRouter } from "next/router";
import { getFetch } from "@/services/request";
import { UserOutlined } from "@ant-design/icons";
import PurifyContent from "@/components/PurifyContent/PurifyContent";

import { PageSiteConfig } from "@/services/siteConstant";
import { EmptyNotification } from "@/components/SvgIcons";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { getIconTheme } from "@/services/darkThemeConfig";
import { DiscussionNotification } from "@/types/notification";
import NotificationView from "./NotificationView";

const NotificationList: FC<{ siteConfig: PageSiteConfig; limit: number; popOver: boolean }> = ({
  siteConfig,
  limit = 10,
  popOver,
}) => {
  const router = useRouter();
  const { data: user } = useSession();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDatatLoading] = useState<boolean>();
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

  const updateNotification = async (id: number, updateAll: boolean, targetLink?: string) => {
    try {
      let apiPath = updateAll ? `/api/v1/notification/updateMany/update` : `/api/v1/notification/update/${id}`;
      getFetch(apiPath);
      targetLink && router.push(targetLink);
    } catch (err) {}
  };

  const onLoadMore = () => {
    setLoading(true);
    NotificationService.getNotifications(notificationsList?.length, 5, (result) => {
      if (result.success && result.body) {
        setNotificationsList(notificationsList?.concat(result.body?.list));
      }
    });
    setLoading(false);
  };

  React.useEffect(() => {
    if (user) {
      getNotification();
    }
  }, [user]);

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
                  updateNotification(Number(item.object.id), false, item.targetLink);
                }}
              >
                <Flex vertical gap={10} style={{ marginTop: 5, cursor: "pointer" }} key={i}>
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
