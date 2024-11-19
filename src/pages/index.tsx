import React, { FC } from "react";

import Hero from "@/components/Marketing/LandingPage/Hero/Hero";
import { User } from "@prisma/client";

import { useMediaQuery } from "react-responsive";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { GetServerSidePropsContext } from "next";
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
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <MarketingLayout
      user={user}
      themeConfig={themeConfig}
      heroSection={<Hero themeConfig={themeConfig} isMobile={isMobile} user={user} />}
    >
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
