import React, { FC, useEffect, useState } from "react";
import styles from "../../styles/Sidebar.module.scss";
import { Avatar, Button, Dropdown, Flex, Layout, Menu, MenuProps, Modal, Space, Switch, Tag, Tooltip } from "antd";

import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";

import { Theme } from "@/types/theme";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { useRouter } from "next/router";
import { TenantRole } from "@prisma/client";
import { showPlanAlertBar } from "@/lib/utils";
import Image from "next/image";

const ThemSwitch: FC<{ theme: Theme; updateTheme: (value: Theme) => void }> = ({ theme, updateTheme }) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      className={styles.theme__switch}
      style={{ height: 50, padding: "10px 20px" }}
      onClick={() => {
        updateTheme(theme == "light" ? "dark" : "light");
      }}
    >
      <Flex align="center" gap={10}>
        <i style={{ lineHeight: 0, color: "var(--font-secondary)", fontSize: 18 }}>{SvgIcons.moon}</i>
        <p> Dark mode</p>
      </Flex>
      <Switch checked={theme == "dark"} />
    </Flex>
  );
};

const { Sider } = Layout;

const Sidebar: FC<{
  menu: MenuProps["items"];
  siteConfig: PageSiteConfig;
  fixedSideBar?: boolean;
}> = ({ menu, siteConfig, fixedSideBar = false }) => {
  const { data: user, status, update } = useSession();
  const { globalState, dispatch } = useAppContext();

  const router = useRouter();
  let defaultOpenKeys = menu?.filter((m: any) => m.children && m.children.length > 0).map((m) => m?.key);

  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys as string[]);
  const [modal, contextWrapper] = Modal.useModal();
  useEffect(() => {
    if (globalState.chatList.length > 0 && !openKeys.includes("group-3")) {
      setOpenKeys([...openKeys, "group-3"]);
    }
  }, [globalState.chatList]);
  const updateTheme = async (theme: Theme) => {
    localStorage.setItem("theme", theme);

    dispatch({
      type: "SET_USER",
      payload: { ...user?.user, role: user?.role, tenantRole: user?.tenant?.role },
    });

    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const getDefaultSelectedSideMenu = () => {
    switch (user?.tenant?.role) {
      case TenantRole.ADMIN:
        return "dashboard";

      case TenantRole.OWNER:
        return router.pathname == "/" ? "home" : "dashboard";

      case TenantRole.MEMBER:
        return "home";

      default:
        return "home";
    }
  };

  return (
    <Sider
      width={260}
      theme="light"
      style={{
        height: showPlanAlertBar(user) && !fixedSideBar ? "calc(100vh - 50px)" : "100vh",
        position: fixedSideBar ? "fixed" : "relative",
        left: 0,
        zIndex: 999,
      }}
      className={`${styles.main_sider} main_sider`}
      trigger={null}
      collapsible
      collapsed={globalState.collapsed}
    >
      {!fixedSideBar && (
        <div
          className={`${styles.collapsed_btn} ${globalState.collapsed ? styles.collapsed : styles.not_collapsed}`}
          onClick={() => {
            dispatch({ type: "SET_COLLAPSED", payload: !globalState.collapsed });
            localStorage.setItem("collapsed", globalState.collapsed ? "uncollapsed" : "collapsed");
          }}
        >
          {globalState.collapsed ? SvgIcons.carretRight : SvgIcons.carretLeft}
        </div>
      )}
      {!fixedSideBar && (
        <div
          className={`${styles.collapsed_btn} ${globalState.collapsed ? styles.collapsed : styles.not_collapsed}`}
          onClick={() => {
            dispatch({ type: "SET_COLLAPSED", payload: !globalState.collapsed });
            localStorage.setItem("collapsed", globalState.collapsed ? "uncollapsed" : "collapsed");
          }}
        >
          {globalState.collapsed ? SvgIcons.carretRight : SvgIcons.carretLeft}
        </div>
      )}
      {contextWrapper}
      <div>
        <div className={styles.logo} style={{ height: !fixedSideBar ? "auto" : 65 }}>
          {!fixedSideBar && (
            <>
              {globalState.collapsed ? (
                <Link href="/" style={{ width: "40px", height: "40px" }}>
                  <img
                    src={`${siteConfig?.brand?.icon}`}
                    style={{ width: "40px", height: "40px" }}
                    alt={`logo of ${siteConfig?.brand?.name}`}
                  />
                </Link>
              ) : (
                <Link href="/">
                  {(globalState.theme == "dark" &&
                    siteConfig?.brand?.darkLogo == DEFAULT_THEME.brand.darkLogo &&
                    window.location.origin !== process.env.NEXT_PUBLIC_NEXTAUTH_URL) ||
                  (globalState.theme == "light" &&
                    siteConfig?.brand?.logo == DEFAULT_THEME.brand.logo &&
                    window.location.origin !== process.env.NEXT_PUBLIC_NEXTAUTH_URL) ? (
                    <>
                      <h1 className="font-brand" style={{ marginLeft: 15 }}>
                        {siteConfig?.brand?.name}
                      </h1>
                    </>
                  ) : (
                    <Flex align="center" gap={5}>
                      {typeof siteConfig?.brand?.logo === "string" && typeof siteConfig.brand.darkLogo === "string" ? (
                        <Image
                          className={styles.logo_img}
                          src={globalState.theme == "dark" ? siteConfig?.brand?.darkLogo : siteConfig?.brand?.logo}
                          height={100}
                          alt={`logo of ${siteConfig.brand?.name}`}
                          width={200}
                          style={{ width: "auto", height: 30, cursor: "pointer" }}
                        />
                      ) : (
                        siteConfig?.brand?.logo
                      )}
                      {!siteConfig?.brand?.logo && (
                        <Flex align="center" gap={10}>
                          <img
                            src={`${siteConfig?.brand?.icon}`}
                            style={{ width: "auto", height: 30 }}
                            alt={`logo of ${siteConfig?.brand?.name}`}
                          />
                          <h1 className="font-brand">{siteConfig?.brand?.name}</h1>
                        </Flex>
                      )}
                    </Flex>
                  )}
                </Link>
              )}
            </>
          )}
        </div>

        <Menu
          mode="inline"
          rootClassName={styles.content__menu__wrapper}
          onSelect={(value) => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: value.key as ISiderMenu })}
          defaultSelectedKeys={[getDefaultSelectedSideMenu()]}
          openKeys={openKeys}
          onOpenChange={(e) => {
            setOpenKeys(e);
          }}
          className={styles.menu}
          selectedKeys={[globalState.selectedSiderMenu]}
          style={{ width: "100%", borderInlineEnd: "none" }}
          items={menu}
        />
      </div>
      <div>
        {!fixedSideBar && !globalState.collapsed && (
          <Flex justify="center" align="center">
            <Tag style={{ width: "100%", margin: "10px 20px", textAlign: "center", padding: 10 }}>
              <Flex justify="center" align="center" style={{ width: "100%", fontSize: 14 }}>
                Currently in Preview
              </Flex>
            </Tag>
          </Flex>
        )}
        {!globalState.collapsed && (
          <>
            {siteConfig.brand?.themeSwitch && !fixedSideBar && (
              <ThemSwitch updateTheme={updateTheme} theme={globalState.theme as Theme} />
            )}
          </>
        )}

        {fixedSideBar ? (
          <div className={styles.powered__by}>
            <Link href="https://torqbit.com " target="_blank">
              <Flex align="center" justify="center" gap={5}>
                <p>Powered by </p>
                <i>{SvgIcons.brandTitle}</i>
              </Flex>
            </Link>
          </div>
        ) : (
          <div style={{ cursor: "pointer", width: "100%" }} className={styles.user_profile}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "0",
                    label: <Link href={`/settings`}>Settings</Link>,
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
              <Flex align="center" justify="space-between">
                <Flex align="center" gap={5} style={{ width: "100%" }}>
                  <Avatar src={user?.user?.image} icon={<UserOutlined />} />
                  {!globalState.collapsed && (
                    <div className={styles.user_name_email}>
                      <div>{user?.user?.name}</div>
                    </div>
                  )}
                </Flex>
                {!globalState.collapsed && (
                  <i style={{ fontSize: 20, lineHeight: 0, color: "var(--font-secondary)" }}>{SvgIcons.threeDots}</i>
                )}
              </Flex>
            </Dropdown>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
