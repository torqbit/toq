import { FC } from "react";
import { EmbedStep } from "./instructions";
import { Steps, Flex } from "antd";
import PurifyContent from "@/components/PurifyContent/PurifyContent";
import MarkdownToJsx from "@/components/MarkdownToJsx/MarkdownToJsx";
import { useAppContext } from "@/components/ContextApi/AppContext";

const EmbedSteps: FC<{ steps: EmbedStep[] }> = ({ steps }) => {
  const { globalState } = useAppContext();
  const markdownClass =
    " h-full overflow-auto relative [&>pre]:mt-[1rem] [&>hr]:text-[var(--border-color)]  [&th]:text-[var(--font-primary)] [&tr]:text-center [&>pre]:my-5 [&>ol]:my-4 [&>li]:my-1";

  return (
    <>
      <Steps
        current={steps?.length}
        status="finish"
        size="small"
        progressDot
        direction="vertical"
        items={steps.map((step, index: number) => {
          return {
            title: <h4>{step.title}</h4>,
            description: (
              <Flex vertical gap={10} key={index} style={{ width: "756px" }}>
                <MarkdownToJsx
                  key={`block-${index}`}
                  theme={globalState.theme}
                  content={step.description || ""}
                  className={`${markdownClass} text-[var(--font-secondary)]`}
                />
              </Flex>
            ),
          };
        })}
      />
    </>
  );
};
export default EmbedSteps;
