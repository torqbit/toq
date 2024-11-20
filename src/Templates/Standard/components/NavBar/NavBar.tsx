import { FC, ReactElement } from "react";
import Image from "next/image";
import { Button, Flex } from "antd";
import Link from "next/link";
import { INavBarProps } from "@/types/landing/navbar";
import styles from "./NavBar.module.scss";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";
import MobileNav from "./SideNavBar";

const NavBar: FC<INavBarProps> = ({ user, items, brand, showThemeSwitch, activeTheme, isMobile }): ReactElement => {
  return (
    <section className={styles.navigation_main_container}>
      {isMobile ? (
        <MobileNav
          items={items}
          showThemeSwitch={showThemeSwitch}
          activeTheme={activeTheme}
          brand={brand}
          isMobile={isMobile}
        />
      ) : (
        <div className={styles.navBarContainer}>
          <nav>
            <Link href={"/"} aria-label="Go back to landing page">
              <Flex align="center" gap={5}>
                {typeof brand.logo === "string" ? (
                  <Image src={brand.logo} height={40} width={40} alt={"logo"} />
                ) : (
                  brand.logo
                )}
                <h1 className="font-brand">{brand.name}</h1>
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
                {showThemeSwitch && <ThemeSwitch activeTheme={activeTheme} />}

                <Link href={user ? `/dashboard` : `/login`} aria-label="Get started">
                  <Button type="primary">{user ? "Go to Dashboard" : "Get Started"}</Button>
                </Link>
              </Flex>
            </div>
          </nav>
        </div>
      )}
    </section>
  );
};

export default NavBar;
