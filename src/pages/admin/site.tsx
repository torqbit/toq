import React from "react";

import { GetServerSidePropsContext, NextPage } from "next";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const SiteDesignPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <AppLayout siteConfig={siteConfig}>
      <div style={{ padding: "20px 40px 0px 40px" }}>
        <h3>Site Design</h3>
      </div>
    </AppLayout>
  );
};

export default SiteDesignPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
