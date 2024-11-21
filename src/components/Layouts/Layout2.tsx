import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Layout2.module.scss";
import Head from "next/head";
import Sidebar from "../Sidebar/Sidebar";
import { signOut, useSession } from "next-auth/react";
import { IResponsiveNavMenu, ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { Badge, ConfigProvider, Dropdown, Flex, Layout, MenuProps, message } from "antd";
import SvgIcons from "../SvgIcons";
import Link from "next/link";
import { UserSession } from "@/lib/types/user";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import { useRouter } from "next/router";
import SpinLoader from "../SpinLoader/SpinLoader";
import NotificationService from "@/services/NotificationService";
import ConversationService, { IConversationList } from "@/services/ConversationService";
import { IConversationData } from "@/pages/api/v1/conversation/list";
import Offline from "../Offline/Offline";

import { postFetch } from "@/services/request";
import { useMediaQuery } from "react-responsive";

import { Theme } from "@/types/theme";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";

const { Content } = Layout;

const Layout2: FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { data: user, status, update } = useSession();

  const isMobile = useMediaQuery({ query: "(max-width: 933px)" });
  const { globalState, dispatch } = useAppContext();
  const [conversationList, setConversationList] = useState<IConversationData[]>();
  const [comment, setComment] = useState<string>("");
  const siteConfig = globalState.siteConfig;
  const { brand } = siteConfig;

  const [conversationLoading, setConversationLoading] = useState<{
    postLoading: boolean;
    replyLoading: boolean;
  }>({
    postLoading: false,
    replyLoading: false,
  });

  const router = useRouter();

  const responsiveNav = [
    {
      title: "Dashboard",
      icon: SvgIcons.dashboard,
      link: "dashboard",
    },
    {
      title: "Course",
      icon: SvgIcons.courses,
      link: "courses",
    },
    {
      title: "Events",
      icon: <i className={styles.events_icon}>{SvgIcons.events}</i>,
      link: "events-list",
    },
    {
      title: "Settings",
      icon: SvgIcons.setting,
      link: "setting",
    },
    {
      title: "Notifications",
      icon: SvgIcons.nottification,

      link: "notifications",
    },
  ];

  const authorSiderMenu: MenuProps["items"] = [
    {
      type: "group",
      label: "ADMINISTRATION",
      key: "administration",

      children: [
        {
          label: <Link href="/admin/users">Users</Link>,
          key: "users",
          icon: SvgIcons.userGroup,
        },
        {
          label: <Link href="/admin/content">Content</Link>,
          key: "content",
          icon: SvgIcons.content,
        },
        {
          label: <Link href="/admin/config">Configurations</Link>,

          key: "config",
          icon: SvgIcons.configuration,
        },
        // {
        //   label: <Link href="/admin/conversations">Conversations</Link>,

        //   key: "conversations",
        //   icon: SvgIcons.message,
        // },
      ],
    },
  ];
  const usersMenu: MenuProps["items"] = [
    {
      type: "group",
      label: "LEARN",
      key: "group1",
    },
    {
      label: <Link href="/dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: SvgIcons.dashboard,
    },
    {
      label: <Link href="/courses">Courses</Link>,
      key: "courses",
      icon: SvgIcons.courses,
    },
    {
      label: <Link href="/events-list">Events</Link>,
      key: "events-list",
      icon: <i style={{ fontSize: 18 }}>{SvgIcons.events}</i>,
    },
    {
      label: <Link href="/quizzes">Quizzes</Link>,
      key: "quizzes",
      icon: SvgIcons.quiz,
    },
    {
      type: "group",
      label: "ACCOUNT",
      key: "group",
    },

    {
      label: <Link href="/setting">Setting</Link>,
      key: "setting",
      icon: SvgIcons.setting,
    },
    {
      label: <Link href="/notifications">Notifications</Link>,
      key: "notifications",
      icon: (
        <Badge
          color="blue"
          classNames={{ indicator: styles.badgeIndicator }}
          count={globalState.notifications && globalState.notifications > 0 ? globalState.notifications : 0}
          style={{ fontSize: 10, paddingTop: 1.5 }}
          size="small"
        >
          {SvgIcons.nottification}
        </Badge>
      ),
    },
  ];
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
    if ((!currentTheme || currentTheme === "dark") && siteConfig.darkMode) {
      localStorage.setItem("theme", "dark");
    } else if (currentTheme === "light" || !siteConfig.darkMode) {
      localStorage.setItem("theme", "light");
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);
  };

  const updateTheme = async (theme: Theme) => {
    localStorage.setItem("theme", theme);
    dispatch({
      type: "SET_USER",
      payload: { ...user?.user },
    });

    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const getAllConversation = () => {
    ConversationService.getAllConversation(
      (result) => {
        setConversationList(result.comments);
      },
      (error) => {}
    );
  };

  const onPost = () => {
    setConversationLoading({ postLoading: true, replyLoading: false });
    if (comment) {
      let id = conversationList && conversationList[0].id;
      ConversationService.addConversation(
        String(comment),
        id,
        (result) => {
          const updateList = conversationList?.map((list, i) => {
            if (i === conversationList.length - 1) {
              return {
                ...list,
                comments: [...list.comments, result.conversation.comment],
              };
            } else {
              return list;
            }
          });
          setConversationList(updateList as IConversationData[]);
          message.success(result.message);
          setComment("");
          setConversationLoading({ postLoading: false, replyLoading: false });
        },
        (error) => {
          message.error(error);
          setConversationLoading({ postLoading: false, replyLoading: false });
        }
      );
    } else {
      message.warning("Type a comment first");
      setConversationLoading({ postLoading: false, replyLoading: false });
    }
  };
  useEffect(() => {
    if (user) {
      if (typeof intervalId === "undefined") {
        intervalId = setInterval(() => {
          getLatestNotificationCount();
        }, 5000);
      }
    }
    return () => intervalId && clearInterval(Number(intervalId));
  });

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
    if (status === "authenticated") {
      if (user) {
        getLatestNotificationCount();
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
        dispatch({
          type: "SET_LOADER",
          payload: false,
        });
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
    <>
      {globalState.pageLoading ? (
        <SpinLoader />
      ) : (
        <>
          <ConfigProvider
            theme={globalState.theme == "dark" ? darkThemeConfig(DEFAULT_THEME) : antThemeConfig(DEFAULT_THEME)}
          >
            <Head>
              <title>Torqbit | Learn to build software products</title>

              <meta name="description" content="Learn, build and solve the problems that matters the most" />
              <meta property="og:image" content={"https://cdn.torqbit.com/website/img/torqbit-landing.png"} />

              <link rel="icon" href="/favicon.ico" />
            </Head>

            {globalState.onlineStatus ? (
              <Layout hasSider className="default-container">
                <Sidebar
                  menu={user?.role == "AUTHOR" || user?.role == "ADMIN" ? usersMenu.concat(authorSiderMenu) : usersMenu}
                  siteConfig={siteConfig}
                />
                <Layout className={`layout2-wrapper ${styles.layout2_wrapper} `}>
                  <Content className={`${styles.sider_content} ${styles.className}`}>
                    <Flex
                      align="center"
                      justify="space-between"
                      className={router.pathname.startsWith("/admin/content/course") ? "" : styles.userNameWrapper}
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
                        <i className={styles.verticalDots}>{SvgIcons.verticalThreeDots}</i>
                      </Dropdown>
                    </Flex>

                    {children}
                  </Content>
                </Layout>
                <div className={styles.responsiveNavContainer}>
                  {responsiveNav.map((nav, i) => {
                    return (
                      <>
                        {nav.title === "Notifications" ? (
                          <Badge
                            key={i}
                            color="blue"
                            classNames={{ indicator: styles.badgeIndicator }}
                            count={
                              globalState.notifications && globalState.notifications > 0 ? globalState.notifications : 0
                            }
                            style={{ fontSize: 8, paddingTop: 1.5 }}
                            size="small"
                          >
                            <div
                              key={i}
                              className={
                                globalState.selectedResponsiveMenu === nav.link ? styles.selectedNavBar : styles.navBar
                              }
                              onClick={() =>
                                dispatch({ type: "SET_NAVBAR_MENU", payload: nav.link as IResponsiveNavMenu })
                              }
                            >
                              <Link key={i} href={`/${nav.link}`}>
                                <span></span>
                                <Flex vertical align="center" gap={5} justify="space-between">
                                  <i>{nav.icon}</i>
                                  <div className={styles.navTitle}>{nav.title}</div>
                                </Flex>
                              </Link>
                            </div>
                          </Badge>
                        ) : (
                          <div
                            key={i}
                            className={
                              globalState.selectedResponsiveMenu === nav.link ? styles.selectedNavBar : styles.navBar
                            }
                            onClick={() =>
                              dispatch({ type: "SET_NAVBAR_MENU", payload: nav.link as IResponsiveNavMenu })
                            }
                          >
                            <Link key={i} href={`/${nav.link}`}>
                              <span></span>
                              <Flex vertical align="center" gap={5} justify="space-between">
                                <i>{nav.icon}</i>
                                <div className={styles.navTitle}>{nav.title}</div>
                              </Flex>
                            </Link>
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
              </Layout>
            ) : (
              <Offline />
            )}
          </ConfigProvider>
        </>
      )}
    </>
  );
};

export default Layout2;
