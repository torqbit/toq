import type { GetServerSidePropsContext, NextPage } from "next";
import styles from "@/styles/Dashboard.module.scss";
import React, { FC, useEffect, useState } from "react";
import { Course, Role } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { Spin, message, Flex, Button } from "antd";

import ProgramService from "@/services/ProgramService";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
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

const CoursesView: FC<{
  courses: Course[];
  role: Role;
  siteConfig: PageSiteConfig;
  currentTheme: Theme;
  handleCourseCreate: () => void;
}> = ({ courses, role, currentTheme, siteConfig, handleCourseCreate }) => {
  return (
    <>
      {courses.filter((c) => c.state === "ACTIVE").length > 0 ? (
        <Courses allCourses={courses.filter((c) => c.state === "ACTIVE")} userRole={role} />
      ) : (
        <>
          <div className={styles.no_course_found}>
            <EmptyCourses size="300px" {...getIconTheme(currentTheme, siteConfig.brand)} />
            <h4 style={{ marginBottom: 20 }}>No Courses were found</h4>
            {role === Role.ADMIN && courses.length === 0 && (
              <Button onClick={handleCourseCreate} type="primary">
                <Flex align="center" gap={10}>
                  <span>Add Course</span>
                  <i style={{ lineHeight: 0 }}>{SvgIcons.arrowRight}</i>
                </Flex>
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

const CoursesPage: NextPage<{ siteConfig: PageSiteConfig; userRole: Role }> = ({ siteConfig, userRole }) => {
  const [allCourses, setAllCourses] = useState<Course[] | undefined>([]);
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { globalState } = useAppContext();

  useEffect(() => {
    setLoading(true);
    ProgramService.getCoursesByAuthor(
      true,
      (res) => {
        setAllCourses(res.courses);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        messageApi.error(`Unable to get the courses due to ${err}`);
      }
    );
  }, []);

  const addCourse = () => {
    ProgramService.createDraftCourses(
      undefined,
      (result) => {
        messageApi.success(result.message);
        router.push(`/admin/content/course/${result.getCourse.courseId}/edit`);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  return (
    <>
      {userRole ? (
        <AppLayout siteConfig={siteConfig}>
          {contextMessageHolder}
          <section>
            <Flex align="center" justify="space-between" className={styles.courseContainer}>
              <h3>Courses</h3>
              {userRole === Role.ADMIN && allCourses && allCourses.length > 0 && (
                <Button onClick={addCourse} type="primary">
                  <Flex align="center" gap={10}>
                    <span>Add Course</span>
                    <i style={{ lineHeight: 0 }}>{SvgIcons.arrowRight}</i>
                  </Flex>
                </Button>
              )}
            </Flex>
            {!loading && allCourses ? (
              <CoursesView
                courses={allCourses}
                role={userRole}
                currentTheme={globalState.theme || "light"}
                handleCourseCreate={addCourse}
                siteConfig={siteConfig}
              />
            ) : (
              <SpinLoader className="course__spinner" />
            )}
          </section>
        </AppLayout>
      ) : (
        <MarketingLayout
          siteConfig={siteConfig}
          heroSection={<DefaulttHero title="Courses" description="Expand Your Knowledge with Comprehensive Courses" />}
        >
          {contextMessageHolder}
          <section>
            {!loading && allCourses ? (
              <CoursesView
                courses={allCourses}
                role={userRole}
                currentTheme={globalState.theme || "light"}
                handleCourseCreate={addCourse}
                siteConfig={siteConfig}
              />
            ) : (
              <SpinLoader className="course__spinner" />
            )}
          </section>
        </MarketingLayout>
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
