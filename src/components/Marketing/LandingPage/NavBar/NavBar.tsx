import { FC, ReactElement, useState } from "react";
import Image from "next/image";
import { Button, Flex } from "antd";
import Link from "next/link";
import { INavBarProps } from "@/types/courses/navbar";
import styles from "./NavBar.module.scss";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";
import SideNav from "./SideNavBar";
import Hamburger from "hamburger-react";

const NavBar: FC<INavBarProps> = ({ user, items, brand, showThemeSwitch, activeTheme, isMobile }): ReactElement => {
  const [showSideNav, setSideNav] = useState(false);

  const onAnchorClick = () => {
    setSideNav(false);
  };
  return (
    <>
      <div className={styles.navBarContainer}>
        <nav>
          <Link href={"/"} aria-label="Go back to landing page">
            <Flex align="center" gap={5}>
              {typeof brand?.logo === "string" ? (
                <Image src={brand.logo} height={40} width={40} alt={"logo"} />
              ) : (
                brand?.logo
              )}
              <h1 className="font-brand">{brand?.name?.toUpperCase()}</h1>
            </Flex>
          </Link>
          <div className={styles.link_wrapper}>
            {items.length === 0 ? (
              <div></div>
            ) : (
              <ul>
                {items.map((navigation, i) => {
                  return (
                    <li key={i}>
                      <Link href={navigation.link} aria-label={`link to ${navigation.title} page`}>
                        {navigation.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <Flex align="center" gap={20}>
              {showThemeSwitch && activeTheme && <ThemeSwitch activeTheme={activeTheme} />}

              <Link href={user ? `/dashboard` : `/login`} aria-label="Get started">
                <Button type="primary">{user ? "Go to Dashboard" : "Get Started"}</Button>
              </Link>
            </Flex>
          </div>
        </nav>
      </div>
      {isMobile && (
        <>
          <SideNav
            isOpen={showSideNav}
            onAnchorClick={onAnchorClick}
            items={items}
            showThemeSwitch={showThemeSwitch}
            activeTheme={activeTheme}
            brand={brand}
          />
          <Link href={"/"} className={styles.platformNameLogo}>
            <Flex align="center" gap={5}>
              <Image src={`${brand?.logo}`} height={40} width={40} alt={"logo"} loading="lazy" />
              <h4 className="font-brand">{brand?.name?.toUpperCase()}</h4>
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
      )}
    </>
  );
};

export default NavBar;
