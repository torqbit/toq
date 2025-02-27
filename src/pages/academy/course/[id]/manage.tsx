import { GetServerSidePropsContext, NextPage } from "next";
import styles from "@/styles/Analytics.module.scss";
import { Tabs, TabsProps } from "antd";
import { useState } from "react";
import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import { IContentTabType } from "@/types/courses/Course";
import SubmissionList from "@/components/Assignment/Submissions/SubmissionList";
import ProductManage from "@/components/Manage/ProductManage";
import prisma from "@/lib/prisma";
import EnrolledList from "@/components/Courses/EnrolledList";
const AnalyticsPage: NextPage<{ siteConfig: PageSiteConfig; courseInfo: { name: string; id: number } }> = ({
  siteConfig,
  courseInfo,
}) => {
  const [tab, setTab] = useState("1");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Analytics",
      children: <ProductManage siteConfig={siteConfig} productId={Number(courseInfo.id)} />,
    },
    {
      key: "2",
      label: `Enrollments`,
      children: (
        <>
          <EnrolledList courseId={courseInfo.id} />
        </>
      ),
    },
    {
      key: "SUBMISSIONS" as IContentTabType,
      label: "Submissions",
      children: <SubmissionList courseId={courseInfo.id} />,
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AppLayout siteConfig={siteConfig}>
      <>
        <section className={styles.analyticsContainer}>
          <h3>{courseInfo.name}</h3>
          <Tabs tabBarGutter={40} items={items} activeKey={tab} onChange={(k) => setTab(k)} />
        </section>
      </>
    </AppLayout>
  );
};

export default AnalyticsPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  const { query } = ctx;
  if (query.id) {
    const courseInfo = await prisma.course.findUnique({
      where: {
        courseId: Number(query.id),
      },
      select: {
        name: true,
      },
    });
    return {
      props: {
        siteConfig: site,
        courseInfo: {
          name: courseInfo?.name,
          id: Number(query.id),
        },
      },
    };
  }
  return {
    props: {
      siteConfig: site,
    },
  };
};
