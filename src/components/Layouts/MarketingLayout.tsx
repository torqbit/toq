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
import { Role, TenantRole, User } from "@prisma/client";
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
import type { NotificationArgsProps } from "antd";
import { getFetch } from "@/services/request";

import { isValidGeneralLink, isValidImagePath } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import appConstant from "@/services/appConstant";
import SupportClientService from "@/services/client/tenant/SupportClientService";
import { getChatHistoryList } from "@/actions/getChatHistoryList";

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
  metaData?: {
    title: string;
    ogImage: string;
    description: string;
  };
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
  metaData,
}) => {
  const { globalState, dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const [showNotification, setOpenNotification] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, contexMessagetHolder] = message.useMessage();

  const { data: session, status } = useSession();

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
      payload: { ...session, role: session?.role, tenantRole: session?.tenant?.role },
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

  useEffect(() => {
    status !== "loading" && onCheckTheme();
  }, [siteConfig.brand?.defaultTheme, session]);

  const getNavBarExtraContent = (userRole?: Role) => {
    let showThemeSwitch = siteConfig.brand?.themeSwitch;

    switch (userRole) {
      case Role.STUDENT:
        return (
          <>
            <Flex align="center" gap={30}>
              <Flex align="center" gap={20} style={{ marginTop: 2 }}>
                {showThemeSwitch && (
                  <ThemeSwitch activeTheme={globalState.theme ?? "light"} previewMode={previewMode} />
                )}
              </Flex>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "0",
                      label: <Link href={`/settings`}>Setting</Link>,
                    },
                    {
                      key: "1",
                      label: <>Logout</>,
                      onClick: async () => {
                        await signOut({
                          redirect: false,
                          callbackUrl: `/login`,
                        });
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
        return (
          <>
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
              className={appLayoutStyles.userNameWrapper}
            >
              <Link href={"/settings"}>
                <Flex align="center" gap={10} style={{ cursor: "pointer" }}>
                  <Avatar src={user?.image} icon={<UserOutlined />} />
                  <h4 style={{ margin: 0 }}> {user?.name}</h4>
                </Flex>
              </Link>
              <Flex align="center" gap={10}>
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
                          signOut({
                            redirect: false,
                            callbackUrl: window.location.origin,
                          }).then((r) => {
                            window.location.reload();
                          });
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
              siteConfig={siteConfig}
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

        {/* {showFooter && (
          <Footer
            siteConfig={siteConfig}
            homeLink={homeLink ? homeLink : "/"}
            isMobile={isMobile}
            activeTheme={globalState.theme ?? "light"}
          />
        )} */}
      </div>
    </ConfigProvider>
  );
};

export default MarketingLayout;
