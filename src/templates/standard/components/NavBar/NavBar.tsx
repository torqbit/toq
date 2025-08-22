import { FC, ReactElement } from "react";
import { Flex } from "antd";
import Link from "next/link";
import { INavBarProps } from "@/types/landing/navbar";
import styles from "./NavBar.module.scss";
import MobileNav from "./SideNavBar";
import DOMPurify from "isomorphic-dompurify";
import { DEFAULT_THEME } from "@/services/siteConstant";
import { useAppContext } from "@/components/ContextApi/AppContext";
import Image from "next/image";

const NavBar: FC<INavBarProps> = ({
  user,
  items,
  brand,
  showThemeSwitch,
  activeTheme,
  isMobile,
  siteConfig,
  defaultNavlink,
  homeLink,
  previewMode,
  extraContent,
  navBarWidth,
}): ReactElement => {
  const { globalState } = useAppContext();
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
          siteConfig={siteConfig}
          user={user}
        />
      ) : (
        <div className={styles.navBarContainer}>
          <nav style={{ width: navBarWidth ? navBarWidth : "var(--marketing-container-width)" }}>
            <Link href={DOMPurify.sanitize(homeLink)} aria-label="Go back to landing page">
              <Flex align="center" gap={5}>
                {(globalState.theme == "dark" &&
                  brand?.darkLogo == DEFAULT_THEME.brand.darkLogo &&
                  window.location.origin !== process.env.NEXT_PUBLIC_NEXTAUTH_URL) ||
                (globalState.theme == "light" &&
                  brand?.logo == DEFAULT_THEME.brand.logo &&
                  window.location.origin !== process.env.NEXT_PUBLIC_NEXTAUTH_URL) ? (
                  <>
                    <h1 className="font-brand" style={{ marginLeft: 15, width: 300 }}>
                      {brand?.name}
                    </h1>
                  </>
                ) : (
                  <>
                    {typeof brand.logo === "string" && typeof brand.darkLogo === "string" ? (
                      <Image
                        className={styles.logo_img}
                        src={
                          activeTheme == "dark" ? DOMPurify.sanitize(brand.darkLogo) : DOMPurify.sanitize(brand.logo)
                        }
                        height={100}
                        alt={`logo of ${brand.name}`}
                        width={200}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      brand.logo
                    )}
                    {!brand.logo && (
                      <h1 style={{ marginLeft: 15, width: 300 }} className="font-brand">
                        {brand.name}
                      </h1>
                    )}
                  </>
                )}
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
