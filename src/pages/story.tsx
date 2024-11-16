import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Theme, User } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import HeroBlog from "@/components/Marketing/Blog/DefaultHero";
import { useMediaQuery } from "react-responsive";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import { PageThemeConfig } from "@/services/themeConstant";

const StoryPage: FC<{ user: User; themeConfig: PageThemeConfig }> = ({ user, themeConfig }) => {
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

  return (
    <MarketingLayout
      themeConfig={themeConfig}
      user={user}
      heroSection={
        <HeroBlog
          title="Story"
          description="Our compelling stories unfold with depth and nuance, offering insights that resonate."
        />
      }
    >
      <div
        style={{
          height: 400,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: globalState.theme === "dark" ? "#283040" : "#fff",
          color: globalState.theme === "dark" ? "#fff" : "#000",
        }}
      >
        <p
          style={{
            maxWidth: isMobile ? 300 : 400,
            lineHeight: 1.5,
          }}
        >
          There are no stories currently. Visit here later again
        </p>
      </div>
    </MarketingLayout>
  );
};

export default StoryPage;

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
          component: themeConfig.navBar?.component?.name as any,
        },
      },
    },
  };
};
