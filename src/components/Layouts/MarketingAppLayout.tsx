import Sidebar from "../Sidebar/Sidebar";

const { Content, Header, Footer: LayoutFooter } = Layout;

import { FC, useEffect, useRef, useState } from "react";
import React from "react";
import styles from "@/templates/standard/components/Hero/Hero.module.scss";

import Head from "next/head";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Layout,
  message,
  notification,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { useMediaQuery } from "react-responsive";
import { Role, User, TenantRole, Tenant } from "@prisma/client";
import { IBrandInfo } from "@/types/landing/navbar";
import { Theme } from "@/types/theme";
import NavBar from "@/templates/standard/components/NavBar/NavBar";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import SvgIcons from "../SvgIcons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import appLayoutStyles from "@/styles/Layout2.module.scss";
import type { MenuProps, NotificationArgsProps } from "antd";
import { getFetch } from "@/services/request";

import { isValidImagePath } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import appConstant from "@/services/appConstant";
import { getSiderMenu, responsiveNav, superAdminMenu } from "./NavigationItems";
import SupportClientService from "@/services/client/tenant/SupportClientService";
import { getChatHistoryList } from "@/actions/getChatHistoryList";
interface UserData extends User {
  tenant?: {
    role: TenantRole;
  };
}

type NotificationPlacement = NotificationArgsProps["placement"];

const MarketingAppLayout: FC<{
  children?: React.ReactNode;
  heroSection?: React.ReactNode;
  siteConfig: PageSiteConfig;
  previewMode?: boolean;
  homeLink?: string;
  user?: UserData;
  showFooter?: boolean;
  navBarWidth?: string | number;
  mobileHeroMinHeight?: string | number;
  metaData?: {
    title: string;
    ogImage: string;
    description: string;
  };
}> = ({ children, heroSection, user, siteConfig, previewMode, homeLink, metaData }) => {
  const { globalState, dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, contexMessagetHolder] = message.useMessage();
  const authorizedUrls = appConstant.authorizedUrls;
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const { brand } = siteConfig;

  const defaultSelectedSideBar = () => {
    if (router.pathname) {
      if (router.pathname == "/") {
        dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: "home" as ISiderMenu });
      } else if (/^\/chat(\/|$)/.test(router.pathname)) {
        dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: router.asPath.split("/")[2] as ISiderMenu });
      } else {
        dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: router.pathname.split("/")[1] as ISiderMenu });
      }
    }
  };

  const NavBarComponent = NavBar;
  let brandInfo: IBrandInfo = {
    logo: siteConfig.brand?.logo ?? DEFAULT_THEME.brand.logo,
    name: siteConfig.brand?.name ?? DEFAULT_THEME.brand.name,
    icon: siteConfig.brand?.icon ?? DEFAULT_THEME.brand.icon,
    darkLogo: siteConfig.brand?.darkLogo || DEFAULT_THEME.brand.darkLogo,
  };

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const updateTheme = async (theme: Theme) => {
    localStorage.setItem("theme", theme);
    dispatch({
      type: "SET_SITE_CONFIG",
      payload: siteConfig,
    });

    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    defaultSelectedSideBar();

    const currentTheme = localStorage.getItem("theme");
    if (user) {
      dispatch({
        type: "SET_USER",
        payload: { ...session, role: user?.role, tenantRole: user?.tenant?.role },
      });
    }

    if (!previewMode) {
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
    } else {
      setGlobalTheme(siteConfig.brand?.defaultTheme as Theme);
    }

    dispatch({
      type: "SET_SITE_CONFIG",
      payload: siteConfig,
    });

    if (localStorage.getItem("theme")) {
      if (!globalState.appLoaded) {
        if (session?.tenant?.role == TenantRole.MEMBER) {
          getChatHistoryList().then((res) => {
            dispatch({ type: "SET_CHAT_LIST", payload: res });
          });
        }

        dispatch({ type: "SET_APP_LOADED", payload: true });
      }

      dispatch({
        type: "SET_LOADER",
        payload: false,
      });
    }
  };

  const updateNotification = async (id: number, targetLink?: string) => {
    try {
      let apiPath = `/api/v1/notification/update/${id}`;
      getFetch(apiPath);

      targetLink && router.push(targetLink);
    } catch (err) {
      messageApi.error(`${err}`);
    }
  };

  const openNotification = (
    placement: NotificationPlacement,
    message: React.ReactNode,
    description: React.ReactNode,
    objectId?: string,
    targetLink?: string
  ) => {
    api.open({
      message: message,
      closeIcon: <i style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0 }}>{SvgIcons.xMark}</i>,
      description: description,

      style: { cursor: "pointer" },
      placement,
      onClick: () => {
        objectId && updateNotification(Number(objectId), targetLink);
      },
    });
  };

  useEffect(() => {
    status !== "loading" && onCheckTheme();
  }, [siteConfig.brand?.defaultTheme, session]);

  const userDropdownMenu: MenuProps["items"] = [
    {
      icon: (
        <Flex
          align="center"
          justify="center"
          className={styles.invalid__img}
          style={{
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            padding: 5,
            marginLeft: -5,
          }}
        >
          <UserOutlined size={15} style={{ fontSize: 15 }} />
        </Flex>
      ),
      key: "0",
      onClick: () => {
        setDropdownOpen(false);
      },
      label: <Link href={`/settings`}>View Profile</Link>,
      style: {
        width: 250,
        height: 60,
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },

    {
      icon: <i style={{ lineHeight: 0, fontSize: 25 }}>{SvgIcons.logout}</i>,

      key: "2",
      label: <>Logout</>,
      onClick: async () => {
        setDropdownOpen(false);
        await signOut({
          callbackUrl: `/login`,
        });
      },
      style: {
        width: 250,
        height: 60,
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ];

  const getNavBarExtraContent = (userRole?: Role) => {
    let showThemeSwitch = siteConfig.brand?.themeSwitch;
    if (userRole) {
      return (
        <>
          <Flex align="center" gap={30}>
            <Flex align="center" gap={20} style={{ marginTop: 2 }}>
              {showThemeSwitch && <ThemeSwitch activeTheme={globalState.theme ?? "light"} previewMode={previewMode} />}

              {/* <NotificationPopOver
                  minWidth={isMobile ? "70vw" : "420px"}
                  placement="bottomLeft"
                  siteConfig={siteConfig}
                  showNotification={showNotification}
                  onOpenNotification={setOpenNotification}
                /> */}
            </Flex>

            <Dropdown
              open={dropdownOpen}
              onOpenChange={(v) => setDropdownOpen(v)}
              menu={{ items: userDropdownMenu }}
              trigger={["click"]}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <Flex align="center" gap={5} style={{ cursor: "pointer" }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <Avatar src={session?.user?.image} icon={<UserOutlined />} />
                <i style={{ lineHeight: 0, color: "var(--font-secondary)", fontSize: 20 }}>{SvgIcons.chevronDown}</i>
              </Flex>
            </Dropdown>
          </Flex>
        </>
      );
    } else {
      return (
        <>
          <Flex align="center" gap={20}>
            {showThemeSwitch && <ThemeSwitch activeTheme={globalState.theme ?? "light"} previewMode={previewMode} />}

            <Link href={`${previewMode ? "#" : "/login"}`} aria-label="Get started">
              <Button type="primary">Get Started</Button>
            </Link>
          </Flex>
        </>
      );
    }
  };
  const getOgImagSrc = () => {
    if (siteConfig.brand?.themeSwitch && siteConfig.brand.defaultTheme == "dark") {
      return isValidImagePath(`${siteConfig.heroSection?.banner?.darkModePath}`)
        ? `${siteConfig.heroSection?.banner?.darkModePath}`
        : "";
    } else {
      return isValidImagePath(`${siteConfig.heroSection?.banner?.lightModePath}`)
        ? `${siteConfig.heroSection?.banner?.lightModePath}`
        : "";
    }
  };
  return (
    <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
      {contexMessagetHolder}
      <Spin spinning={globalState.pageLoading} fullscreen indicator={<LoadingOutlined spin />} size="large">
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            minHeight: "100vh",
            backgroundColor: "red",
          }}
        ></div>
      </Spin>

      <Head>
        <title>{`${siteConfig.brand?.name} · ${
          metaData && metaData.title ? metaData.title : siteConfig.brand?.title
        }`}</title>
        <meta
          name="description"
          content={
            metaData && metaData.description ? metaData.description.substring(0, 100) : siteConfig.brand?.description
          }
        />
        <meta
          property="og:image"
          content={metaData && metaData.ogImage ? metaData.ogImage : siteConfig.brand?.ogImage}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link
          rel="icon"
          href={
            isValidImagePath(`${siteConfig.brand?.favicon}`) ? DOMPurify.sanitize(`${siteConfig.brand?.favicon}`) : ""
          }
        />
      </Head>
      <div style={{ display: globalState.pageLoading ? "none" : "inherit" }}>
        <Layout hasSider>
          {user?.role === Role.ADMIN ? (
            <Sidebar menu={superAdminMenu} siteConfig={siteConfig} fixedSideBar />
          ) : (
            <Sidebar
              menu={getSiderMenu(
                siteConfig,
                globalState.chatList,
                previewMode ? undefined : session?.tenant?.role,
                previewMode
              )}
              siteConfig={siteConfig}
              fixedSideBar
            />
          )}

          <Layout className="default-container">
            <Header
              style={{
                position: "fixed",
                top: 1,
                padding: 0,
                height: 60,
                left: 0,
                right: 0,
                background: "transparent",

                zIndex: 1000,
              }}
            >
              {NavBarComponent && (
                <NavBarComponent
                  user={user}
                  isMobile={isMobile}
                  defaultNavlink={previewMode ? "#" : "/login"}
                  homeLink={homeLink ? homeLink : "/"}
                  items={siteConfig.navBar?.links ?? []}
                  siteConfig={siteConfig}
                  showThemeSwitch={siteConfig.brand?.themeSwitch ?? DEFAULT_THEME.brand.themeSwitch}
                  activeTheme={globalState.theme ?? "light"}
                  brand={brandInfo}
                  previewMode={previewMode}
                  extraContent={getNavBarExtraContent(user?.role)}
                  navBarWidth={"100%"}
                />
              )}
            </Header>
            <Content style={{ display: "flex", justifyContent: isMobile ? "center" : "right", alignItems: "flex-end" }}>
              <div style={{ width: isMobile ? "100vw" : "calc(100vw - 260px)", marginTop: "60px" }}>
                {heroSection}
                {children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>
  );
};

export default MarketingAppLayout;
