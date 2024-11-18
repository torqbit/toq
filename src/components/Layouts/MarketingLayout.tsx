import { FC, useEffect } from "react";
import React from "react";
import styles from "@/components/Marketing/LandingPage/Hero/Hero.module.scss";
import landingPage from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import Head from "next/head";
import { useAppContext } from "../ContextApi/AppContext";
import { ConfigProvider } from "antd";
import darkThemConfig from "@/services/darkThemConfig";
import antThemeConfig from "@/services/antThemeConfig";
import SpinLoader from "../SpinLoader/SpinLoader";
import Footer from "../Marketing/LandingPage/Footer/Footer";
import { useThemeConfig } from "../ContextApi/ThemeConfigContext";
import { DEFAULT_THEME, PageThemeConfig } from "@/services/themeConstant";
import { onChangeTheme } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";
import { Theme, User } from "@prisma/client";
import { IBrandInfo } from "@/types/landing/navbar";

const MarketingLayout: FC<{
  children?: React.ReactNode;
  heroSection?: React.ReactNode;
  themeConfig: PageThemeConfig;
  user?: User;
}> = ({ children, heroSection, user, themeConfig }) => {
  const { navBar } = useThemeConfig();
  const { globalState, dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const { brand } = useThemeConfig();
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${brand?.brandColor}`);
  }, []);

  useEffect(() => {
    onChangeTheme(dispatch, themeConfig.darkMode);
  }, []);

  const NavBarComponent = navBar?.component ? navBar.component : null;
  let brandInfo: IBrandInfo = {
    logo: themeConfig.brand?.logo ?? DEFAULT_THEME.brand.logo,
    name: themeConfig.brand?.name ?? DEFAULT_THEME.brand.name,
  };

  return (
    <>
      {
        <div
          style={{
            position: "fixed",
            display: globalState.pageLoading || !themeConfig.brand?.title ? "unset" : "none",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            background: "#fff",
            zIndex: 10,
          }}>
          <SpinLoader className='marketing__spinner' />
        </div>
      }
      <ConfigProvider theme={globalState.theme == "dark" ? darkThemConfig() : antThemeConfig()}>
        <Head>
          <title>{`${themeConfig.brand?.title} | ${themeConfig.brand?.name}`}</title>
          <meta name="description" content={themeConfig.brand?.description} />
          <meta property="og:image" content={themeConfig.brand?.ogImage} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="icon" href={themeConfig.brand?.favicon} />
        </Head>

        <section className={styles.heroWrapper}>
          {NavBarComponent && (
            <NavBarComponent
              user={user}
              isMobile={isMobile}
              items={themeConfig.navBar?.navigationLinks ?? []}
              showThemeSwitch={themeConfig.darkMode ?? DEFAULT_THEME.darkMode}
              activeTheme={globalState.theme ?? Theme.light}
              brand={brandInfo}
            />
          )}

          {heroSection}
        </section>
        <div className={landingPage.children_wrapper}>{children}</div>
        <Footer themeConfig={themeConfig} isMobile={isMobile} />
      </ConfigProvider>
    </>
  );
};

export default MarketingLayout;
