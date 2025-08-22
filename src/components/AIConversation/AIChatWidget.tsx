import { CSSProperties, FC, useEffect, useState } from "react";
import styles from "./AiChat.module.scss";
import { Flex, message } from "antd";
import { useRouter } from "next/router";
import ChatBar from "./ChatBar";
import { handleMessageRequest } from "@/lib/handleMessageRequest";
import { useAppContext } from "../ContextApi/AppContext";
import { LoadingChatWindow, IConversationHistoryResponse } from "./LoadingChatWindow";
import { MessageUserType, TenantRole } from "@prisma/client";
import ChatService from "@/services/client/ai/ChatService";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import SvgIcons from "../SvgIcons";

const AIChatWidget: FC<{
  userName: string;
  conversationId?: string;
  previewMode?: boolean;
  readOnly?: boolean;
  showPoweredBy?: boolean;
  agentId?: string;
}> = ({ userName, conversationId, previewMode = false, readOnly = false, showPoweredBy, agentId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [inputText, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queryTime, setQueryTime] = useState<Date>(new Date());
  const [showGreeting, setShowGreeting] = useState(conversationId ? false : true);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  const [chatThreadLoaded, setChatThreadLoaded] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<IConversationHistoryResponse[]>([]);
  const { chatContext, dispatch, globalState } = useAppContext();
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const { data: session } = useSession();
  const updateConversationHistory = (userQuery: string, systemResponse: string) => {
    const newConversation: IConversationHistoryResponse[] = [
      {
        userType: MessageUserType.USER,
        content: userQuery,
        createdAt: queryTime,
      },
      {
        userType: MessageUserType.SYSTEM,
        content: systemResponse,
        createdAt: new Date(),
      },
    ];

    setConversationHistory([...conversationHistory, ...newConversation]);
  };
  const getChatList = async (title: string, id: string) => {
    if (session && session?.tenant?.role !== TenantRole.OWNER) {
      const newChat = {
        id,
        updatedAt: new Date(),
        messages: [
          {
            createdAt: new Date(),
            content: title,
          },
        ],
      };

      let updatedChatList = [newChat, ...globalState.chatList];

      dispatch({
        type: "SET_CHAT_LIST",
        payload: updatedChatList,
      });
    }
  };

  const handleSubmit = async () => {
    const strippedText = inputText.replace(/<[^>]*>/g, "").trim();

    if (!readOnly && strippedText !== "") {
      setIsLoading(true);
      setChatThreadLoaded(false);
      if (!strippedText) {
        return;
      }

      if ((conversationId || currentConversationId) && chatContext?.responseContent) {
        updateConversationHistory(chatContext?.query, chatContext.responseContent);
        chatContext?.clearResponse();
      }

      chatContext?.setQuery(strippedText);
      setQueryTime(new Date());
      setShowGreeting(false);
      setInput("");
      handleMessageRequest(
        strippedText,
        (chat) => {
          if (chat.content) {
            chatContext?.appendResponse(chat.content || "");
            setIsLoading(false);
            return;
          }
          if (chat.conversationId && chat.sessionId) {
            if (!currentConversationId) {
              setCurrentConversationId(chat.conversationId);
              localStorage.setItem("conversationId", chat.conversationId);
              if (!previewMode) {
                getChatList(strippedText, chat.conversationId);
                setTimeout(() => {
                  router.push(`/chat/${chat.conversationId}`);
                }, 500);
              }
            }

            chatContext?.setStreamingStatus(true);
            localStorage.setItem("chatSessionId", chat.sessionId);
          }
        },
        (completeContent: string) => {
          chatContext?.setStreamingStatus(false);
          //chatContext?.clearResponse();
        },
        (error: string) => {
          updateConversationHistory(strippedText, error);
          chatContext?.setStreamingStatus(false);
          chatContext?.setQuery("");

          setIsLoading(false);
          return;
        },

        conversationId || localStorage.getItem("conversationId") || undefined,
        localStorage.getItem("chatSessionId") || undefined,
        agentId
      );
    }
  };

  useEffect(() => {
    if (chatContext && !chatContext.isStreaming && conversationId) {
      const sessionId = localStorage.getItem("chatSessionId");
      if (sessionId) {
        ChatService.getConversation(
          conversationId,
          sessionId,
          (conversations) => {
            setConversationHistory(conversations);
          },
          (err) => {
            messageApi.error(err);
          }
        );
      }
    }

    if (typeof conversationId != "undefined") {
      setChatThreadLoaded(true);
    }

    if (typeof conversationId === "undefined") {
      setConversationHistory([]);
      chatContext?.setQuery("");
      localStorage.removeItem("conversationId");
    }
    chatContext?.clearResponse();
  }, [conversationId]);

  return (
    <section
      id="hero"
      className={`${styles.ai__chat__wrapper} relative ${showPoweredBy ? "h-[calc(100vh-50px)]" : "h-[calc(100vh-150px)]"}  ${previewMode ? "md:h-[calc(100vh-176px)]" : "md:h-[calc(100vh-100px)]"} `}
      style={{
        marginTop: 10,
      }}
    >
      {contextHolder}
      <LoadingChatWindow
        showLoading={isLoading}
        showWidget={!showGreeting}
        slideDown={chatThreadLoaded}
        previewMode={previewMode}
        userName={userName}
        isResponseStreaming={chatContext?.isStreaming || false}
        conversationHistory={conversationHistory}
        chatResponse={chatContext?.responseContent || ""}
        userQuery={chatContext?.query}
        embedMode={previewMode}
      />

      <div className={`transition-all duration-500 ease-in-out w-[80vw] md:w-[800px] mx-auto my-0 `}>
        <ChatBar
          content={inputText}
          showBorderAnimation
          loading={isLoading}
          setContent={(value) => {
            setInput(value);
          }}
          width={isMobile || previewMode ? "calc(80vw - 5px)" : "795px"}
          handleSubmit={handleSubmit}
        />
      </div>
      {showPoweredBy && (
        <Link href={"https://www.torqbit.com"} target="_blank" className=" w-full mt-auto">
          <Flex align="center" justify="center" gap={5}>
            <div className=" text-[var(--font-secondary)] text-center">Powered by</div>
            <i
              style={{ fontSize: "5rem", lineHeight: 0 }}
              className="text-[var(--font-secondary)] hover:text-[var(--font-primary)]"
            >
              {SvgIcons.brandLogo}
            </i>
          </Flex>
        </Link>
      )}
    </section>
  );
};

export default AIChatWidget;

export const AIGradientLoader: FC<{
  style?: CSSProperties;
  padding?: string;
  height?: string;
  width?: string;
  pulseAnimation?: boolean;
}> = ({ style = {}, padding = "2rem", height = "100%", width = "100%", pulseAnimation = true }) => {
  return (
    <div style={style} className="transition-all duration-500 ease-in-out">
      <div
        style={{
          display: "grid",
          placeContent: "center",
          position: "relative",
          width: "100%",
          transform: pulseAnimation ? "scale(1.8)" : "scale(1)",
          animation: pulseAnimation ? "pulse .8s ease-in-out infinite" : "none",
        }}
      >
        <div style={{ padding, height, width }} className="glow-card"></div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1.8);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            transform: scale(1.8);
          }
        }
      `}</style>
    </div>
  );
};
