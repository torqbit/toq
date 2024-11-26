import React, { FC, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { List, Space, Spin, Tabs, TabsProps } from "antd";
import SvgIcons from "@/components/SvgIcons";
import ProgramService from "@/services/ProgramService";
import Link from "next/link";
import { GetServerSidePropsContext, NextPage } from "next";

import SpinLoader from "@/components/SpinLoader/SpinLoader";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const EnrolledCourseList: FC<{
  courseData: { courseName: string; progress: string; courseId: number }[];
  pageLoading: boolean;
}> = ({ courseData, pageLoading }) => {
  return (
    <>
      {pageLoading ? (
        <>
          <SpinLoader />
        </>
      ) : (
        <List
          size="small"
          header={false}
          footer={false}
          bordered={false}
          dataSource={courseData}
          className={styles.enrolled_course_list}
          renderItem={(item) => (
            <Link href={`/courses/${item.courseId}`}>
              <List.Item className={styles.enroll_course_item}>
                <div>{item.courseName}</div>
                <Space className={styles.completed_course} size={5}>
                  <span>{item.progress}</span> <span>Completed</span>
                </Space>
              </List.Item>
            </Link>
          )}
        />
      )}
    </>
  );
};

const Dashboard: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { data: user } = useSession();
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const [allRegisterCourse, setAllRegisterCourse] = useState<
    { courseName: string; progress: string; courseId: number }[]
  >([]);

  const onChange = (key: string) => {};

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Enrolled Courses",
      className: "some-class",
      icon: SvgIcons.courses,
      children: <EnrolledCourseList courseData={allRegisterCourse} pageLoading={pageLoading} />,
    },
  ];
  useEffect(() => {
    setPageLoading(true);
    ProgramService.getRegisterCourses(
      (result) => {
        setAllRegisterCourse(result.progress);
        setPageLoading(false);
      },
      (error) => {
        setPageLoading(false);
      }
    );
  }, []);

  return (
    <AppLayout siteConfig={siteConfig}>
      <section className={styles.dashboard_content}>
        <h3>Dashboard</h3>

        <Tabs defaultActiveKey="1" className="content_tab" items={items} onChange={onChange} />
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
