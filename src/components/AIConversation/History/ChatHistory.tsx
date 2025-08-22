import { useAppContext } from "@/components/ContextApi/AppContext";
import ChatService from "@/services/client/ai/ChatService";
import { LoadingOutlined } from "@ant-design/icons";
import { TenantRole } from "@prisma/client";
import { Button, Flex, Spin } from "antd";
import { FC, useEffect, useState } from "react";
import ChatHistoryCard from "./ChatHistoryCard";
import styles from "../AiChat.module.scss";
import SvgIcons from "@/components/SvgIcons";
const ChatHistory: FC<{ userRole?: TenantRole }> = ({ userRole }) => {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getChatHistory = () => {
    setLoading(true);
    ChatService.getChatHistory(
      10,
      (result) => {
        setChatHistory(result);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (userRole) {
      getChatHistory();
    }
  }, [userRole]);

  return (
    <section className={styles.chat__history}>
      <Flex vertical align="center" justify="center">
        {loading ? (
          <Spin spinning indicator={<LoadingOutlined />} fullscreen />
        ) : (
          <Flex vertical gap={40}>
            <Flex align="center" justify="space-between">
              <h3>Your chat history</h3>
              <Button
                icon={<i style={{ lineHeight: 0, fontSize: 18, color: "var(--font-secondary)" }}>{SvgIcons.plusBtn}</i>}
              >
                New Chat
              </Button>
            </Flex>
            <Flex>
              {chatHistory.length > 0 ? (
                <Flex vertical gap={20}>
                  {chatHistory.map((c, i) => {
                    return (
                      <ChatHistoryCard
                        key={i}
                        conversationId={c.id}
                        message={c.messages[0].content}
                        lastActiveDate={c.messages[0].createdAt}
                      />
                    );
                  })}
                </Flex>
              ) : (
                <></>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </section>
  );
};

export default ChatHistory;
