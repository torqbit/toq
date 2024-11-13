import React, { FC, useState } from "react";

import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";

import Link from "next/link";
import Image from "next/image";

import { Button, Drawer, Flex, Tooltip } from "antd";
import appConstant from "@/services/appConstant";
import { useAppContext } from "@/components/ContextApi/AppContext";
import SvgIcons from "@/components/SvgIcons";

const SideNav: FC<{ isOpen: boolean; onAnchorClick: () => void }> = ({ isOpen, onAnchorClick }) => {
  const { dispatch } = useAppContext();
  const menuItems = [
    {
      label: "Courses",
      href: "/#courses",
    },
    {
      label: "Events",
      href: "/events",
    },
    {
      label: "Blogs",
      href: "/blogs",
    },
  ];

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
                <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} loading="lazy" />
                <h1 className="font-brand">{appConstant.platformName.toUpperCase()}</h1>
              </Flex>
            </Link>
            {isOpen && (
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
          {menuItems.map((item, i) => {
            return (
              <div
                key={i}
                className={styles.drawerMenuItems}
                onClick={() => item.label === "Courses" && onAnchorClick()}
              >
                {item.label === "Courses" ? (
                  <a href={item.href} className={styles.menuTitle} aria-label={`link to ${item.label}`}>
                    <div>{item.label}</div>
                  </a>
                ) : (
                  <Link key={i} href={item.href} aria-label={`link to ${item.label}`}>
                    {item.label}
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
