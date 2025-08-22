import { FC } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useAppContext } from "../ContextApi/AppContext";
import { ConfigProvider, Flex, Layout, Spin } from "antd";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import Offline from "../Offline/Offline";

import { PageSiteConfig } from "@/services/siteConstant";
import { LoadingOutlined } from "@ant-design/icons";

import DOMPurify from "isomorphic-dompurify";

import { isValidImagePath, showPlanAlertBar } from "@/lib/utils";

interface OverlapNumberProps {
  number: number;
}

const colors = ["text-blue-900", "text-blue-500", "text-blue-900"];

export const OverlapNumber: React.FC<OverlapNumberProps> = ({ number }) => {
  const digits = number.toString().split("");

  return (
    <div className="flex items-center justify-center space-x-[-20px]">
      {digits.map((digit, index) => (
        <span key={index} className={`text-9xl font-bold ${colors[index % colors.length]} z-[${index}]`}>
          {digit}
        </span>
      ))}
    </div>
  );
};

const Blank: FC<{ children?: React.ReactNode; siteConfig: PageSiteConfig }> = ({ children, siteConfig }) => {
  const { data: user } = useSession();
  const { globalState } = useAppContext();

  return (
    <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
      <Head>
        <title>{`${siteConfig.brand?.name} · ${siteConfig.brand?.title}`}</title>
        <meta name="description" content={siteConfig.brand?.description} />
        <meta property="og:image" content={siteConfig.brand?.ogImage} />
        <link
          rel="icon"
          href={
            isValidImagePath(`${siteConfig.brand?.favicon}`) ? DOMPurify.sanitize(`${siteConfig.brand?.favicon}`) : ""
          }
        />
      </Head>

      <>
        {globalState.onlineStatus ? (
          <>
            <Layout className="default-container">
              <Layout
                className={`layout2-wrapper ${styles.layout2_wrapper}  `}
                style={{ height: showPlanAlertBar(user) ? "calc(100vh - 50px)" : "100vh" }}
              >
                <Flex
                  vertical
                  style={{ minHeight: showPlanAlertBar(user) ? "calc(100vh - 50px)" : "100vh" }}
                  align="center"
                  justify="center"
                >
                  <>{children}</>
                </Flex>
              </Layout>
            </Layout>
          </>
        ) : (
          <Offline />
        )}
      </>
    </ConfigProvider>
  );
};

export default Blank;
