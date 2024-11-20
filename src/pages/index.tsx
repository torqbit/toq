import React, { FC } from "react";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { PageSiteConfig } from "@/services/siteConstant";
import { useSiteConfig } from "@/components/ContextApi/SiteConfigContext";
import StandardTemplate from "@/Templates/Standard/StandardTemplate";

interface IProps {
  user: User;
  siteConfig: PageSiteConfig;
}

const LandingPage: FC<IProps> = ({ user, siteConfig }) => {
  return <StandardTemplate user={user} siteConfig={siteConfig} />;
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
