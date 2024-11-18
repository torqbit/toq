import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";

import Hero from "@/components/Marketing/LandingPage/Hero/Hero";
import { Theme, User } from "@prisma/client";

import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

import { PageThemeConfig } from "@/services/themeConstant";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import SetupPlatform from "@/components/Marketing/LandingPage/Setup/SetupPlatform";
interface IProps {
  user: User;
  themeConfig: PageThemeConfig;
}

const LandingPage: FC<IProps> = ({ user, themeConfig }) => {
  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme || currentTheme === "dark") {
      localStorage.setItem("theme", "dark");
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "light");
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);

    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  useEffect(() => {
    onCheckTheme();
  }, []);

  console.log(globalState.pageLoading);

  return (
    <MarketingLayout user={user} themeConfig={themeConfig} heroSection={<Hero isMobile={isMobile} user={user} />}>
      <SetupPlatform />
    </MarketingLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const themeConfig = useThemeConfig();

  return {
    props: {
      user,
      themeConfig: {
        ...themeConfig,
        navBar: {
          ...themeConfig.navBar,
          component: themeConfig.navBar?.component?.name || null,
        },
      },
    },
  };
};
export default LandingPage;
