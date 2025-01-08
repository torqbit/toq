import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import styles from "@/styles/Analytics.module.scss";
import { Breadcrumb, Flex, Spin, Tabs, TabsProps } from "antd";
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
import CourseStats from "@/components/Admin/Analytics/CourseStats/CourseStats";

const AnalyticsPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { data: session } = useSession();
  const [tab, setTab] = useState("1");
  const router = useRouter();
  const [overallMembers, setOverallmember] = useState<{
    totalMembers: number;
    totalEnrolled: number;
    activeMembers: number;
  }>();
  const [courseName, setCourseName] = useState<string>();
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Analytics",
      children: <CourseStats courseId={Number(router.query.id)} />,
    },
    {
      key: "2",
      label: `Enrolments`,
      children: <></>,
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserAnalyseData[]>([]);

  const getOverallMembers = () => {
    AnalyticsService.overAllMembers(
      Number(router.query.id),
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
      Number(router.query.id),
      (result) => {
        setUserData(result.userData);
        setLoading(false);
      },
      (error) => {}
    );
  };
  const getMonthlyActive = () => {
    AnalyticsService.monthlyActiveMembers(
      Number(router.query.id),
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
            <h3>{courseName}</h3>
            <Tabs tabBarGutter={40} items={items} activeKey={tab} onChange={(k) => setTab(k)} />
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
