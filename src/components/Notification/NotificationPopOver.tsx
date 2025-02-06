import { Badge, Popover } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import { FC } from "react";
import SvgIcons from "../SvgIcons";
import { useAppContext } from "../ContextApi/AppContext";
import { PageSiteConfig } from "@/services/siteConstant";
import styles from "./Notification.module.scss";
import NotificationList from "./NotificationList";

const NotificationPopOver: FC<{
  minWidth: string;
  placement: TooltipPlacement;
  siteConfig: PageSiteConfig;
  showNotification: boolean;
  onOpenNotification: (value: boolean) => void;
}> = ({ placement, siteConfig, minWidth, showNotification, onOpenNotification }) => {
  const { globalState } = useAppContext();
  return (
    <Popover
      style={{
        marginTop: 2,
        overflowY: "auto",
        height: "30vh",
        border: "1px solid var(--border-color)",
      }}
      content={
        <div style={{ minWidth, height: "70vh", overflowY: "auto" }}>
          <NotificationList popOver siteConfig={siteConfig} limit={5} />
        </div>
      }
      placement={placement}
      trigger="click"
      open={showNotification}
      onOpenChange={onOpenNotification}
    >
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
