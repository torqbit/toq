import React, { FC, useState } from "react";
import styles from "./NavBar.module.scss";

import Link from "next/link";
import Image from "next/image";

import { Button, Drawer, Flex, Tooltip } from "antd";
import appConstant from "@/services/appConstant";
import { useAppContext } from "@/components/ContextApi/AppContext";
import SvgIcons from "@/components/SvgIcons";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";

const SideNav: FC<{
  isOpen: boolean;
  onAnchorClick: () => void;
  items: {
    title: string;
    link: string;
  }[];
}> = ({ isOpen, onAnchorClick, items }) => {
  const { dispatch } = useAppContext();
  const themeConfig = useThemeConfig();
  const onChangeTheme = () => {
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
      localStorage.setItem("theme", "light");
      dispatch({
        type: "SWITCH_THEME",
        payload: "light",
      });
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "dark");
      dispatch({
        type: "SWITCH_THEME",
        payload: "dark",
      });
    }
  };

  return (
    <section className={styles.sideNaveContainer}>
      <Drawer
        classNames={{ header: styles.drawerHeader }}
        title={
          <div className={styles.drawerTitle}>
            <Link href={"/"} aria-label="Go back to landing page">
              <Flex align="center" gap={5}>
                <Image src={`${themeConfig.brand?.logo}`} height={40} width={40} alt={"logo"} loading="lazy" />
                <h1 className="font-brand">{themeConfig.brand?.name?.toUpperCase()}</h1>
              </Flex>
            </Link>
            {isOpen && themeConfig.darkMode && (
              <Tooltip title={""}>
                <Button
                  type="default"
                  aria-label="Theme Switch"
                  className={styles.switchBtn}
                  shape="circle"
                  onClick={() => {
                    onChangeTheme();
                  }}
                  icon={localStorage.getItem("theme") == "dark" ? SvgIcons.sun : SvgIcons.moon}
                />
              </Tooltip>
            )}
          </div>
        }
        placement="left"
        width={300}
        closable={false}
        onClose={onAnchorClick}
        open={isOpen}
      >
        <div className={styles.menuDrawer}>
          {items.map((item, i) => {
            return (
              <div
                key={i}
                className={styles.drawerMenuItems}
                onClick={() => item.title === "Courses" && onAnchorClick()}
              >
                {item.title === "Courses" ? (
                  <a href={item.link} className={styles.menuTitle} aria-label={`link to ${item.title}`}>
                    <div>{item.title}</div>
                  </a>
                ) : (
                  <Link key={i} href={item.link} aria-label={`link to ${item.title}`}>
                    {item.title}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </Drawer>
    </section>
  );
};

export default SideNav;
