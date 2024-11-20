import React, { FC } from "react";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import HeroBlog from "@/components/Marketing/DefaultHero/DefaultHero";
import { useMediaQuery } from "react-responsive";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { PageSiteConfig } from "@/services/siteConstant";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { getSiteConfig } from "@/services/getSiteConfig";

const StoryPage: FC<{ user: User; siteConfig: PageSiteConfig }> = ({ user, siteConfig }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const { globalState } = useAppContext();

  return (
    <MarketingLayout
      siteConfig={siteConfig}
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
  const { site } = getSiteConfig();
  const siteConfig = site;

  return {
    props: {
      user,
      siteConfig,
    },
  };
};
