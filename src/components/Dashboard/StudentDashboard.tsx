import { Button, Flex, List, message, Segmented, Skeleton, Space, Spin, Tabs, TabsProps } from "antd";
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
import Academy from "../Academy/Academy";
import { ILearningPathDetail } from "@/types/learingPath";
import { ICourseListItem, IRegisteredCoursesList } from "@/types/courses/Course";

export const EnrolledCourseProgressList: FC<{
  courseData: { courseName: string; progress: string; isExpired: boolean; courseId: number; slug: string }[];
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
        renderItem={(item, i) => (
          <Link href={`/courses/${item.slug}`} key={i}>
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
  pathList: ILearningPathDetail[];
  coursesList: ICourseListItem[];
  userRole: Role;
}> = ({ siteConfig, userRole, pathList, coursesList }) => {
  const { globalState } = useAppContext();

  const router = useRouter();

  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedSegment, setSelectedSegment] = useState<string>("active");
  const [allRegisterCourse, setAllRegisterCourse] = useState<IRegisteredCoursesList[]>();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const getProgress = () => {
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
  };

  useEffect(() => {
    if (userRole == Role.STUDENT) {
      getProgress();
    }
  }, [userRole]);

  const onChange = (key: string) => {};

  const getSegmentOption = (allRegisterCourse: IRegisteredCoursesList[]) => {
    let expired = allRegisterCourse && allRegisterCourse.filter((cp) => cp.isExpired).length;
    let completed = allRegisterCourse && allRegisterCourse.filter((cp) => cp.progress == "100%").length;
    if (expired > 0 && completed > 0) {
      return [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Completed",
          value: "completed",
        },
        {
          label: "Expired",
          value: "expired",
        },
      ];
    } else if (expired > 0 && completed == 0) {
      return [
        {
          label: "Active",
          value: "active",
        },

        {
          label: "Expired",
          value: "expired",
        },
      ];
    } else if (expired == 0 && completed > 0) {
      return [
        {
          label: "Active",
          value: "active",
        },

        {
          label: "Completed",
          value: "completed",
        },
      ];
    } else {
      return [];
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "student",
      label: "My Learnings",
      className: "some-class",

      children:
        !pageLoading && allRegisterCourse ? (
          <>
            {getSegmentOption(allRegisterCourse).length > 0 && (
              <Segmented
                style={{ marginBottom: 10 }}
                onChange={(value) => {
                  setSelectedSegment(value);
                }}
                options={getSegmentOption(allRegisterCourse)}
              />
            )}
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
                {selectedSegment === "active" && (
                  <EnrolledCourseProgressList
                    courseData={allRegisterCourse.filter((cp) => !cp.isExpired && cp.progress !== "100%")}
                  />
                )}

                {selectedSegment === "expired" && (
                  <EnrolledCourseProgressList courseData={allRegisterCourse.filter((cp) => cp.isExpired)} />
                )}
                {selectedSegment === "completed" && (
                  <EnrolledCourseProgressList courseData={allRegisterCourse.filter((cp) => cp.progress == "100%")} />
                )}
              </>
            )}
          </>
        ) : (
          <Flex gap={5} vertical>
            {getDummyArray(5).map((t, i) => {
              return <Skeleton.Input key={i} style={{ width: "100%" }} />;
            })}
          </Flex>
        ),
    },
  ];

  return (
    <section>
      <Spin spinning={pageLoading} indicator={<LoadingOutlined spin />} size="large">
        {contextHolder}
        <Academy
          studentView
          studentItems={items}
          siteConfig={siteConfig}
          userRole={userRole}
          pathList={pathList}
          coursesList={coursesList}
          getProgress={getProgress}
        />
      </Spin>
    </section>
  );
};

export default StudentDashboard;
