import { FC, useEffect, useState } from "react";
import React from "react";
import Head from "next/head";
import { useAppContext } from "../ContextApi/AppContext";
import { Button, ConfigProvider, Dropdown, Flex, Layout, message, Spin, Tabs, TabsProps, Upload } from "antd";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { useMediaQuery } from "react-responsive";
import { Role, User } from "@prisma/client";
import * as yaml from "js-yaml";

import { Theme } from "@/types/theme";

import styles from "./SiteBuilder.module.scss";
import Link from "next/link";
import SvgIcons from "../SvgIcons";
import { useRouter } from "next/router";
import { RcFile } from "antd/es/upload";
import { createSlug, isValidImagePath } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { LoadingOutlined } from "@ant-design/icons";
import DOMPurify from "isomorphic-dompurify";

const { Content, Sider } = Layout;
const SiteBuilderLayout: FC<{
  children?: React.ReactNode;
  siteDesigner?: React.ReactNode;
  siteContent?: React.ReactNode;
  siteConfig: PageSiteConfig;
  setConfig?: (value: PageSiteConfig) => void;
  updateYamlFile?: () => void;
  user?: User;
}> = ({ children, siteDesigner, siteContent, setConfig, user, siteConfig, updateYamlFile }) => {
  const { globalState, dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const router = useRouter();
  const [messageApi, contexHolder] = message.useMessage();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
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
    const currentTheme = localStorage.getItem("theme");

    if (siteConfig.brand?.themeSwitch && currentTheme) {
      localStorage.setItem("theme", currentTheme);
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
    if (localStorage.getItem("theme")) {
      dispatch({
        type: "SET_LOADER",
        payload: false,
      });
    }
  };

  const onChange = (value: string) => {
    switch (value) {
      case "content":
        return router.push(`/admin/site/content/blogs`);

      case "design":
        return router.push("/admin/site/design");
    }
  };

  const onUpdateYaml = async () => {
    if (updateYamlFile) {
      updateYamlFile();
    }
  };

  useEffect(() => {
    onCheckTheme();
  }, []);

  const handleYamlFileUpload = async (file: RcFile) => {
    try {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const { site } = yaml.load(reader.result as string) as any;
          setConfig && setConfig(site as PageSiteConfig);

          messageApi.success("Site configuration has been loaded");
        } catch (error) {
          console.log(error, "error");
          messageApi.error("Failed to parse YAML file.");
        }
      };

      reader.onerror = () => {
        messageApi.error("Failed to read file.");
      };

      reader.readAsText(file);
    } catch (error) {
      message.error("Error handling the file.");
    }
  };

  const downloadYamlFile = () => {
    if (session?.role == Role.ADMIN) {
      try {
        const yamlString = yaml.dump({ site: siteConfig });

        const blob = new Blob([yamlString], { type: "application/x-yaml" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${createSlug(`${siteConfig.brand?.name}`).trim()}.yaml`;
        link.click();

        URL.revokeObjectURL(url);

        messageApi.success("YAML file downloaded successfully!");
      } catch (error) {
        messageApi.error("Failed to download YAML file.");
      }
    } else {
      messageApi.warning("You are not authorized to download this file");
      return;
    }
  };
  return (
    <>
      {contexHolder}

      <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
        <Spin spinning={globalState.pageLoading} fullscreen indicator={<LoadingOutlined spin />} size="large" />

        <Head>
          <title>{`${siteConfig.brand?.name} · ${siteConfig.brand?.title}`}</title>
          <meta name="description" content={siteConfig.brand?.description} />
          <meta
            property="og:image"
            content={
              siteConfig.brand?.themeSwitch && siteConfig.brand.defaultTheme == "dark"
                ? siteConfig.heroSection?.banner?.darkModePath
                : siteConfig.heroSection?.banner?.lightModePath
            }
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link
            rel="icon"
            href={
              isValidImagePath(`${siteConfig.brand?.favicon}`) ? DOMPurify.sanitize(`${siteConfig.brand?.favicon}`) : ""
            }
          />
        </Head>
        <Spin spinning={globalState.pageLoading} indicator={<LoadingOutlined spin />} size="large">
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
                  <Flex align="center" justify="space-between" className={styles.site__builder__header}>
                    <Flex align="center" gap={5} justify="center">
                      <Link className={styles.go_back_btn} href={"/dashboard"}>
                        <i>{SvgIcons.arrowLeft}</i>
                      </Link>
                      <h4 style={{ padding: "0px", margin: 0 }}>Site</h4>
                    </Flex>

                    {siteDesigner && (
                      <Button
                        loading={loading}
                        onClick={() => {
                          onUpdateYaml();
                        }}
                        type="primary"
                      >
                        Save
                      </Button>
                    )}
                  </Flex>

                  <Tabs
                    tabBarGutter={40}
                    tabBarExtraContent={
                      <Dropdown.Button
                        size="small"
                        onClick={downloadYamlFile}
                        icon={<i style={{ fontSize: 14, lineHeight: 0 }}>{SvgIcons.chevronDown}</i>}
                        menu={{
                          items: [
                            {
                              key: 1,

                              label: (
                                <Upload
                                  name="avatar"
                                  listType="text"
                                  showUploadList={false}
                                  beforeUpload={(file) => {
                                    handleYamlFileUpload(file);
                                  }}
                                >
                                  <Flex align="center" gap={5}>
                                    <i style={{ fontSize: 15, lineHeight: 0 }}>{SvgIcons.plusBtn}</i>
                                    <span style={{ fontSize: 13 }}>Import</span>
                                  </Flex>
                                </Upload>
                              ),
                            },
                          ],
                        }}
                      >
                        <Flex align="center" gap={2}>
                          <i style={{ fontSize: 15, lineHeight: 0 }}>{SvgIcons.download}</i>
                          <span style={{ fontSize: 13 }}>Export</span>
                        </Flex>
                      </Dropdown.Button>
                    }
                    tabBarStyle={{ padding: "0px 20px", margin: 0 }}
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
        </Spin>
      </ConfigProvider>
    </>
  );
};

export default SiteBuilderLayout;
