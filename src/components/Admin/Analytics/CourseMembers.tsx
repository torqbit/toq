import { UserAnalyseData } from "@/services/AnalyticsService";
import styles from "@/styles/Analytics.module.scss";
import { Segmented } from "antd";
import { SegmentedValue } from "antd/es/segmented";
import { FC } from "react";
import LineChart from "./LineChart";
import { Serie } from "@nivo/line";

const CourseMembers: FC<{ onChange: (value: SegmentedValue) => void; userData: UserAnalyseData[] }> = ({
  onChange,
  userData,
}) => {
  const data = [
    {
      id: "line",

      data: userData?.map((d) => {
        return {
          x: d.month,
          y: d.users,
        };
      }),
    },
  ] as Serie[];
  return (
    <div className={styles.courseMembersContainer}>
      <h1>Course Members</h1>
      <p>Analyse all course members and their progress</p>
      <div className={styles.segmentedWrapper}>
        <Segmented
          className={styles.segmented}
          size="middle"
          options={[
            { label: "View All", value: "view" },
            { label: "Enrolled", value: "enrolled" },
            { label: "Active", value: "active" },
          ]}
          onChange={(e) => {
            onChange(e);
          }}
        />
      </div>
      <div className={styles.lineChartWrapper}>
        <LineChart data={data} title={"students"} axisBottomTitle="Months" axisLeftTitle="Users" />
      </div>
    </div>
  );
};

export default CourseMembers;
