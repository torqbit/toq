import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { GetServerSidePropsContext, NextPage } from "next";
import React, { use, useState, useEffect } from "react";
import { Tabs } from "antd";
import ConfigureSources from "@/components/AIConversation/ConfigureSources/ConfigureSources";
import { useSession } from "next-auth/react";
import Playground from "@/components/AIConversation/Playground/Playground";
import SupportClientService from "@/services/client/tenant/SupportClientService";
import { useRouter } from "next/router";

import EmbedChat from "@/components/AIConversation/Embed";
export type AgentResonse = {
  id: string;
  name: string;
  model: string;
  embedPath: string;
  agentPrompt: string;
  temperature: number;
};
const AIChatPage: NextPage<{ siteConfig: PageSiteConfig; domain: string; tab: string; agentId: string }> = ({
  siteConfig,
  domain,
  tab,
  agentId,
}) => {
  const { data: user } = useSession();
  const [agent, setAgent] = useState<AgentResonse>();
  const router = useRouter();
  const getAiAgents = () => {
    SupportClientService.getAiAgents(
      agentId,
      (result) => {
        setAgent(result);
      },
      (error) => {}
    );
  };
  useEffect(() => {
    getAiAgents();
  }, []);
  return (
    <AppLayout siteConfig={siteConfig}>
      <section style={{ padding: "0px 0" }}>
        <Tabs
          tabBarGutter={30}
          tabBarStyle={{ marginBottom: 10 }}
          activeKey={tab}
          onChange={(v) => router.push(`/ai-assistant/${agentId}?tab=${v}`)}
          items={[
            {
              label: "Knowledge Sources",
              key: "sources",
              children: <ConfigureSources />,
            },
            {
              label: "Playground",
              key: "playground",
              children: <Playground agent={agent} domain={domain} user={user} siteConfig={siteConfig} />,
            },
            {
              label: "Embed",
              key: "embed",
              children: <EmbedChat siteConfig={siteConfig} agentId={agentId} embedPath={agent?.embedPath || ""} />,
            },
          ]}
        />
      </section>
    </AppLayout>
  );
};

export default AIChatPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res, query } = ctx;
  const { agentId, tab } = query;
  const domain = ctx.req.headers.host || "";
  const siteConfig = await getSiteConfig(ctx.res, domain);
  const { site } = siteConfig;
  if (tab == "playground" || tab == "sources" || tab == "embed") {
    return {
      props: {
        siteConfig: site,
        domain,
        tab,
        agentId,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/ai-assistant/${agentId}?tab=sources`,
      },
    };
  }
};
