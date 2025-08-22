import { FC, useEffect, useState } from "react";
import styles from "./TenantOnboarding.module.scss";
import { Button, Flex, Form, message, Modal, Steps } from "antd";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "@/components/SvgIcons";
import { ITenantOnboardStatus } from "@/types/setup/siteSetup";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import SupportClientService from "@/services/client/tenant/SupportClientService";

const TenantOnboard: FC<{
  siteConfig: PageSiteConfig;
  status: ITenantOnboardStatus;
}> = ({ siteConfig, status }) => {
  let iconStyles = { lineHeight: 0, fontSize: 20, color: "var(--font-secondary)" };
  const [onBoardStatus, setStatus] = useState<ITenantOnboardStatus>(status);
  const [current, setCurrent] = useState<number>(0);
  const [contextModalHolder] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const getStatusIcon = (checked: boolean) => {
    if (checked) {
      return SvgIcons.checkFilled;
    } else {
      return SvgIcons.arrowRight;
    }
  };

  const updateStatus = () => {
    if (onBoardStatus.aiAssistant) {
      setCurrent(1);
    } else {
      setCurrent(0);
    }
  };
  useEffect(() => {
    updateStatus();
  }, []);

  const aiAssistantCard = {
    icon: <i style={iconStyles}>{SvgIcons.bot}</i>,
    title: "Train Your AI Assistant",
    description: "Add websites and docs to train the assistant.",
    statusIcon: <i style={iconStyles}>{getStatusIcon(onBoardStatus.aiAssistant)}</i>,
    onClick: () => router.push("/ai-assistant"),
  };

  const startedList = [
    {
      icon: <i style={iconStyles}>{SvgIcons.rocket}</i>,
      title: "Set up Learning Center",
      description: "A learning center that speaks your brand's language",
      statusIcon: <i style={iconStyles}>{getStatusIcon(true)}</i>,
      onClick: () => {},
    },

    aiAssistantCard,
  ];
  const startedTrialList = [
    {
      icon: <i style={iconStyles}>{SvgIcons.rocket}</i>,
      title: "Create your workspace",
      description: "A place to manage your AI assistants and academy",
      statusIcon: <i style={iconStyles}>{getStatusIcon(true)}</i>,
      onClick: () => {},
    },

    aiAssistantCard,
  ];

  let lists = startedTrialList;
  const onSkipOnboarding = () => {
    SupportClientService.skipOnboarding(
      (result) => {
        router.push("/dashboard");
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };
  return (
    <section className={styles.get__started}>
      {contextHolder}
      <div className={styles.get__started__wrapper}>
        <div>
          <h2>Let&apos;s get started!</h2>
          <p>Welcome it&apos;s time to set up {siteConfig.brand?.name}</p>
        </div>
        <Flex vertical align="flex-end" justify="right" gap={10}>
          <Steps
            current={current}
            status="finish"
            size="small"
            progressDot
            className={styles.get__started__list}
            direction="vertical"
            items={lists.map((item, i) => {
              return {
                title: (
                  <div
                    className={`${styles.get__started__list__item} ${
                      current + 1 < i ? styles.incompleted__step : styles.completed__step
                    }`}
                    onClick={() => {
                      current + 1 >= i && item.onClick();
                    }}
                    key={i}
                  >
                    <Flex style={{ width: "100%" }} align="center" justify="space-between">
                      <Flex align="center" gap={20}>
                        {item.icon}
                        <div>
                          <h4 style={{ margin: 0 }}>{item.title}</h4>
                          <p>{item.description}</p>
                        </div>
                      </Flex>
                      {item.statusIcon}
                    </Flex>
                    {current + 1 < i && <div className={styles.form__disabled__overlay}></div>}
                  </div>
                ),
              };
            })}
          />
          <Button
            type="link"
            onClick={() => {
              onSkipOnboarding();
            }}
          >
            <Flex align="center" gap={10}>
              Skip
              <i style={{ lineHeight: 0, fontSize: 16, color: "inherit" }}>{SvgIcons.arrowRight}</i>
            </Flex>
          </Button>
        </Flex>
      </div>
    </section>
  );
};

export default TenantOnboard;
