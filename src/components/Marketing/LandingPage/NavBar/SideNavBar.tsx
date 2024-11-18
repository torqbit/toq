import React, { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Drawer, Flex } from "antd";
import styles from "./NavBar.module.scss";
import { INavBarProps } from "@/types/landing/navbar";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";
import Hamburger from "hamburger-react";

const MobileNav: FC<INavBarProps> = ({ items, showThemeSwitch, activeTheme, brand }) => {
  const [showSideNav, setSideNav] = useState(false);

  const onAnchorClick = () => {
    setSideNav(false);
  };
  return (
    <>
      <section className={styles.sideNaveContainer}>
        <Drawer
          classNames={{ header: styles.drawerHeader }}
          title={
            <div className={styles.drawerTitle}>
              <Link href={"/"} aria-label="Go back to landing page">
                <Flex align="center" gap={5}>
                  <Image src={`${brand.logo}`} height={40} width={40} alt={"logo"} loading="lazy" />
                  <h1 className="font-brand">{brand.name}</h1>
                </Flex>
              </Link>
              {showSideNav && showThemeSwitch && <ThemeSwitch activeTheme={activeTheme} />}
            </div>
          }
          placement="left"
          width={300}
          closable={false}
          onClose={onAnchorClick}
          open={showSideNav}
        >
          <div className={styles.menuDrawer}>
            {items &&
              items.map((item, i) => {
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
      <Link href={"/"} className={styles.platformNameLogo}>
        <Flex align="center" gap={5}>
          <Image src={`${brand.logo}`} height={40} width={40} alt={"logo"} loading="lazy" />
          <h4 className="font-brand">{brand.name}</h4>
        </Flex>
      </Link>
      <div role="button" className={styles.hamburger} aria-label="Toggle menu">
        <Hamburger
          rounded
          direction="left"
          toggled={showSideNav}
          onToggle={(toggle: boolean | ((prevState: boolean) => boolean)) => {
            setSideNav(toggle);
          }}
        />
      </div>
    </>
  );
};

export default MobileNav;
