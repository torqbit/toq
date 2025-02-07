import { Badge, Button, Flex, message, Popover } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import { FC, useState } from "react";
import SvgIcons from "../SvgIcons";
import { useAppContext } from "../ContextApi/AppContext";
import { PageSiteConfig } from "@/services/siteConstant";
import styles from "./Notification.module.scss";
import NotificationList from "./NotificationList";
import NotificationService from "@/services/NotificationService";

const NotificationPopOver: FC<{
  minWidth: string;
  placement: TooltipPlacement;
  siteConfig: PageSiteConfig;
  showNotification: boolean;
  onOpenNotification: (value: boolean) => void;
}> = ({ placement, siteConfig, minWidth, showNotification, onOpenNotification }) => {
  const { globalState } = useAppContext();
  const [markLoading, setMarkLoading] = useState<boolean>(false);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);

  const [messageApi, contextHolder] = message.useMessage();
  const onMarkAll = () => {
    setMarkLoading(true);

    NotificationService.markAllRead(
      (result) => {
        messageApi.success("All notification has been read");
        setMarkLoading(false);
      },
      (error) => {
        messageApi.error(error);
        setMarkLoading(false);
      }
    );
  };
  const isDisabled = !globalState.notifications || globalState.notifications === 0;
  return (
    <Popover
      style={{
        marginTop: 2,
        overflowY: "auto",
        height: "30vh",
        border: "1px solid var(--border-color)",
      }}
      content={
        <div style={{ minWidth, height: "70vh", overflowY: "auto", padding: "0 10px" }}>
          <NotificationList
            popOver={showNotification}
            setOpenNotification={onOpenNotification}
            setTotalNotifications={setTotalNotifications}
            siteConfig={siteConfig}
            limit={5}
          />
        </div>
      }
      title={
        <Flex style={{ padding: "0 10px" }} align="center" justify="space-between">
          <h4>Notifications</h4>
          {totalNotifications > 0 && (
            <Button disabled={isDisabled} loading={markLoading} onClick={onMarkAll} style={{ height: 32 }} size="small">
              {isDisabled ? "All read" : "Mark all as read"}
            </Button>
          )}
        </Flex>
      }
      placement={placement}
      trigger="click"
      open={showNotification}
      onOpenChange={onOpenNotification}
    >
      {contextHolder}
      <Badge
        color="blue"
        classNames={{ indicator: styles.badgeIndicator }}
        count={globalState.notifications && globalState.notifications > 0 ? globalState.notifications : 0}
        style={{ fontSize: 10, paddingTop: 1.5 }}
        size="small"
      >
        <i style={{ lineHeight: 0, color: "var(--font-secondary)", fontSize: 20, cursor: "pointer" }}>
          {SvgIcons.notification}
        </i>
      </Badge>
    </Popover>
  );
};

export default NotificationPopOver;
