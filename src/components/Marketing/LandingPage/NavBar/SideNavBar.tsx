import React, { FC, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { Button, Drawer, Flex, Tooltip } from "antd";
import { useAppContext } from "@/components/ContextApi/AppContext";
import SvgIcons from "@/components/SvgIcons";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import styles from "./NavBar.module.scss";
import { ISideNavBarProps } from "@/types/courses/navbar";
import { onChangeTheme } from "@/lib/utils";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";

const SideNav: FC<ISideNavBarProps> = ({ isOpen, onAnchorClick, items, showThemeSwitch, activeTheme, brand }) => {
  return (
    <section className={styles.sideNaveContainer}>
      <Drawer
        classNames={{ header: styles.drawerHeader }}
        title={
          <div className={styles.drawerTitle}>
            <Link href={"/"} aria-label="Go back to landing page">
              <Flex align="center" gap={5}>
                <Image src={`${brand?.logo}`} height={40} width={40} alt={"logo"} loading="lazy" />
                <h1 className="font-brand">{brand?.name?.toUpperCase()}</h1>
              </Flex>
            </Link>
            {isOpen && showThemeSwitch && (
              // <Tooltip title={""}>
              //   <Button
              //     type="default"
              //     aria-label="Theme Switch"
              //     className={styles.switchBtn}
              //     shape="circle"
              //     onClick={() => {
              //       onChangeTheme(dispatch, showThemeSwitch);
              //     }}
              //     icon={activeTheme == "dark" ? SvgIcons.sun : SvgIcons.moon}
              //   />
              // </Tooltip>
              <ThemeSwitch activeTheme={activeTheme} />
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
