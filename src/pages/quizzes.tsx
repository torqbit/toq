import React from "react";
import styles from "@/styles/Dashboard.module.scss";

import { useSession } from "next-auth/react";
import { Space, Tag } from "antd";
import AppLayout from "@/components/Layouts/AppLayout";
import { DEFAULT_THEME } from "@/services/siteConstant";

const QuizzesPage = () => {
  const { data: user } = useSession();

  return (
    <AppLayout siteConfig={DEFAULT_THEME}>
      <section className={styles.dashboard_content}>
        <div className={styles.guide_wrapper}>
          <Space style={{ marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Quizzes</h3>
            <Tag>Coming Soon</Tag>
          </Space>
          <p className={styles.guide_wrapper}>Attempt the interactive quizzes to check your skills level.</p>
          <img height={400} src="/img/quiz/quiz-illustration.svg" alt="" style={{ display: "block" }} />
        </div>
      </section>
    </AppLayout>
  );
};

export default QuizzesPage;
