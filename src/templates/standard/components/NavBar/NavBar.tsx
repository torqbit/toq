import { FC, ReactElement } from "react";
import { Flex } from "antd";
import Link from "next/link";
import { INavBarProps } from "@/types/landing/navbar";
import styles from "./NavBar.module.scss";
import MobileNav from "./SideNavBar";

const NavBar: FC<INavBarProps> = ({
  user,
  items,
  brand,
  showThemeSwitch,
  activeTheme,
  isMobile,
  defaultNavlink,
  homeLink,
  previewMode,
  extraContent,
  navBarWidth,
}): ReactElement => {
  return (
    <section className={styles.navigation_main_container}>
      {isMobile ? (
        <MobileNav
          items={items}
          showThemeSwitch={showThemeSwitch}
          activeTheme={activeTheme}
          brand={brand}
          isMobile={isMobile}
          homeLink={homeLink}
          defaultNavlink={defaultNavlink}
          previewMode={previewMode}
          extraContent={<></>}
          user={user}
        />
      ) : (
        <div className={styles.navBarContainer}>
          <nav style={{ width: navBarWidth ? navBarWidth : "var(--marketing-container-width)" }}>
            <Link href={homeLink} aria-label="Go back to landing page">
              <Flex align="center" gap={5}>
                {typeof brand.logo === "string" && typeof brand.darkLogo === "string" ? (
                  <img
                    src={activeTheme == "dark" ? brand.darkLogo : brand.logo}
                    style={{ width: "auto", height: 30 }}
                    alt={`logo of ${brand.name}`}
                  />
                ) : (
                  brand.logo
                )}
                {!brand.logo && <h1 className="font-brand">{brand.name}</h1>}
              </Flex>
            </Link>
            <div className={styles.link_wrapper}>{extraContent}</div>
          </nav>
        </div>
      )}
    </section>
  );
};

export default NavBar;
