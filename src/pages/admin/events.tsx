import React from "react";

import { GetServerSidePropsContext, NextPage } from "next";
import EventList from "@/components/Events/EventList";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const Dashboard: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <AppLayout siteConfig={siteConfig}>
      <div style={{ padding: "20px 40px 0px 40px" }}>
        <h3>Events</h3>
        <EventList />
      </div>
    </AppLayout>
  );
};

export default Dashboard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
