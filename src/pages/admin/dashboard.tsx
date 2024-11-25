import React from "react";
import styles from "@/styles/Dashboard.module.scss";

import Layout2 from "@/components/Layouts/Layout2";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
  return (
    <Layout2>
      <section className={styles.dashboard_content}>
        <h3>Dashboard</h3>
      </section>
    </Layout2>
  );
};

export default Dashboard;
