import { Flex, Form, Layout, Spin } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import PlaygroundSidebar from "./PlaygroundSidebar";
import { PageSiteConfig } from "@/services/siteConstant";
import { compareObject, showPlanAlertBar } from "@/lib/utils";
import SvgIcons from "@/components/SvgIcons";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { aiAgent } from "@prisma/client";
import { LoadingOutlined } from "@ant-design/icons";
import { AgentResonse } from "@/pages/ai-assistant/[agentId]";

const { Content } = Layout;

const Playground: FC<{ siteConfig: PageSiteConfig; user: any; domain: string; agent?: AgentResonse }> = ({
  domain,
  siteConfig,
  user,
  agent,
}) => {
  const [name, setName] = useState<string>(`${siteConfig.brand?.name} AI Assisstant`);
  const [form] = Form.useForm();
  const { globalState } = useAppContext();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendMessageToIframe = () => {
    if (typeof window !== "undefined") {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "THEME",
            payload: globalState.theme,
          },
          `${window.location.protocol}//${domain}`
        );
      }
    }
  };

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      form.setFieldValue("name", agent.name);
      form.setFieldValue("agentPrompt", agent.agentPrompt);
      form.setFieldValue("temperature", agent.temperature);
      form.setFieldValue("model", agent.model);
    }
  }, [agent]);

  useEffect(() => {
    sendMessageToIframe();
  }, [globalState.theme]);

  return (
    <section
      className="flex items-start  "
      style={{
        height: showPlanAlertBar(user) ? "calc(100vh - 108px)" : "calc(100vh - 70px)",
        width: "var(--main-content-width)",
      }}
    >
      <PlaygroundSidebar setName={setName} form={form} agent={agent} siteConfig={siteConfig} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "var(--bg-primary)",
          opacity: 0.8,
          backgroundImage: "var(--chat-embed-bg)",
          padding: 10,
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Flex align="center" justify="center" gap={0} vertical style={{ width: 400, height: "calc(100vh - 150px)" }}>
          <Flex
            align="center"
            justify="space-between"
            style={{
              padding: 10,
              backgroundColor: "var(--bg-primary)",
              width: "100%",
              height: "60px",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              border: "1px solid var(--border-color)",
              borderBottom: 0,
            }}
          >
            <Flex align="center" gap={10}>
              <img src={`${siteConfig.brand?.icon}`} alt="" className="h-[30px] w-[30px]" />
              <div style={{ color: "var(--font-primary)", fontSize: 16 }}>{name}</div>
            </Flex>
            <i style={{ lineHeight: 0, fontSize: 20, color: "var(--font-primary)" }}>{SvgIcons.chevronDown}</i>
          </Flex>
          <div className="relative" style={{ height: "100%", width: "100%" }}>
            <div
              className={
                "top-0 bottom-0  flex items-center justify-center  left-0 right-0 z-[5] bg-[var(--bg-primary)] absolute shadow-2xl rounded-b-[15px] border-[1px] border-[var(--border-color)]"
              }
            >
              <Spin spinning={true} indicator={<LoadingOutlined spin />} size="default" />
            </div>
            <iframe
              loading="lazy"
              style={{ transform: "scale(1)", width: "100%", height: "100%" }}
              className={
                "w-[350px] relative z-[10]   shadow-2xl rounded-b-[15px] border-[1px] border-[var(--border-color)]"
              }
              src={`${window.location.origin}/chat/embed?agentId=${agent?.id}&theme=${globalState.theme}`}
            ></iframe>
          </div>
        </Flex>
      </div>
    </section>
  );
};

export default Playground;
