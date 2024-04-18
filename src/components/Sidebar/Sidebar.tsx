import React, { FC, useState } from "react";
import styles from "../../styles/Sidebar.module.scss";

import { Avatar, Badge, Button, Layout, Menu, MenuProps, Modal, Space, message } from "antd";

import { DashOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";

import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { error } from "console";

import { IResponse, getFetch } from "@/services/request";

const { Sider } = Layout;

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const router = useRouter();

  const [isNewNotifi, setNewNotifi] = React.useState(false);

  const { data: user } = useSession();
  const { globalState, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const [modal, contextWrapper] = Modal.useModal();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getNewNotification = async (userId: number) => {
    try {
      const res = await getFetch(`/api/notification/check/${user?.id}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        setNewNotifi(result.notifications);
      } else {
        message.error(result.error);
      }
    } catch (err: any) {
      console.log("Error while fetching Notification status");
    }
  };

  const siderMenu: MenuProps["items"] = [
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
      label: "Guides",
      key: "guides",
      icon: SvgIcons.guides,
    },
    {
      label: "Quiz",
      key: "quiz",
      icon: SvgIcons.quiz,
    },
    {
      type: "group",
      label: "ACCOUNT",
      key: "group",
    },
    {
      label: <Link href="/torq/setting">Setting</Link>,
      key: "setting",
      icon: SvgIcons.setting,
    },
    {
      label: <Link href="/torq/notifications">Notifications</Link>,
      key: "notification",
      icon: (
        <Badge color="blue" dot={!isNewNotifi}>
          {SvgIcons.nottification}
        </Badge>
      ),
    },
    {
      type: "group",
      label: "ADMINISTRATION",
      key: "administration",
    },
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

      key: "configuration",
      icon: SvgIcons.configuration,
    },
  ];

  React.useEffect(() => {
    if (user?.id) {
      getNewNotification(user.id);
    }
  }, [user?.id]);

  return (
    <Sider
      width={260}
      theme="light"
      className={`${styles.main_sider} main_sider`}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div
        className={`${styles.collapsed_btn} ${collapsed ? styles.collapsed : styles.not_collapsed}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? SvgIcons.carretRight : SvgIcons.carretLeft}
      </div>
      {contextWrapper}
      <div>
        <div className={styles.logo}>
          <Link href="/programs">
            {collapsed ? (
              <Image src="/icon/torq-logo.svg" alt="torq" width={40} height={30} />
            ) : (
              <Image src="/icon/torq-long-logo.svg" alt="torq" width={130} height={30} />
            )}
          </Link>
        </div>
        <Menu
          mode="inline"
          onSelect={(value) => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: value.key as ISiderMenu })}
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[globalState.selectedSiderMenu]}
          style={{ width: "100%", borderInlineEnd: "none" }}
          items={siderMenu}
        />
      </div>
      <Space
        direction={collapsed ? "vertical" : "horizontal"}
        align={collapsed ? "center" : "start"}
        className={styles.user_profile}
      >
        <Space>
          <Avatar icon={<UserOutlined />} />
          {!collapsed && (
            <div>
              <h4>{user?.user?.name}</h4>
              <h5>{user?.user?.email}</h5>
            </div>
          )}
        </Space>
        {!collapsed && SvgIcons.threeDots}
      </Space>
    </Sider>
  );
};

export default Sidebar;
