import { FC, ReactNode, useEffect, useState } from "react";
import React from "react";
import styles from "@/templates/standard/components/Hero/Hero.module.scss";
import landingPage from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import Head from "next/head";
import { useAppContext } from "../ContextApi/AppContext";
import { ConfigProvider } from "antd";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import SpinLoader from "../SpinLoader/SpinLoader";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { useMediaQuery } from "react-responsive";
import { User } from "@prisma/client";
import { IBrandInfo } from "@/types/landing/navbar";
import { Theme } from "@/types/theme";
import Footer from "@/templates/standard/components/Footer/Footer";
import NavBar from "@/templates/standard/components/NavBar/NavBar";

const MarketingLayout: FC<{
  children?: React.ReactNode;
  heroSection?: React.ReactNode;
  siteConfig: PageSiteConfig;
  user?: User;
}> = ({ children, heroSection, user, siteConfig }) => {
  const { globalState, dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const { brand } = siteConfig;
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${brand?.brandColor}`);
  }, []);

  const NavBarComponent = NavBar;
  let brandInfo: IBrandInfo = {
    logo: siteConfig.brand?.logo ?? DEFAULT_THEME.brand.logo,
    name: siteConfig.brand?.name ?? DEFAULT_THEME.brand.name,
    icon: siteConfig.brand?.icon ?? DEFAULT_THEME.brand.icon,
    darkLogo: siteConfig.brand?.darkLogo || DEFAULT_THEME.brand.darkLogo,
  };

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    if (siteConfig.brand?.themeSwitch) {
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme === "dark") {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    } else {
      if (siteConfig.brand?.defaultTheme) {
        localStorage.setItem("theme", siteConfig.brand?.defaultTheme);
      } else {
        localStorage.setItem("theme", "light");
      }
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);
    dispatch({
      type: "SET_SITE_CONFIG",
      payload: siteConfig,
    });
    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  useEffect(() => {
    onCheckTheme();
  }, [siteConfig.brand?.defaultTheme]);

  return (
    <>
      {
        <div
          style={{
            position: "fixed",
            display: globalState.pageLoading ? "unset" : "none",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            background: "#fff",
            zIndex: 10,
          }}
        >
          <SpinLoader className="marketing__spinner" />
        </div>
      }
      <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
        <Head>
          <title>{`${siteConfig.brand?.name} · ${siteConfig.brand?.title}`}</title>
          <meta name="description" content={siteConfig.brand?.description} />
          <meta property="og:image" content={siteConfig.brand?.ogImage} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="icon" href={siteConfig.brand?.favicon} />
        </Head>

        <section className={styles.heroWrapper}>
          {NavBarComponent && (
            <NavBarComponent
              user={user}
              isMobile={isMobile}
              items={siteConfig.navBar?.links ?? []}
              showThemeSwitch={siteConfig.brand?.themeSwitch ?? DEFAULT_THEME.brand.themeSwitch}
              activeTheme={globalState.theme ?? "light"}
              brand={brandInfo}
            />
          )}

          {heroSection}
        </section>
        <div className={landingPage.children_wrapper}>{children}</div>

        <Footer siteConfig={siteConfig} isMobile={isMobile} activeTheme={globalState.theme ?? "light"} />
      </ConfigProvider>
    </>
  );
};

export default MarketingLayout;
