import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { GetServerSidePropsContext, NextPage } from "next";
import React, { use, useState, useEffect } from "react";
import { Card, Dropdown, Flex, MenuProps, message, Skeleton, Tabs, Tag } from "antd";
import styles from "@/components/AIConversation/AIAgent.module.scss";

import { showPlanAlertBar } from "@/lib/utils";
import { useSession } from "next-auth/react";
import SupportClientService from "@/services/client/tenant/SupportClientService";

import { EmptyCourses } from "@/components/SvgIcons";
import { getIconTheme } from "@/services/darkThemeConfig";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { getDummyArray } from "@/lib/dummyData";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import Link from "next/link";
import { IAiAgents } from "@/types/admin/agents";
import AIAgentCard from "@/components/AIConversation/AIAgentCard";

const AIChatPage: NextPage<{ siteConfig: PageSiteConfig; domain: string }> = ({ siteConfig, domain }) => {
  const { data: user } = useSession();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const router = useRouter();
  const [agentList, setAgentList] = useState<IAiAgents[]>([]);
  const [messageApi, contextMessageHolder] = message.useMessage();
  const { globalState } = useAppContext();
  const [loading, setLoading] = useState(false);
  const ListAiAgents = () => {
    try {
      setLoading(true);
      SupportClientService.listAiAgents(
        (result) => {
          setAgentList(result);
          setLoading(false);
        },
        (error) => {
          messageApi.error(error);
          setLoading(false);
        }
      );
    } catch (error) {
      messageApi.error(`${error}`);
      setLoading(false);
    }
  };
  useEffect(() => {
    ListAiAgents();
  }, []);
  return (
    <AppLayout siteConfig={siteConfig}>
      {contextMessageHolder}
      <section style={{ padding: "30px 0", height: showPlanAlertBar(user) ? "calc(100vh - 50px)" : "100vh " }}>
        <h4>AI Assistant</h4>
        {loading ? (
          <div className={styles.course__grid}>
            {getDummyArray(3).map((t, i) => {
              return (
                <Card
                  key={i}
                  className={styles.course__card}
                  cover={
                    <Skeleton.Image style={{ width: isMobile ? "Calc(100vw - 40px)" : "380px", height: "168px" }} />
                  }
                >
                  <Skeleton />
                </Card>
              );
            })}
          </div>
        ) : (
          <>
            {agentList.length == 0 && (
              <Flex vertical gap={0} justify="center" align="center">
                <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />

                <p>No Agents are available currently</p>
              </Flex>
            )}
            {agentList.length > 0 && (
              <div className={styles.course__grid}>
                {agentList.map((agent, index) => {
                  const items: MenuProps["items"] = [
                    {
                      label: <Link href={`/ai-assistant/${agent.id}?tab=sources`}>Configure Sources</Link>,
                      key: "1",
                    },
                  ];
                  return (
                    <AIAgentCard
                      useGradientBg
                      gradientArray={getDummyArray(10).map((_, i) => {
                        return `var(--bg-agent-gradient-${i + 1})`;
                      })}
                      gradientIndex={index}
                      key={index}
                      title={agent.name}
                      tag={
                        <Tag bordered={true} style={{ fontWeight: "normal" }}>
                          {agent.model}
                        </Tag>
                      }
                      description={<p>{agent.agentPrompt}</p>}
                      bodyHeight={100}
                      footer={
                        <Flex justify="space-between" align="center">
                          <div>
                            {agent.conversations} {agent.conversations > 1 ? "Conversations" : "Conversation"}{" "}
                          </div>

                          <Dropdown.Button
                            type="default"
                            trigger={["click"]}
                            menu={{ items }}
                            onClick={() => {
                              router.push(`/ai-assistant/${agent.id}?tab=playground`);
                            }}
                            style={{ width: "auto" }}
                          >
                            Edit
                          </Dropdown.Button>
                        </Flex>
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </AppLayout>
  );
};

export default AIChatPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;
  const domain = ctx.req.headers.host || "";
  const siteConfig = await getSiteConfig(ctx.res, domain);
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
      domain,
    },
  };
};
