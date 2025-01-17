import { Button, Flex, List, message, Skeleton, Space, Spin, Tabs, TabsProps } from "antd";
import { FC, useEffect, useState } from "react";
import { useAppContext } from "../ContextApi/AppContext";
import { useRouter } from "next/router";
import SvgIcons, { EmptyCourses } from "../SvgIcons";
import Link from "next/link";

import styles from "@/styles/Dashboard.module.scss";
import { getIconTheme } from "@/services/darkThemeConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { Role } from "@prisma/client";
import ProgramService from "@/services/ProgramService";
import { LoadingOutlined } from "@ant-design/icons";
import { getDummyArray } from "@/lib/dummyData";
import { useMediaQuery } from "react-responsive";

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
  userRole: Role;
}> = ({ siteConfig, userRole }) => {
  const { globalState } = useAppContext();

  const router = useRouter();

  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [allRegisterCourse, setAllRegisterCourse] =
    useState<{ courseName: string; progress: string; courseId: number; slug: string }[]>();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  useEffect(() => {
    if (userRole == Role.STUDENT) {
      setPageLoading(true);
      ProgramService.getRegisterCourses(
        (result) => {
          setAllRegisterCourse(result.progress);
          setPageLoading(false);
        },
        (error) => {
          messageApi.error(error);
          setPageLoading(false);
        }
      );
    }
  }, [userRole]);

  const onChange = (key: string) => {};

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "My Learnings",
      className: "some-class",
      icon: <i style={{ fontSize: 18, color: "var(--font-primary)" }}>{SvgIcons.courses}</i>,
      children:
        !pageLoading && allRegisterCourse ? (
          <EnrolledCourseList courseData={allRegisterCourse} />
        ) : (
          <Flex gap={5} vertical>
            {getDummyArray(5).map((t) => {
              return <Skeleton.Input style={{ width: "100%" }} />;
            })}
          </Flex>
        ),
    },
  ];

  return (
    <section>
      <Spin spinning={pageLoading} indicator={<LoadingOutlined spin />} size="large">
        {contextHolder}
        <>
          {allRegisterCourse && allRegisterCourse.length === 0 ? (
            <>
              <div className={styles.no_course_found}>
                <EmptyCourses
                  size={isMobile ? "200px" : "300px"}
                  {...getIconTheme(globalState.theme || "light", siteConfig.brand)}
                />
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
                      <i style={{ fontSize: 18, lineHeight: 0 }}> {SvgIcons.arrowRight}</i>
                    </Flex>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <Tabs
                defaultActiveKey="1"
                className="content_tab"
                items={items}
                onChange={onChange}
                style={{ padding: isMobile ? "0 20px" : "inherit" }}
              />
            </>
          )}
        </>
      </Spin>
    </section>
  );
};

export default StudentDashboard;
