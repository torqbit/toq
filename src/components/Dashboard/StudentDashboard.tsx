import { Button, Flex, List, Space, Tabs, TabsProps } from "antd";
import { FC } from "react";
import { useAppContext } from "../ContextApi/AppContext";
import { useRouter } from "next/router";
import SvgIcons, { EmptyCourses } from "../SvgIcons";
import Link from "next/link";

import styles from "@/styles/Dashboard.module.scss";
import { getIconTheme } from "@/services/darkThemeConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const EnrolledCourseList: FC<{
  courseData: { courseName: string; progress: string; courseId: number; slug: string }[];
}> = ({ courseData }) => {
  return (
    <>
      <List
        size="small"
        header={false}
        footer={false}
        bordered={false}
        dataSource={courseData}
        className={styles.enrolled_course_list}
        renderItem={(item) => (
          <Link href={`/courses/${item.slug}`}>
            <List.Item className={styles.enroll_course_item}>
              <div>{item.courseName}</div>
              <Space className={styles.completed_course} size={5}>
                <span>{item.progress}</span> <span>Completed</span>
              </Space>
            </List.Item>
          </Link>
        )}
      />
    </>
  );
};

const StudentDashboard: FC<{
  siteConfig: PageSiteConfig;
  allRegisterCourse: { courseName: string; progress: string; courseId: number; slug: string }[];
  pageLoading: boolean;
}> = ({ siteConfig, allRegisterCourse, pageLoading }) => {
  const { globalState } = useAppContext();

  const router = useRouter();
  const onChange = (key: string) => {};

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Enrolled Courses",
      className: "some-class",
      icon: SvgIcons.courses,
      children: <EnrolledCourseList courseData={allRegisterCourse} />,
    },
  ];

  return (
    <section>
      {allRegisterCourse.length > 0 ? (
        <>
          <Tabs defaultActiveKey="1" className="content_tab" items={items} onChange={onChange} />
        </>
      ) : (
        <>
          {!pageLoading && (
            <div className={styles.no_course_found}>
              <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />
              <h4 style={{ marginBottom: 20 }}>You have not enrolled in any courses</h4>
              {allRegisterCourse.length === 0 && (
                <Button
                  onClick={() => {
                    router.push(`/courses`);
                  }}
                  type="primary"
                >
                  <Flex align="center" gap={10}>
                    <span>Browse Courses</span>
                    <i style={{ lineHeight: 0 }}>{SvgIcons.arrowRight}</i>
                  </Flex>
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default StudentDashboard;
