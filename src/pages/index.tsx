import React, { FC } from "react";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { PageSiteConfig } from "@/services/siteConstant";

import StandardTemplate from "@/Templates/Standard/StandardTemplate";
import { getSiteConfig } from "@/services/getSiteConfig";

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
  const { site } = getSiteConfig();
  const siteConfig = site;

  return {
    props: {
      user,
      siteConfig,
    },
  };
};
export default LandingPage;
