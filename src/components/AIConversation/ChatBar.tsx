import { FC } from "react";
import TipTapEditor from "../Editor/TipTap/TipTapEditor";
import { Flex, Spin } from "antd";
import styles from "./AiChat.module.scss";
import SvgIcons from "../SvgIcons";
import BorderBeamAnimation from "../Animations/AnimatedBorder";
import { useRouter } from "next/router";
const ChatBar: FC<{
  content: string;
  loading: boolean;
  showBorderAnimation: boolean;
  setContent: (value: string) => void;
  width?: string;
  handleSubmit: () => void;
}> = ({
  content,
  setContent,
  showBorderAnimation,
  handleSubmit,
  loading,
  width = "100%", // Changed default width to 100%
}) => {
  const router = useRouter();
  return (
    <div className="relative  bg-background p-[2px] rounded-[16px]">
      {showBorderAnimation && (
        <BorderBeamAnimation size={50} duration={6} colorFrom="#ffaa40" colorTo="#9c40ff" initialOffset={0} />
      )}
      <Flex
        align="flex-end"
        vertical
        gap={0}
        justify="flex-end"
        style={{ maxWidth: width, flexDirection: "column" }} // Added maxWidth to control maximum size
        className={`${styles.chat_box_container} max-w-[calc(80vw-5px)] md:max-w-[795px]`}
      >
        <div>
          <TipTapEditor
            onEnter={handleSubmit}
            placeholder="Ask anything about ..."
            isHeaderMenu={false}
            height={"100%"}
            width={width}
            bgColor="var(--bg-seccondary)"
            borderRadius="16px"
            content={content}
            submitOnEnter
            onChange={(value) => {
              setContent(value);
            }}
          />
        </div>
        <div
          style={{ flexShrink: 0, width }}
          className={`${styles.chat__action__button} max-w-[calc(80vw-5px)] md:max-w-[795px]`}
        >
          {loading ? (
            <>
              {router.query.conversationId ? (
                <i
                  style={{
                    fontSize: 20,
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "1px solid var(--border-color)",
                    padding: 5,
                  }}
                >
                  {SvgIcons.stop}
                </i>
              ) : (
                <Spin
                  style={{
                    background: "conic-gradient(from var(--rotation), #007498, #00d493, #d91982, #f5a95b, #007498)",
                    animation: "rotate 4s linear infinite",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "2px",
                    borderRadius: "50%",
                  }}
                  size="small"
                />
              )}
            </>
          ) : (
            <i
              style={{ fontSize: 20, cursor: "pointer" }}
              onClick={() => {
                handleSubmit();
              }}
            >
              {SvgIcons.send}
            </i>
          )}
        </div>
      </Flex>
    </div>
  );
};

export default ChatBar;
