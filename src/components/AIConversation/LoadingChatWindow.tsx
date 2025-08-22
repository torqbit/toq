import { FC, useEffect, useRef, useState } from "react";
import MarkdownToJsx from "../MarkdownToJsx/MarkdownToJsx";
import { useAppContext } from "../ContextApi/AppContext";
import { AIGradientLoader } from "./AIChatWidget";
import styles from "./AiChat.module.scss";
import PurifyContent from "../PurifyContent/PurifyContent";
import ScrollToBottomButton from "./ScrollButton";

import { MessageUserType } from "@prisma/client";
import { useMediaQuery } from "react-responsive";

export interface IConversationHistoryResponse {
  content: string | null;
  createdAt: Date;
  userType: MessageUserType;
}

const Greeting: FC<{ userName: string }> = ({ userName }) => {
  return (
    <>
      <h1 className={styles.greeting__title}>Hello, {userName}!</h1>
      <h4 className={styles.greeting__subtitle}>What&apos;s on your mind</h4>
    </>
  );
};

export const LoadingChatWindow: FC<{
  showLoading: boolean;
  showWidget: boolean;
  previewMode: boolean;
  isResponseStreaming: boolean;
  conversationHistory: IConversationHistoryResponse[];
  slideDown: boolean;
  userName: string;
  chatResponse?: string;
  userQuery?: string;
  embedMode?: boolean;
}> = ({
  showLoading,
  showWidget,
  previewMode,
  conversationHistory,
  isResponseStreaming,
  userName,
  slideDown,
  chatResponse,
  userQuery,
  embedMode,
}) => {
  const { globalState } = useAppContext();
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const prevScrollTopRef = useRef(0);
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const answerBottomOffset = embedMode ? "300px" : "320px";

  const handleScroll = () => {
    if (chatContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
      // Check if the user is very close to the bottom (within a small threshold)
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10 pixels buffer
      prevScrollTopRef.current = scrollTop;
      setIsScrolledToBottom(atBottom);
    }
  };

  useEffect(() => {
    const container = chatContentRef.current;
    if (!container) return;

    if (isScrolledToBottom) {
      container.scrollTop = prevScrollTopRef.current;
    }
    setTimeout(() => {
      triggerScroll();
    }, 200);
  }, [conversationHistory.length, slideDown]);

  const triggerScroll = () => {
    const el = chatContentRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div
      className={`${styles.loading__chat_response} ${showWidget ? "grow" : "shrink"}`}
      style={{
        minHeight: isMobile ? 230 : 275,
        transition: "all 0.5s ease-in-out",
        overflow: "hidden",
        overflowY: "auto",
      }}
      onScroll={handleScroll}
      ref={chatContentRef}
    >
      {!showWidget && (
        <div style={{ marginTop: "50px" }}>
          <AIGradientLoader
            padding={"2rem"}
            style={{
              display: "initial",
              margin: "20px auto",
              transition: "all 0.5s ease-in-out",
              scale: "1.8",
            }}
            height={"100px"}
            width={"100px"}
            pulseAnimation={false}
          />
          <div className={` transition-all duration-200 ease-in-out mt-4 text-center`}>
            <Greeting userName={userName} />
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: isMobile || embedMode ? "80vw" : 800,
          margin: "auto",
          gap: 20,
        }}
      >
        {conversationHistory.map((chat, index) => {
          return (
            <div key={index}>
              {(chat.userType === MessageUserType.USER || chat.userType === MessageUserType.VISITOR) && (
                <div key={index} className={styles.chat__user_message}>
                  <PurifyContent className={styles.chat__user_message__content} content={chat.content || ""} />
                </div>
              )}

              {chat.userType === MessageUserType.SYSTEM && (
                <div key={index + 1} className={`${styles.chat__response} prose prose-base`}>
                  {chat.content && <MarkdownToJsx theme={globalState.theme} content={chat.content} />}
                </div>
              )}
            </div>
          );
        })}

        {userQuery && (
          <div className={styles.chat__user_message}>
            <PurifyContent className={styles.chat__user_message__content} content={userQuery} />
          </div>
        )}

        <div
          className={`${styles.chat__response} prose prose-base`}
          style={{
            height: `${conversationHistory.length > 0 && userQuery ? `calc(100vh - ${answerBottomOffset})` : "0px"}`,
          }}
        >
          {showLoading && (
            <AIGradientLoader
              padding={"0px"}
              style={{
                position: "relative",
                width: "10px",
                transition: "all 0.5s ease-in-out",
                transform: "translateX(0)",
                scale: "1",
              }}
              height="10px"
              width="10px"
              pulseAnimation={true}
            />
          )}

          {chatResponse && (
            <MarkdownToJsx theme={globalState.theme} content={chatResponse} isStreaming={isResponseStreaming} />
          )}
        </div>
      </div>
      {!isScrolledToBottom && <ScrollToBottomButton scrollContainerRef={chatContentRef} />}
    </div>
  );
};
