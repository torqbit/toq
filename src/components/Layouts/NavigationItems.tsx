import { Flex, MenuProps } from "antd";
import Link from "next/link";
import SvgIcons, { XIcon } from "../SvgIcons";
import { TenantRole } from "@prisma/client";
import { PageSiteConfig } from "@/services/siteConstant";

import sidebar from "@/styles/Sidebar.module.scss";
import styles from "@/styles/Layout2.module.scss";

import { ItemType } from "antd/es/menu/interface";
import { capitalize } from "@/lib/utils";

export const responsiveNav = [
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
];

export const adminMenu: MenuProps["items"] = [
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
    label: <Link href="/ai-assistant">AI Assistant</Link>,
    key: "ai-assistant",
    className: sidebar.menu__item,
    icon: <i style={{ fontSize: 18 }}>{SvgIcons.bot}</i>,
  },
];

export const superAdminMenu: MenuProps["items"] = [
  {
    label: <Link href="/dashboard">Dashboard</Link>,
    key: "dashboard",
    icon: (
      <i style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0 }} className={styles.events_icon}>
        {SvgIcons.dashboard}
      </i>
    ),
  },
];

export const ownerMenu: MenuProps["items"] = [
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
    label: <Link href="/ai-assistant">AI Assistant</Link>,
    key: "ai-assistant",
    className: sidebar.menu__item,
    icon: <i style={{ fontSize: 18 }}>{SvgIcons.bot}</i>,
  },
];

export const getSiderMenu = (
  siteConfig: PageSiteConfig,
  chatHistory: any[],
  role?: TenantRole,
  previewMode?: boolean
): ItemType[] => {
  const memberMenu: MenuProps["items"] = [
    {
      label: <Link href={previewMode ? "#" : "/"}>Home</Link>,
      key: "home",
      className: sidebar.menu__item,
      icon: <i style={{ fontSize: 18 }}>{SvgIcons.home}</i>,
      style: {
        color: "var(--font-secondary)",
      },
    },
  ];

  let extraMenu = [];

  if (chatHistory.length > 0) {
    extraMenu.push({
      key: "group-3",
      label: (
        <Flex align="center" justify="space-between">
          Recent Chats
        </Flex>
      ),

      children: chatHistory.map((r: any, i) => {
        return {
          label: (
            <Flex vertical gap={5} key={i}>
              <Link className={styles.chat__history__list} href={`/chat/${r.id}`}>
                {r.messages.length > 0 ? r.messages[0].content : ""}
              </Link>
            </Flex>
          ),
          key: r.id,
          className: sidebar.menu__item,

          style: { paddingLeft: 30 },
        };
      }),
    });
  }
  if (siteConfig.brand?.socialLinks) {
    let socialLinks = siteConfig.brand.socialLinks;

    const availableLinks = Object.entries(socialLinks)
      .map(([key, url]) => {
        if (!url) return null;
        return {
          key,
          label: (
            <Link key={key} target={previewMode ? "_self" : "_blank"} href={url} className="group">
              <Flex align="center" gap={10} style={{ width: "100%" }}>
                {key == "xcom" ? "X.com" : capitalize(key)}

                <i
                  key={key}
                  style={{ fontSize: 12, color: "var(--font-secondary)", lineHeight: 0 }}
                  className={`${styles.events_icon} hidden group-hover:block `}
                >
                  {SvgIcons.newWindow}
                </i>
              </Flex>
            </Link>
          ),
          icon: (
            <i
              key={key}
              style={{ fontSize: 15, color: "var(--font-secondary)", lineHeight: 0 }}
              className={styles.events_icon}
            >
              {SvgIcons[key as keyof typeof SvgIcons]}
            </i>
          ),

          className: sidebar.menu__item,
          style: { paddingLeft: 30 },
        };
      })
      .filter(Boolean);

    if (availableLinks.length > 0 && role !== TenantRole.OWNER) {
      extraMenu.push({
        key: "group-1",

        label: "Socials",
        children: availableLinks,
        style: {
          color: "var(--font-secondary)",
        },
      });
    }
  }

  switch (role) {
    case TenantRole.ADMIN:
      return adminMenu;
    case TenantRole.OWNER:
      return extraMenu.length > 0 ? ownerMenu.concat([...extraMenu]) : [...ownerMenu];
    case TenantRole.MEMBER:
      return extraMenu.length > 0 ? memberMenu.concat(extraMenu as any) : memberMenu;
    default:
      return extraMenu.length > 0 ? memberMenu.concat(extraMenu as any) : memberMenu;
  }
};
