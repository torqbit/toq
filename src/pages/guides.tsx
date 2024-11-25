import React from "react";
import styles from "@/styles/Dashboard.module.scss";

import { useSession } from "next-auth/react";
import { Space, Tag } from "antd";
import AppLayout from "@/components/Layouts/AppLayout";

const GuidesPage = () => {
  const { data: user } = useSession();

  return (
    <AppLayout>
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
