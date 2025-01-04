import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import styles from "@/styles/Analytics.module.scss";
import { Flex, Spin } from "antd";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { useRouter } from "next/router";
import OverallMembersList from "@/components/Admin/Analytics/OverallMembersList";
import CourseMembers from "@/components/Admin/Analytics/CourseMembers";
import AnalyticsService, { UserAnalyseData } from "@/services/AnalyticsService";
import { useEffect, useState } from "react";
import { SegmentedValue } from "antd/es/segmented";
import ProgramService from "@/services/ProgramService";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";

const AnalyticsPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [overallMembers, setOverallmember] = useState<{
    totalMembers: number;
    totalEnrolled: number;
    activeMembers: number;
  }>();
  const [courseName, setCourseName] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserAnalyseData[]>();

  const getOverallMembers = () => {
    AnalyticsService.overAllMembers(
      Number(router.query.courseId),
      (result) => {
        setOverallmember({
          totalEnrolled: result.totalEnrolled,
          totalMembers: result.totalMembers,
          activeMembers: result.activeMembers,
        });
      },
      (error) => {}
    );
  };

  const getMonthlyMembers = () => {
    AnalyticsService.monthlyMembers(
      (result) => {
        setUserData(result.userData);

        setLoading(false);
      },
      (error) => {}
    );
  };

  const getMonthlyEnrolled = () => {
    AnalyticsService.monthlyEnrolledMembers(
      Number(router.query.courseId),
      (result) => {
        setUserData(result.userData);
        setLoading(false);
      },
      (error) => {}
    );
  };
  const getMonthlyActive = () => {
    AnalyticsService.monthlyActiveMembers(
      Number(router.query.courseId),
      (result) => {
        setUserData(result.userData);

        setLoading(false);
      },
      (error) => {}
    );
  };

  const onChange = (value: SegmentedValue) => {
    value === "view" && getMonthlyMembers();
    value === "enrolled" && getMonthlyEnrolled();
    value === "active" && getMonthlyActive();
  };

  useEffect(() => {
    setLoading(true);
    router.query.id &&
      ProgramService.getCourseDetails(
        Number(router.query.id),
        (result) => {
          setCourseName(result.courseDetails.name);
          getOverallMembers();
          getMonthlyMembers();
          setLoading(false);
        },
        (error) => {
          setLoading(false);
        }
      );
  }, [router.query.courseId]);

  return (
    <AppLayout siteConfig={siteConfig}>
      <>
        {loading ? (
          <SpinLoader />
        ) : (
          <section className={styles.analyticsContainer}>
            <div className={styles.learn_breadcrumb}>
              <Flex style={{ fontSize: 20 }}>
                <Link href={"/admin/content"}>Administration</Link>{" "}
                <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div>{" "}
                <Link href={`/admin/content/course/${router.query.courseId}/edit`}>Content</Link>
                <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div> {courseName}
              </Flex>
            </div>
            {overallMembers && <OverallMembersList overallMembers={overallMembers} />}
            {userData && <CourseMembers onChange={onChange} userData={userData} />}
          </section>
        )}
      </>
    </AppLayout>
  );
};

export default AnalyticsPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
