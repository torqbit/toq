import type { GetServerSidePropsContext, NextPage } from "next";
import styles from "@/styles/Dashboard.module.scss";
import React, { FC, useEffect, useState } from "react";
import { Course, Role, StateType, User } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { Spin, message, Flex, Button } from "antd";

import ProgramService from "@/services/ProgramService";

import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import DefaulttHero from "@/components/Marketing/DefaultHero/DefaultHero";
import SvgIcons, { EmptyCourses } from "@/components/SvgIcons";
import { useRouter } from "next/router";
import { getIconTheme } from "@/services/darkThemeConfig";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Theme } from "@/types/theme";
import { ICourseListItem } from "@/types/courses/Course";
import { CoursesListView } from "@/components/Courses/CourseListView/CourseListView";
import { useSession } from "next-auth/react";
import { LoadingOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const CoursesPage: NextPage<{ siteConfig: PageSiteConfig; userRole: Role }> = ({ siteConfig, userRole }) => {
  const [courses, setCourses] = useState<ICourseListItem[]>();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const router = useRouter();
  const { data: user } = useSession();
  const { globalState } = useAppContext();

  useEffect(() => {
    setLoading(true);
    ProgramService.listCoursesViews((response) => {
      if (response.success && response.body) {
        setCourses(response.body);
        setLoading(false);
      } else {
        message.error(response.message);
        setLoading(false);
      }
    });
  }, []);

  const addCourse = () => {
    ProgramService.createDraftCourses(
      undefined,
      (result) => {
        messageApi.success(result.message);
        router.push(`/academy/course//${result.getCourse.courseId}/edit`);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  return (
    <>
      {userRole ? (
        <>
          {userRole === Role.STUDENT ? (
            <MarketingLayout
              mobileHeroMinHeight={60}
              showFooter={!isMobile}
              siteConfig={siteConfig}
              heroSection={
                <>
                  {!isMobile && !loading && courses && (
                    <DefaulttHero title="Courses" description="Expand Your Knowledge with Comprehensive Courses" />
                  )}
                </>
              }
              user={{ ...user?.user, role: Role.STUDENT } as User}
            >
              {contextMessageHolder}
              <Spin spinning={loading || !courses} indicator={<LoadingOutlined spin />} size="large">
                <section>
                  <div className="page__wrapper">
                    <CoursesListView
                      courses={courses || []}
                      loading={loading || !courses}
                      siteConfig={siteConfig}
                      currentTheme={globalState.theme || "light"}
                      handleCourseCreate={addCourse}
                      role={userRole}
                      emptyView={
                        <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />
                      }
                    />
                  </div>
                </section>
              </Spin>
            </MarketingLayout>
          ) : (
            <AppLayout siteConfig={siteConfig}>
              {contextMessageHolder}
              <section>
                <CoursesListView
                  loading={loading || !courses}
                  courses={courses || []}
                  siteConfig={siteConfig}
                  currentTheme={globalState.theme || "light"}
                  handleCourseCreate={addCourse}
                  role={userRole}
                  emptyView={
                    <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />
                  }
                />
              </section>
            </AppLayout>
          )}
        </>
      ) : (
        <>
          <MarketingLayout
            siteConfig={siteConfig}
            heroSection={
              <DefaulttHero title="Courses" description="Expand Your Knowledge with Comprehensive Courses" />
            }
          >
            {contextMessageHolder}
            <Spin spinning={loading || !courses} indicator={<LoadingOutlined spin />} size="large">
              <section>
                <div className="page__wrapper">
                  <CoursesListView
                    courses={courses || []}
                    loading={loading || !courses}
                    siteConfig={siteConfig}
                    currentTheme={globalState.theme || "light"}
                    handleCourseCreate={addCourse}
                    emptyView={
                      <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />
                    }
                  />
                </div>
              </section>
            </Spin>
          </MarketingLayout>
        </>
      )}
    </>
  );
};

export default CoursesPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  if (user) {
    if (user.role == Role.ADMIN || user.role == Role.AUTHOR) {
      return {
        redirect: {
          permanent: false,
          destination: "/academy",
        },
      };
    }
    return {
      props: {
        siteConfig: site,
        userRole: user?.role,
      },
    };
  } else {
    return {
      props: {
        siteConfig: site,
      },
    };
  }
};
