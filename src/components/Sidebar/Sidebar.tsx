import React, { FC, useEffect, useState } from "react";
import styles from "../../styles/Sidebar.module.scss";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Form,
  Input,
  Layout,
  Menu,
  MenuProps,
  message,
  Modal,
  Popover,
  Space,
  Tooltip,
} from "antd";

import { DashOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";

import { postFetch } from "@/services/request";
import appConstant from "@/services/appConstant";
import Feedback from "../Feedback/Feedback";
import { useSiteConfig } from "../ContextApi/SiteConfigContext";
import { Theme } from "@/types/theme";

const { Sider } = Layout;

const Sidebar: FC<{ menu: MenuProps["items"] }> = ({ menu }) => {
  // const [collapsed, setCollapsed] = React.useState(false);
  const { data: user, status, update } = useSession();
  const { globalState, dispatch } = useAppContext();
  const { brand } = useSiteConfig();

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
              <Image src="/icon/torqbit.png" alt="torq" width={40} height={40} />
            ) : (
              <Flex align="center" gap={5}>
                <Image src={`/icon/torqbit.png`} alt="torq" width={40} height={40} />
                <h4 className={styles.logoText}>{brand.name}</h4>
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
                    fill: "none",
                    stroke: globalState?.theme == "dark" ? "#939db8" : "#666",
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
