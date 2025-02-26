import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import sidebar from "@/styles/Sidebar.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";
import { signOut, useSession } from "next-auth/react";
import { IResponsiveNavMenu, ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { Badge, ConfigProvider, Dropdown, Flex, Layout, MenuProps, message, notification, Spin } from "antd";
import SvgIcons from "../SvgIcons";
import Link from "next/link";
import { UserSession } from "@/lib/types/user";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { useRouter } from "next/router";
import NotificationService from "@/services/NotificationService";
import ConversationService from "@/services/ConversationService";
import { IConversationData } from "@/pages/api/v1/conversation/list";
import Offline from "../Offline/Offline";
import { useMediaQuery } from "react-responsive";

import { Theme } from "@/types/theme";
import { PageSiteConfig } from "@/services/siteConstant";
import { LoadingOutlined } from "@ant-design/icons";
import { Role } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";
import NotificationView from "../Notification/NotificationView";

const { Content } = Layout;

import type { NotificationArgsProps } from "antd";
import { getFetch } from "@/services/request";
import ResponsiveNavBar from "../Sidebar/ResponsiveNavBar";
import { isValidImagePath } from "@/lib/utils";

type NotificationPlacement = NotificationArgsProps["placement"];

const AppLayout: FC<{ children?: React.ReactNode; className?: string; siteConfig: PageSiteConfig }> = ({
  children,
  className,
  siteConfig,
}) => {
  const { data: user, status, update } = useSession();

  const isMobile = useMediaQuery({ query: "(max-width: 933px)" });
  const { globalState, dispatch } = useAppContext();
  const [api, contextHolder] = notification.useNotification();
  const { brand } = siteConfig;
  const [messageApi, contextMessageHolder] = message.useMessage();

  const router = useRouter();

  const responsiveNav = [
    {
      title: "Dashboard",
      icon: (
        <i style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0 }} className={styles.events_icon}>
          {SvgIcons.dashboard}
        </i>
      ),
      link: "dashboard",
      key: "dashboard",
    },
    {
      title: "Academy",
      icon: (
        <i className={styles.events_icon} style={{ fontSize: 18 }}>
          {SvgIcons.courses}
        </i>
      ),
      link: "academy",
      key: "academy",
    },
    {
      title: "Events",
      icon: <i className={styles.events_icon}>{SvgIcons.events}</i>,
      link: "admin/events",
      key: "events",
    },
    {
      title: "Settings",
      icon: (
        <i style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0 }} className={styles.events_icon}>
          {SvgIcons.setting}
        </i>
      ),
      link: "admin/settings",
      key: "settings",
    },
  ];

  const userMenu: MenuProps["items"] = [
    {
      label: <Link href="/dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: (
        <i style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0 }} className={styles.events_icon}>
          {SvgIcons.dashboard}
        </i>
      ),
    },

    {
      label: <Link href="/academy">Academy</Link>,
      key: "academy",
      icon: (
        <i style={{ fontSize: 18 }} className={styles.events_icon}>
          {SvgIcons.courses}
        </i>
      ),
    },
    {
      label: <Link href="/events">Events</Link>,
      key: "events",
      icon: <i style={{ fontSize: 18 }}>{SvgIcons.events}</i>,
    },
  ];

  const adminMenu: MenuProps["items"] = [
    {
      label: <Link href="/dashboard">Dashboard</Link>,
      key: "dashboard",
      className: sidebar.menu__item,
      icon: (
        <i style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0 }} className={styles.events_icon}>
          {SvgIcons.dashboard}
        </i>
      ),
    },
    {
      label: <Link href="/admin/site/design">Site Editor</Link>,
      key: "site",
      className: sidebar.menu__item,
      icon: <i style={{ fontSize: 18 }}>{SvgIcons.site}</i>,
    },
    {
      label: <Link href="/academy">Academy</Link>,
      key: "academy",
      className: sidebar.menu__item,
      icon: (
        <i className={styles.events_icon} style={{ fontSize: 18 }}>
          {SvgIcons.courses}
        </i>
      ),
    },
    {
      label: <Link href="/admin/settings">Settings</Link>,
      key: "settings",
      className: sidebar.menu__item,
      icon: (
        <i style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0 }} className={styles.events_icon}>
          {SvgIcons.setting}
        </i>
      ),
    },
    {
      label: <Link href="/events">Events</Link>,
      key: "events",
      className: sidebar.menu__item,
      icon: <i style={{ fontSize: 18 }}>{SvgIcons.events}</i>,
    },
  ];

  const onChangeSelectedBar = () => {
    let selectedMenu = router.pathname.split("/")[1];
    if (selectedMenu == "admin") {
      if (router.pathname.split("/")[3] === "path") {
        selectedMenu = "academy";
      } else {
        selectedMenu = router.pathname.split("/")[2];
      }
    }

    if (
      router.pathname.startsWith("/academy") ||
      router.pathname.startsWith("/path") ||
      router.pathname.startsWith("/courses")
    ) {
      selectedMenu = "academy";
    }
    dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: selectedMenu as ISiderMenu });
  };

  const onChangeSelectedNavBar = () => {
    let selectedMenu = router.pathname.split("/")[1];
    if (selectedMenu == "admin") {
      if (router.pathname.split("/")[3] === "path") {
        selectedMenu = "academy";
      } else {
        selectedMenu = router.pathname.split("/")[2];
      }
    }
    if (
      router.pathname.startsWith("/academy") ||
      router.pathname.startsWith("/path") ||
      router.pathname.startsWith("/courses")
    ) {
      selectedMenu = "academy";
    }

    dispatch({ type: "SET_NAVBAR_MENU", payload: selectedMenu as IResponsiveNavMenu });
  };
  let intervalId: NodeJS.Timer | undefined;

  const getLatestNotificationCount = () => {
    NotificationService.countLatestNotification(
      (result) => {
        if (result.countUnreadNotifications) {
          dispatch({ type: "SET_UNREAD_NOTIFICATION", payload: result.countUnreadNotifications });
        } else {
          dispatch({ type: "SET_UNREAD_NOTIFICATION", payload: 0 });
        }
      },
      (error) => {}
    );
  };

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
  };

  const updateTheme = async (theme: Theme) => {
    localStorage.setItem("theme", theme);
    dispatch({
      type: "SET_SITE_CONFIG",
      payload: siteConfig,
    });
    dispatch({
      type: "SET_USER",
      payload: { ...user?.user },
    });

    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  useEffect(() => {
    let eventSource: EventSource;
    if (user && globalState.onlineStatus && globalState.onlineStatus) {
      eventSource = new EventSource("/api/v1/notification/push");

      eventSource.addEventListener("open", (event) => {
        console.log(`event source opened at : ${new Date()}`);
      });

      eventSource.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          const getNotificationView = NotificationView({ ...data, hasViewed: true });
          dispatch({
            type: "SET_UNREAD_NOTIFICATION",
            payload: data.notificationCount || 0,
          });

          data.notificationType &&
            openNotification(
              "topRight",
              getNotificationView.message,
              getNotificationView.description,
              getNotificationView.objectId,
              getNotificationView.targetLink
            );
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      });

      eventSource.addEventListener("error", (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
      });
    }
    return () => {
      if (eventSource) {
        console.log(`closing the event source: ${new Date()}`);
        eventSource.close();
      }
    };
  }, [router.pathname]);

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
      placement,
      style: { cursor: "pointer" },
      onClick: () => {
        objectId && updateNotification(Number(objectId), targetLink);
      },
    });
  };

  useEffect(() => {
    window.addEventListener("online", () => {
      dispatch({
        type: "SET_ONLINE_STATUS",
        payload: true,
      });
    });
    window.addEventListener("offline", () => {
      dispatch({
        type: "SET_LOADER",
        payload: false,
      });
      dispatch({
        type: "SET_ONLINE_STATUS",
        payload: false,
      });
    });
  }, []);

  useEffect(() => {
    !globalState.onlineStatus && message.warning("You are offline! check your internet connection ");
  }, [globalState.onlineStatus]);

  const onCollapseChange = () => {
    const collapsedState = localStorage.getItem("collapsed");

    if (collapsedState === "uncollapsed") {
      dispatch({
        type: "SET_COLLAPSED",
        payload: false,
      });
    } else if (collapsedState === "collapsed") {
      dispatch({
        type: "SET_COLLAPSED",
        payload: true,
      });
    }
  };

  const onLessonCollapseChange = () => {
    const collapsedState = localStorage.getItem("lessonCollapsed");

    if (collapsedState === "uncollapsed") {
      dispatch({
        type: "SET_LESSON_COLLAPSED",
        payload: false,
      });
    } else if (collapsedState === "collapsed") {
      dispatch({
        type: "SET_LESSON_COLLAPSED",
        payload: true,
      });
    }
  };

  useEffect(() => {
    let eventSource: EventSource;
    if (status === "authenticated") {
      if (user) {
        onChangeSelectedBar();
        onChangeSelectedNavBar();
        const userSession = user.user as UserSession;

        dispatch({
          type: "SET_USER",
          payload: userSession,
        });

        onCollapseChange();
        onLessonCollapseChange();
        onCheckTheme();
        if (localStorage.getItem("theme")) {
          dispatch({
            type: "SET_LOADER",
            payload: false,
          });
        }
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${brand?.brandColor}`);
  }, [brand?.brandColor]);
  return (
    <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
      <Spin spinning={globalState.pageLoading} indicator={<LoadingOutlined spin />} fullscreen size="large" />

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
        <link
          rel="icon"
          href={
            isValidImagePath(`${siteConfig.brand?.favicon}`) ? DOMPurify.sanitize(`${siteConfig.brand?.favicon}`) : ""
          }
        />
      </Head>
      <Spin spinning={globalState.pageLoading} indicator={<LoadingOutlined spin />} size="large">
        {contextHolder}
        {contextMessageHolder}
        {globalState.onlineStatus ? (
          <Layout hasSider className="default-container">
            <Sidebar menu={user?.role && user.role == Role.ADMIN ? adminMenu : userMenu} siteConfig={siteConfig} />
            <Layout className={`layout2-wrapper ${styles.layout2_wrapper} `}>
              <Content className={`${styles.sider_content} ${styles.className}`}>
                <Flex
                  align="center"
                  justify="space-between"
                  className={router.pathname.startsWith("/academy/course/") ? "" : styles.userNameWrapper}
                >
                  {isMobile && <h4>Hello {user?.user?.name}</h4>}
                  <Dropdown
                    className={styles.mobileUserMenu}
                    menu={{
                      items: [
                        {
                          key: "0",
                          label: (
                            <div
                              onClick={() => {
                                const newTheme: Theme = globalState.theme == "dark" ? "light" : "dark";
                                updateTheme(newTheme);
                              }}
                            >
                              {globalState.theme !== "dark" ? "Dark mode" : "Light mode"}
                            </div>
                          ),
                        },

                        {
                          key: "1",
                          label: "Logout",
                          onClick: () => {
                            signOut();
                          },
                        },
                      ],
                    }}
                    trigger={["click"]}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                  >
                    <i style={{ fontSize: 30, color: "var(--font-secondary)" }} className={styles.verticalDots}>
                      {SvgIcons.verticalThreeDots}
                    </i>
                  </Dropdown>
                </Flex>

                {children}
              </Content>
            </Layout>
            <ResponsiveNavBar items={responsiveNav} />
          </Layout>
        ) : (
          <Offline />
        )}
      </Spin>
    </ConfigProvider>
  );
};

export default AppLayout;
