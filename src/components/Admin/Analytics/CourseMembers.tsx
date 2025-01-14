import { UserAnalyseData } from "@/services/AnalyticsService";
import styles from "@/styles/Analytics.module.scss";
import { Segmented } from "antd";
import { SegmentedValue } from "antd/es/segmented";
import { FC, useState } from "react";
import LineChart from "./LineChart";
import { Serie } from "@nivo/line";
import { ToolTipContainer } from "@/components/Analytics/Analytics";
import { capsToPascalCase } from "@/lib/utils";

const CourseMembers: FC<{ onChange: (value: SegmentedValue) => void; userData: UserAnalyseData[] }> = ({
  onChange,
  userData,
}) => {
  const [segment, setSelectedSegment] = useState<string>("view");
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

  const TooltipWrapper = (value: number, date: string): React.ReactNode => {
    return (
      <ToolTipContainer
        title={segment === "view" ? "Students" : capsToPascalCase(segment)}
        value={`${value}`}
        date={`in ${date}`}
      />
    );
  };
  return (
    <div className={styles.courseMembersContainer}>
      <h1>Course Members</h1>
      <p>Analyse all course members and their progress</p>
      <div className={styles.segmentedWrapper}>
        <Segmented
          className={styles.segmented}
          size="middle"
          value={segment}
          options={[
            { label: "View All", value: "view" },
            { label: "Enrolled", value: "enrolled" },
            { label: "Active", value: "active" },
          ]}
          onChange={(e) => {
            onChange(e);
            setSelectedSegment(e);
          }}
        />
      </div>
      <div className={styles.lineChartWrapper}>
        <LineChart
          data={data}
          title={"students"}
          axisBottomTitle="Months"
          axisLeftTitle="Users"
          TooltipWrapper={TooltipWrapper}
        />
      </div>
    </div>
  );
};

export default CourseMembers;
