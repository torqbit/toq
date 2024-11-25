import React from "react";
import styles from "@/styles/Dashboard.module.scss";

import { useSession } from "next-auth/react";
import { Space, Tag } from "antd";
import AppLayout from "@/components/Layouts/AppLayout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const GuidesPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { data: user } = useSession();

  return (
    <AppLayout siteConfig={siteConfig}>
      <section className={styles.dashboard_content}>
        <div className={styles.guide_wrapper}>
          <Space style={{ marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Guides</h3>
            <Tag>Coming Soon</Tag>
          </Space>

          <p className={styles.guide_wrapper}>A collection of articles, guides and tutorials for the reading minds.</p>
          <img height={400} src="/img/guides/guide-illustration.svg" alt="" style={{ display: "block" }} />
        </div>
      </section>
    </AppLayout>
  );
};

export default GuidesPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
