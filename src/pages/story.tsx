import React, { FC } from "react";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import HeroBlog from "@/components/Marketing/Blog/DefaultHero";
import { useMediaQuery } from "react-responsive";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import { PageThemeConfig } from "@/services/themeConstant";
import { useAppContext } from "@/components/ContextApi/AppContext";

const StoryPage: FC<{ user: User; themeConfig: PageThemeConfig }> = ({ user, themeConfig }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const { globalState } = useAppContext();

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
