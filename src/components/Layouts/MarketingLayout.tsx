import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "@/templates/standard/components/Hero/Hero.module.scss";
import landingPage from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import Head from "next/head";
import { useAppContext } from "../ContextApi/AppContext";
import { Avatar, Button, ConfigProvider, Dropdown, Flex, message, notification, Spin } from "antd";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { useMediaQuery } from "react-responsive";
import { Role, User } from "@prisma/client";
import { IBrandInfo } from "@/types/landing/navbar";
import { Theme } from "@/types/theme";
import Footer from "@/templates/standard/components/Footer/Footer";
import NavBar from "@/templates/standard/components/NavBar/NavBar";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import SvgIcons from "../SvgIcons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import appLayoutStyles from "@/styles/Layout2.module.scss";
import type { NotificationArgsProps } from "antd";
import NotificationPopOver from "../Notification/NotificationPopOver";
import NotificationView from "../Notification/NotificationView";
import { getFetch } from "@/services/request";

import { isValidGeneralLink, isValidImagePath } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import appConstant from "@/services/appConstant";

type NotificationPlacement = NotificationArgsProps["placement"];

const MarketingLayout: FC<{
  children?: React.ReactNode;
  heroSection?: React.ReactNode;
  siteConfig: PageSiteConfig;
  previewMode?: boolean;
  homeLink?: string;
  user?: User;
  showFooter?: boolean;
  navBarWidth?: string | number;
  mobileHeroMinHeight?: string | number;
}> = ({
  children,
  heroSection,
  user,
  siteConfig,
  previewMode,
  homeLink,
  showFooter = true,
  navBarWidth,
  mobileHeroMinHeight = "30vh",
}) => {
  const { globalState, dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const [showNotification, setOpenNotification] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, contexMessagetHolder] = message.useMessage();
  const authorizedUrls = appConstant.authorizedUrls;

  const router = useRouter();
  const { data: session } = useSession();

  const { brand } = siteConfig;
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${brand?.brandColor}`);
  }, []);

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
      type: "SET_USER",
      payload: { ...session },
    });

    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");

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
      dispatch({
        type: "SET_LOADER",
        payload: false,
      });
    }
  };

  useEffect(() => {
    let eventSource: EventSource;
    if (user) {
      eventSource = new EventSource("/api/v1/notification/push");

      eventSource.addEventListener("open", (event) => {});

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
        eventSource.close();
      }
    };
  }, []);

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
    onCheckTheme();
  }, [siteConfig.brand?.defaultTheme]);

  const getNavBarExtraContent = (userRole?: Role) => {
    let showThemeSwitch = siteConfig.brand?.themeSwitch;

    switch (userRole) {
      case Role.STUDENT:
        return (
          <>
            <ul>
              <li>
                <Link href={"/courses"} style={{ color: "var(--font-secnodary)" }} aria-label={`link to course page`}>
                  Courses
                </Link>
              </li>
              <li>
                <Link href={"/blogs"} style={{ color: "var(--font-secnodary)" }} aria-label={`link to blogs page`}>
                  Blogs
                </Link>
              </li>
            </ul>

            <Flex align="center" gap={30}>
              <Flex align="center" gap={20} style={{ marginTop: 2 }}>
                {showThemeSwitch && (
                  <ThemeSwitch activeTheme={globalState.theme ?? "light"} previewMode={previewMode} />
                )}

                <NotificationPopOver
                  minWidth={isMobile ? "70vw" : "420px"}
                  placement="bottomLeft"
                  siteConfig={siteConfig}
                  showNotification={showNotification}
                  onOpenNotification={setOpenNotification}
                />
              </Flex>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "0",
                      label: <Link href={`/setting`}>Setting</Link>,
                    },
                    {
                      key: "1",
                      label: <>Logout</>,
                      onClick: () => {
                        signOut();
                      },
                    },
                  ],
                }}
                trigger={["click"]}
                placement="topLeft"
                arrow={{ pointAtCenter: true }}
              >
                <Flex align="center" gap={5} style={{ cursor: "pointer" }}>
                  <Avatar src={session?.user?.image} icon={<UserOutlined />} />
                  <i style={{ lineHeight: 0, color: "var(--font-secondary)", fontSize: 20 }}>{SvgIcons.chevronDown}</i>
                </Flex>
              </Dropdown>
            </Flex>
          </>
        );

      default:
        let items = siteConfig.navBar?.links || [];
        return (
          <>
            {siteConfig.navBar?.links && siteConfig.navBar?.links.length === 0 ? (
              <div></div>
            ) : (
              <ul>
                {items.map((navigation, i) => {
                  return (
                    <li key={i}>
                      <Link
                        href={
                          authorizedUrls.includes(DOMPurify.sanitize(`${navigation.link}`))
                            ? DOMPurify.sanitize(`${navigation.link}`)
                            : "#"
                        }
                        aria-label={`link to ${DOMPurify.sanitize(`${navigation.title}`)} page`}
                      >
                        {navigation.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <Flex align="center" gap={20}>
              {showThemeSwitch && <ThemeSwitch activeTheme={globalState.theme ?? "light"} previewMode={previewMode} />}

              <Link href={user ? `/dashboard` : `${previewMode ? "#" : "/login"}`} aria-label="Get started">
                <Button type="primary">{user ? "Go to Dashboard" : "Get Started"}</Button>
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
      <Spin spinning={globalState.pageLoading} indicator={<LoadingOutlined spin />} fullscreen size="large" />

      <Head>
        <title>{`${siteConfig.brand?.name} · ${siteConfig.brand?.title}`}</title>
        <meta name="description" content={siteConfig.brand?.description} />
        <meta property="og:image" content={getOgImagSrc()} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link
          rel="icon"
          href={
            isValidImagePath(`${siteConfig.brand?.favicon}`) ? DOMPurify.sanitize(`${siteConfig.brand?.favicon}`) : ""
          }
        />
      </Head>
      <section
        className={`${styles.heroWrapper} hero__wrapper`}
        style={{ minHeight: isMobile ? mobileHeroMinHeight : "60px" }}
      >
        {contextHolder}
        {contexMessagetHolder}
        {isMobile && user?.role == Role.STUDENT ? (
          <Flex
            style={{ width: "90vw", padding: "10px 0px" }}
            align="center"
            justify="space-between"
            className={router.pathname.startsWith("/academy/course/") ? "" : appLayoutStyles.userNameWrapper}
          >
            <Link href={"/setting"}>
              <Flex align="center" gap={10} style={{ cursor: "pointer" }}>
                <Avatar src={user?.image} icon={<UserOutlined />} />
                <h4 style={{ margin: 0 }}> {user?.name}</h4>
              </Flex>
            </Link>
            <Flex align="center" gap={10}>
              <NotificationPopOver
                placement="bottomLeft"
                minWidth={isMobile ? "70vw" : "420px"}
                siteConfig={siteConfig}
                showNotification={showNotification}
                onOpenNotification={setOpenNotification}
              />

              <Dropdown
                className={appLayoutStyles.mobileUserMenu}
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
                <i style={{ fontSize: 30, color: "var(--font-secondary)" }} className={appLayoutStyles.verticalDots}>
                  {SvgIcons.verticalThreeDots}
                </i>
              </Dropdown>
            </Flex>
          </Flex>
        ) : (
          <></>
        )}

        {NavBarComponent && (
          <NavBarComponent
            user={user}
            isMobile={isMobile}
            defaultNavlink={previewMode ? "#" : "/login"}
            homeLink={homeLink ? homeLink : "/"}
            items={siteConfig.navBar?.links ?? []}
            showThemeSwitch={siteConfig.brand?.themeSwitch ?? DEFAULT_THEME.brand.themeSwitch}
            activeTheme={globalState.theme ?? "light"}
            brand={brandInfo}
            previewMode={previewMode}
            extraContent={getNavBarExtraContent(user?.role)}
            navBarWidth={navBarWidth}
          />
        )}

        {heroSection}
      </section>
      <div
        className={`${landingPage.children_wrapper} children__wrapper`}
        style={{ minHeight: isMobile && heroSection ? `calc(50vh - 250px)` : `calc(100vh - 250px)` }}
      >
        {children}
      </div>

      {showFooter && (
        <Footer
          siteConfig={siteConfig}
          homeLink={homeLink ? homeLink : "/"}
          isMobile={isMobile}
          activeTheme={globalState.theme ?? "light"}
        />
      )}
    </ConfigProvider>
  );
};

export default MarketingLayout;
