import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";
import { signOut, useSession } from "next-auth/react";
import { IResponsiveNavMenu, ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { ConfigProvider, Drawer, Dropdown, Flex, Layout, MenuProps, message, notification, Spin } from "antd";
import SvgIcons from "../SvgIcons";
import { UserSession } from "@/lib/types/user";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { useRouter } from "next/router";
import Offline from "../Offline/Offline";
import { useMediaQuery } from "react-responsive";
import { Theme } from "@/types/theme";
import { PageSiteConfig } from "@/services/siteConstant";
import { LoadingOutlined } from "@ant-design/icons";
import { Role, TenantRole } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";
const { Content } = Layout;

import { isValidImagePath, showPlanAlertBar } from "@/lib/utils";
import PlanAlertBar from "../PlanAlertBar/PlanAlertBar";

import { getSiderMenu, responsiveNav, superAdminMenu } from "./NavigationItems";
import SupportClientService from "@/services/client/tenant/SupportClientService";
import { getChatHistoryList } from "@/actions/getChatHistoryList";

const AppLayout: FC<{
  children?: React.ReactNode;
  className?: string;
  siteConfig: PageSiteConfig;
  width?: string;
  previewMode?: boolean;
}> = ({ width, children, className, siteConfig, previewMode }) => {
  const { data: user, status, update } = useSession();

  const isMobile = useMediaQuery({ query: "(max-width: 933px)" });
  const { globalState, dispatch } = useAppContext();
  const [api, contextHolder] = notification.useNotification();
  const { brand } = siteConfig;
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const router = useRouter();

  const onChangeSelectedBar = () => {
    let selectedMenu = router.pathname.split("/")[1];
    if (selectedMenu == "admin") {
      selectedMenu = router.pathname.split("/")[2];
    }

    dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: selectedMenu as ISiderMenu });
  };

  const onChangeSelectedNavBar = () => {
    let selectedMenu = router.pathname.split("/")[1];
    if (selectedMenu == "admin") {
      selectedMenu = router.pathname.split("/")[2];
    }

    dispatch({ type: "SET_NAVBAR_MENU", payload: selectedMenu as IResponsiveNavMenu });
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
      payload: { ...user?.user, role: user?.role, tenantRole: user?.tenant?.role },
    });

    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
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

  const getChatList = async () => {
    if (user?.tenant?.role !== TenantRole.OWNER) {
      const res = await getChatHistoryList();
      dispatch({ type: "SET_CHAT_LIST", payload: res });
    }
  };
  useEffect(() => {
    let eventSource: EventSource;
    if (status === "authenticated") {
      if (user) {
        getChatList();
        onChangeSelectedBar();
        onChangeSelectedNavBar();
        const userSession = { ...user.user, role: user?.role, tenantRole: user?.tenant?.role } as UserSession;

        dispatch({
          type: "SET_USER",
          payload: userSession,
        });

        onCollapseChange();
        onCheckTheme();

        if (localStorage.getItem("theme")) {
          if (!globalState.appLoaded) {
            dispatch({ type: "SET_APP_LOADED", payload: true });
          }
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
      {contextHolder}
      {contextMessageHolder}

      {globalState.pageLoading ? (
        <Spin spinning={true} fullscreen indicator={<LoadingOutlined spin />} size="large">
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
      ) : (
        <>
          {globalState.onlineStatus ? (
            <>
              {showPlanAlertBar(user) && <PlanAlertBar onUpgrade={showModal} />}

              <Layout hasSider className="default-container">
                {user?.role === Role.ADMIN && <Sidebar menu={superAdminMenu} siteConfig={siteConfig} />}
                {user?.role === Role.CUSTOMER && (
                  <Sidebar
                    menu={getSiderMenu(siteConfig, chatHistory, user.tenant?.role, previewMode)}
                    siteConfig={siteConfig}
                  />
                )}

                <Layout
                  className={`layout2-wrapper ${styles.layout2_wrapper}  `}
                  style={{ height: showPlanAlertBar(user) ? "calc(100vh - 50px)" : "100vh" }}
                >
                  <Content className={`${styles.sider_content} ${styles.className}`}>
                    <Flex align="center" justify="space-between" className={styles.userNameWrapper}>
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
                              onClick: async () => {
                                await signOut({
                                  callbackUrl: `/login`,
                                });
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

                    {user && (
                      <div style={{ width: width ? width : "var(--main-content-width)", margin: "0 auto" }}>
                        {children}
                      </div>
                    )}
                  </Content>
                </Layout>
                {/* <ResponsiveNavBar items={responsiveNav} /> */}
              </Layout>
            </>
          ) : (
            <Offline />
          )}
        </>
      )}
    </ConfigProvider>
  );
};

export default AppLayout;
