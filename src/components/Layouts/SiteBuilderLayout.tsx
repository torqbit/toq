import { FC, useEffect } from "react";
import React from "react";
import Head from "next/head";
import { useAppContext } from "../ContextApi/AppContext";
import { ConfigProvider, Flex, Layout, Tabs, TabsProps } from "antd";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import SpinLoader from "../SpinLoader/SpinLoader";
import { PageSiteConfig } from "@/services/siteConstant";
import { useMediaQuery } from "react-responsive";
import { User } from "@prisma/client";

import { Theme } from "@/types/theme";

import styles from "./SiteBuilder.module.scss";
import Link from "next/link";
import SvgIcons from "../SvgIcons";
import { useRouter } from "next/router";

const { Content, Sider } = Layout;
const SiteBuilderLayout: FC<{
  children?: React.ReactNode;
  siteDesigner?: React.ReactNode;
  siteContent?: React.ReactNode;
  siteConfig: PageSiteConfig;
  user?: User;
}> = ({ children, siteDesigner, siteContent, user, siteConfig }) => {
  const { globalState, dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const router = useRouter();
  const { brand } = siteConfig;

  const Tabitems: TabsProps["items"] = [
    {
      key: "design",
      label: "Design",
      children: siteDesigner,
    },
    {
      key: "content",
      label: "Content",

      children: siteContent,
    },
  ];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${brand?.brandColor}`);
  }, []);

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    if (siteConfig.brand?.themeSwitch) {
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme === "dark") {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    } else {
      if (siteConfig.brand?.defaultTheme) {
        localStorage.setItem("theme", siteConfig.brand?.defaultTheme);
      } else {
        localStorage.setItem("theme", "light");
      }
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);
    dispatch({
      type: "SET_SITE_CONFIG",
      payload: siteConfig,
    });
    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  const onChange = (value: string) => {
    switch (value) {
      case "content":
        return router.push(`/admin/site/content/blogs`);

      case "design":
        return router.push("/admin/site/design");
    }
  };
  useEffect(() => {
    onCheckTheme();
  }, []);

  return (
    <>
      {
        <div
          style={{
            position: "fixed",
            display: globalState.pageLoading ? "unset" : "none",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            background: "#fff",
            zIndex: 10,
          }}
        >
          <SpinLoader className="marketing__spinner" />
        </div>
      }
      <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
        <Head>
          <title>{`${siteConfig.brand?.title} | ${siteConfig.brand?.name}`}</title>
          <meta name="description" content={siteConfig.brand?.description} />
          <meta property="og:image" content={siteConfig.brand?.ogImage} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="icon" href={siteConfig.brand?.favicon} />
        </Head>
        <div>
          <Layout hasSider className={styles.site__builder__layout}>
            <Sider
              width={350}
              theme="light"
              className={`${styles.main_sider} main_sider`}
              trigger={null}
              collapsed={false}
            >
              <div className={styles.side__bar__container}>
                <Flex align="center" justify="space-between">
                  <h4 style={{ padding: "10px 20px" }}>Site</h4>
                  <Link className={styles.go_back_btn} href={"/dashboard"}>
                    <i>{SvgIcons.arrowLeft}</i>
                    <p>Go Back</p>
                  </Link>
                </Flex>

                <Tabs
                  tabBarGutter={40}
                  tabBarStyle={{ padding: "0px 20px" }}
                  activeKey={siteContent ? "content" : "design"}
                  className={styles.site_config_tabs}
                  items={Tabitems}
                  onChange={onChange}
                />
              </div>
            </Sider>
            <Layout>
              <Content className={styles.sider_content}>{children}</Content>
            </Layout>
          </Layout>
        </div>
      </ConfigProvider>
    </>
  );
};

export default SiteBuilderLayout;
