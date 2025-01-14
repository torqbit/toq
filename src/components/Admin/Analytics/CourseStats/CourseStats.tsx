import AnalyticsService, { UserAnalyseData } from "@/services/AnalyticsService";
import styles from "./CourseStats.module.scss";
import { SegmentedValue } from "antd/es/segmented";
import { FC, useEffect, useState } from "react";
import OverallMembersList from "../OverallMembersList";
import CourseMembers from "../CourseMembers";
import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const CourseStats: FC<{
  courseId: number;
}> = ({ courseId }) => {
  const [userData, setUserData] = useState<UserAnalyseData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [overallMembers, setOverallmember] = useState<{
    totalMembers: number;
    totalEnrolled: number;
    activeMembers: number;
  }>();

  const getOverallMembers = () => {
    AnalyticsService.overAllMembers(
      courseId,
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
      courseId,
      (result) => {
        setUserData(result.userData);
        setLoading(false);
      },
      (error) => {}
    );
  };
  const getMonthlyActive = () => {
    AnalyticsService.monthlyActiveMembers(
      courseId,
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
    getOverallMembers();
    getMonthlyMembers();
  }, []);

  return (
    <>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <section>
          {overallMembers && <OverallMembersList overallMembers={overallMembers} />}
          {userData.length > 0 && <CourseMembers onChange={onChange} userData={userData} />}
        </section>
      </Spin>
    </>
  );
};

export default CourseStats;
