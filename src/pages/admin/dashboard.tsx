import React from "react";
import styles from "@/styles/Dashboard.module.scss";

import { GetServerSidePropsContext, NextPage } from "next";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const Dashboard: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <AppLayout siteConfig={siteConfig}>
      <section className={styles.dashboard_content}>
        <h3>Dashboard</h3>
      </section>
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
