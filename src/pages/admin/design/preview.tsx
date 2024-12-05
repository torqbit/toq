import { getCookieName } from "@/lib/utils";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import StandardTemplate from "@/templates/standard/StandardTemplate";

import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC, useEffect, useState } from "react";
import { getSiteConfig } from "@/services/getSiteConfig";

const PreviewPage: FC<{ user: User; siteConfig: PageSiteConfig }> = ({ user, siteConfig }) => {
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SITE_CONFIG") {
        console.log("Message from Parent:", event.data.payload);
        setConfig(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return <StandardTemplate user={user} siteConfig={config} previewMode />;
};
export default PreviewPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const { site } = getSiteConfig();
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  return {
    props: {
      user,
      siteConfig: site,
    },
  };
};
