import React, { ReactNode, RefObject } from "react";
// Use this if system needs streaming; otherwise replace
import ReactMarkdown from "react-markdown";
import PurifyContent from "../PurifyContent/PurifyContent";
import { MessageUserType } from "@prisma/client";
import { AIGradientLoader } from "./AIChatWidget";
import MarkdownToJsx from "../MarkdownToJsx/MarkdownToJsx";
import { useAppContext } from "../ContextApi/AppContext";
import { IConversationHistoryResponse } from "./LoadingChatWindow";

interface ChatHistoryProps {
  conversationList: IConversationHistoryResponse[];
  isLoading: boolean;
  chatRef: RefObject<HTMLDivElement>;
  streamActive: boolean;
}

const AiChatHistory: React.FC<ChatHistoryProps> = ({ conversationList, isLoading, chatRef, streamActive }) => {
  const { globalState } = useAppContext();
  return (
    <div
      style={{
        overflow: "auto",
        paddingBottom: streamActive ? 0 : 200,
        maxHeight: "calc(100vh - 200px)",
        msOverflowStyle: "none" /* Hide scrollbar for IE and Edge */,
        scrollbarWidth: "none" /* Hide scrollbar for Firefox */,
        WebkitOverflowScrolling: "touch" /* Enable smooth scrolling on iOS */,
      }}
      className="[&::-webkit-scrollbar]:hidden flex flex-col gap-2.5"
      ref={chatRef}
    >
      {conversationList.map((msg, index) => {
        const isSystem = msg.userType === MessageUserType.SYSTEM;
        const alignClass = isSystem ? "justify-start" : "justify-end";
        const bgColor = isSystem ? "bg-transparent" : "bg-[var(--bg-primary)]";
        const textColor = isSystem ? "text-inherit" : "text-[var(--font-secondary)]";

        return (
          <div key={index} className={`flex ${alignClass} w-full  `}>
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%]  ${bgColor} ${textColor}`}
              style={{
                border: "none",
              }}
            >
              {isSystem ? (
                <article className="chat__content w-full h-full lg:prose-base">
                  <MarkdownToJsx
                    key={`block-${index}`}
                    theme={globalState.theme}
                    content={msg.content || ""}
                    className=" h-full overflow-auto relative [&>pre]:mt-[1rem] [&>hr]:text-[var(--border-color)] text-[var(--font-secondary)] [&th]:text-[var(--font-primary)] [&tr]:text-center [&>pre]:my-5 [&>ol]:my-4 [&>li]:my-1"
                  />
                </article>
              ) : (
                // <StreamingMarkdownRenderer delay={20} content={msg.content || ""} isLoading={isLoading} />
                <div
                  style={{
                    background: "var(--bg-primary)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    maxWidth: "100%",
                  }}
                >
                  <PurifyContent
                    content={msg.content || ""}
                    className="h-full relative [&>p]:!m-0 text-[var(--font-secondary)]"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AiChatHistory;
