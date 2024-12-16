import type { GetServerSidePropsContext, NextPage } from "next";
import styles from "@/styles/Dashboard.module.scss";
import React, { useEffect, useState } from "react";
import { Course, Role } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { Spin, message, Flex, Button } from "antd";

import ProgramService from "@/services/ProgramService";
import { LoadingOutlined } from "@ant-design/icons";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import DefaulttHero from "@/components/Marketing/DefaultHero/DefaultHero";
import SvgIcons from "@/components/SvgIcons";
import Link from "next/link";
import { useRouter } from "next/router";

const CoursesPage: NextPage<{ siteConfig: PageSiteConfig; userRole: Role }> = ({ siteConfig, userRole }) => {
  const [allCourses, setAllCourses] = useState<Course[] | undefined>([]);
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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
              {userRole !== Role.STUDENT && (
                <Button onClick={addCourse} type="primary">
                  <Flex align="center" gap={10}>
                    {" "}
                    <span>Add Course</span>
                    <i style={{ lineHeight: 0 }}>{SvgIcons.arrowRight}</i>
                  </Flex>
                </Button>
              )}
            </Flex>
            {!loading ? (
              <>
                {allCourses && allCourses.filter((c) => c.state === "ACTIVE").length > 0 ? (
                  <Courses allCourses={allCourses.filter((c) => c.state === "ACTIVE")} userRole={userRole} />
                ) : (
                  <>
                    <div className={styles.no_course_found}>
                      <img src="/img/common/empty.svg" alt="" />
                      <h2>No Courses were found</h2>
                      <p>Contact support team for more information.</p>
                    </div>
                  </>
                )}
              </>
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
            {!loading ? (
              <>
                {allCourses && allCourses.filter((c) => c.state === "ACTIVE").length > 0 ? (
                  <Courses allCourses={allCourses.filter((c) => c.state === "ACTIVE")} userRole={userRole} />
                ) : (
                  <>
                    <div className={styles.no_course_found}>
                      <img src="/img/common/empty.svg" alt="" />
                      <h2>No Courses were found</h2>
                      <p>Contact support team for more information.</p>
                    </div>
                  </>
                )}
              </>
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
