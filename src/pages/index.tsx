import React, { FC } from "react";

import Hero from "@/components/Marketing/LandingPage/Hero/Hero";
import { User } from "@prisma/client";

import { useMediaQuery } from "react-responsive";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { GetServerSidePropsContext } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { useSiteConfig } from "@/components/ContextApi/SiteConfigContext";
import SetupPlatform from "@/components/Marketing/LandingPage/Setup/SetupPlatform";
import Feature from "@/components/Marketing/LandingPage/Feature/Feature";
import { IFeatureCard } from "@/types/landing/feature";
interface IProps {
  user: User;
  siteConfig: PageSiteConfig;
}

const LandingPage: FC<IProps> = ({ user, siteConfig }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const { sections } = useSiteConfig();
  let featureInfo = siteConfig?.sections?.feature?.featureInfo ?? DEFAULT_THEME.sections.feature.featureInfo;
  let FeatureComponent = sections?.feature?.component ?? DEFAULT_THEME.sections.feature.component;

  return (
    <MarketingLayout
      user={user}
      siteConfig={siteConfig}
      heroSection={<Hero siteConfig={siteConfig} isMobile={isMobile} user={user} />}
    >
      <SetupPlatform />
      <FeatureComponent
        title={featureInfo?.title}
        description={featureInfo?.description}
        featureList={featureInfo?.featureList}
      />
    </MarketingLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const siteConfig = useSiteConfig();

  return {
    props: {
      user,
      siteConfig: {
        ...siteConfig,
        navBar: {
          ...siteConfig.navBar,
          component: siteConfig.navBar?.component?.name || null,
        },
        sections: {
          ...siteConfig.sections,
          feature: {
            ...siteConfig.sections.feature,
            component: siteConfig.sections.feature?.component?.name || null,
          },
        },
      },
    },
  };
};
export default LandingPage;
