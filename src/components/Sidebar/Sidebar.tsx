import React, { FC } from "react";
import styles from "../../styles/Sidebar.module.scss";
import { Avatar, Button, Dropdown, Flex, Layout, Menu, MenuProps, Modal, Space, Tooltip } from "antd";

import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";

import Feedback from "../Feedback/Feedback";

import { Theme } from "@/types/theme";
import { PageSiteConfig } from "@/services/siteConstant";

const { Sider } = Layout;

const Sidebar: FC<{ menu: MenuProps["items"]; siteConfig: PageSiteConfig }> = ({ menu, siteConfig }) => {
  const { data: user, status, update } = useSession();
  const { globalState, dispatch } = useAppContext();
  const { brand } = siteConfig;

  const [modal, contextWrapper] = Modal.useModal();

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

  return (
    <Sider
      width={260}
      theme="light"
      className={`${styles.main_sider} main_sider`}
      trigger={null}
      collapsible
      collapsed={globalState.collapsed}
    >
      <div
        className={`${styles.collapsed_btn} ${globalState.collapsed ? styles.collapsed : styles.not_collapsed}`}
        onClick={() => {
          dispatch({ type: "SET_COLLAPSED", payload: !globalState.collapsed });
          localStorage.setItem("collapsed", globalState.collapsed ? "uncollapsed" : "collapsed");
        }}
      >
        {globalState.collapsed ? SvgIcons.carretRight : SvgIcons.carretLeft}
      </div>
      {contextWrapper}
      <div>
        <div className={styles.logo}>
          <Link href="/">
            {globalState.collapsed ? (
              <img
                src={`${siteConfig?.brand?.icon}`}
                style={{ width: "auto", height: 40 }}
                alt={`logo of ${siteConfig?.brand?.name}`}
              />
            ) : (
              <Flex align="center" gap={5}>
                {typeof siteConfig?.brand?.logo === "string" && typeof siteConfig.brand.darkLogo === "string" ? (
                  <img
                    src={globalState.theme == "dark" ? siteConfig?.brand?.darkLogo : siteConfig?.brand?.logo}
                    style={{ width: "auto", height: 30 }}
                    alt={`logo of ${siteConfig.brand.name}`}
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
        </div>

        <Menu
          mode="inline"
          onSelect={(value) => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: value.key as ISiderMenu })}
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[globalState.selectedSiderMenu]}
          style={{ width: "100%", borderInlineEnd: "none" }}
          items={menu}
        />
      </div>
      <div>
        {!globalState.collapsed && (
          <Flex align="center" justify="space-between" className={styles.actionsWrapper}>
            <Tooltip
              className={styles.actionTooltip}
              title={`Switch to ${globalState?.theme == "dark" ? "light" : "dark"} mode`}
            >
              <Button
                type="default"
                shape="circle"
                onClick={() => {
                  const newTheme: Theme = globalState?.theme == "dark" ? "light" : "dark";
                  updateTheme(newTheme);
                }}
                icon={globalState?.theme == "dark" ? SvgIcons.sun : SvgIcons.moon}
              />
            </Tooltip>

            <Feedback />

            <Tooltip className={styles.actionTooltip} title={"Join Discord"}>
              <Link href={"https://discord.gg/DHU38pGw7C"} target="_blank">
                <i
                  style={{
                    fontSize: 20,
                    lineHeight: 0,
                    cursor: "pointer",
                  }}
                >
                  {SvgIcons.discord}
                </i>
              </Link>
            </Tooltip>
          </Flex>
        )}

        <Space
          direction={globalState.collapsed ? "vertical" : "horizontal"}
          style={{ cursor: "pointer" }}
          align={globalState.collapsed ? "center" : "start"}
          className={styles.user_profile}
        >
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
            <Space>
              <Avatar src={user?.user?.image} icon={<UserOutlined />} />
              {!globalState.collapsed && (
                <div className={styles.user_name_email}>
                  <div>{user?.user?.name}</div>
                  <div>{user?.user?.email}</div>
                </div>
              )}
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Sider>
  );
};

export default Sidebar;
