import { Card, Flex, Tooltip } from "antd";
import { FC } from "react";
import styles from "../AiChat.module.scss";
import moment from "moment";
import { customFromNow } from "@/services/momentConfig";
import SvgIcons from "@/components/SvgIcons";
moment.locale("en", { ...customFromNow });

const ChatHistoryCard: FC<{ conversationId: string; message: string; lastActiveDate: Date }> = ({
  message,
  conversationId,
  lastActiveDate,
}) => {
  return (
    <Card className={styles.chat__history__card}>
      <Flex justify="space-between" className="group">
        <div>
          <h4>{message}</h4>
          <p>Last message {moment(new Date(lastActiveDate), "YYYY-MM-DDThh:mm:ss").fromNow()} ago</p>
        </div>
        <Tooltip title="Delete">
          <i
            className="group-hover:flex hidden "
            style={{ lineHeight: 0, fontSize: 18, color: "var(--font-secondary)" }}
          >
            {SvgIcons.delete}
          </i>
        </Tooltip>
      </Flex>
    </Card>
  );
};

export default ChatHistoryCard;
