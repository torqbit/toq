import { FC, useEffect, useState } from "react";
import React from "react";
import styles from "@/components/Marketing/LandingPage/Hero/Hero.module.scss";
import Head from "next/head";
import { useAppContext } from "../ContextApi/AppContext";
import { ConfigProvider, Flex } from "antd";
import Link from "next/link";
import darkThemConfig from "@/services/darkThemConfig";
import antThemeConfig from "@/services/antThemeConfig";
import SpinLoader from "../SpinLoader/SpinLoader";
import SideNav from "../Marketing/LandingPage/NavBar/SideNavBar";
import NavBar from "../Marketing/LandingPage/NavBar/NavBar";
import Image from "next/image";
import Hamburger from "hamburger-react";
import Footer from "../Marketing/LandingPage/Footer";
import config from "../../theme.config";

import { User } from "@prisma/client";
import { ThemeConfigProvider, useThemeConfig } from "../ContextApi/ThemeConfigContext";

const MarketingLayout: FC<{
  children?: React.ReactNode;
  className?: string;
  heroSection?: React.ReactNode;
  user?: User;
  courseTitle: string;
  description?: string;
  thumbnail?: string;
  offlineCourse?: boolean;
}> = ({ children, className, heroSection, offlineCourse, user, courseTitle, description, thumbnail }) => {
  const { globalState } = useAppContext();
  const themeConfig = useThemeConfig();

  const [showSideNav, setSideNav] = useState(false);

  const onAnchorClick = () => {
    setSideNav(false);
  };

  useEffect(() => {
    document.title = courseTitle;
  }, [courseTitle]);

  let contentDescription = description ? description : "Learn, build and solve the problems that matters the most";
  let ogImage = thumbnail ? thumbnail : "https://torqbit-dev.b-cdn.net/website/img/torqbit-landing.png";
  const customeConfig = { ...themeConfig, ...config };

  return (
    <>
      {
        <div
          style={{
            position: "fixed",
            display: globalState.pageLoading || !courseTitle ? "unset" : "none",
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

      {/* <ConfigProvider theme={globalState.theme == "dark" ? darkThemConfig : antThemeConfig}> */}
      <ThemeConfigProvider value={config}>
        <Head>
          <title>{courseTitle}</title>
          <meta name='description' content={contentDescription} />
          <meta property='og:image' content={ogImage} />
          <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />

          <link rel='icon' href='/favicon.ico' />
        </Head>

        <section className={styles.heroWrapper}>
          <NavBar user={user} items={customeConfig.navBar?.navigationLinks ? customeConfig.navBar.navigationLinks : []} />
          <SideNav
            isOpen={showSideNav}
            onAnchorClick={onAnchorClick}
            items={customeConfig.navBar?.navigationLinks ? customeConfig.navBar.navigationLinks : []}
          />
          <Link href={"/"} className={styles.platformNameLogo}>
            <Flex align='center' gap={5}>
              <Image src={`${themeConfig.brand?.logo}`} height={40} width={40} alt={"logo"} loading='lazy' />
              <h4 className='font-brand'>{themeConfig.brand?.name?.toUpperCase()}</h4>
            </Flex>
          </Link>

          <div role='button' className={styles.hamburger} aria-label='Toggle menu'>
            <Hamburger
              rounded
              direction='left'
              toggled={showSideNav}
              onToggle={(toggle: boolean | ((prevState: boolean) => boolean)) => {
                setSideNav(toggle);
              }}
            />
          </div>
          {heroSection}
        </section>
        <div className={styles.children_wrapper}>{children}</div>
        <Footer />
      </ThemeConfigProvider>
      {/* </ConfigProvider> */}
    </>
  );
};

export default MarketingLayout;
