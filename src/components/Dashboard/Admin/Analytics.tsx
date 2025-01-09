import { FC, useEffect, useState } from "react";

import styles from "./AdminDashboard.module.scss";
import { Flex, Segmented } from "antd";
import { AnalyticsDuration, AnalyticsType, IAnalyticStats } from "@/types/courses/analytics";
import AnalyticSkeleton from "./AnalyticSkeleton";
import LineChart from "@/components/Admin/Analytics/LineChart";
import { Serie } from "@nivo/line";
import appConstant from "@/services/appConstant";
import { capsToPascalCase } from "@/lib/utils";
import { PageSiteConfig } from "@/services/siteConstant";

const Analytics: FC<{
  info: IAnalyticStats;
  handleAnalytic: (duration: AnalyticsDuration, type: AnalyticsType) => void;
  loading: boolean;
  data: Serie[];
  siteConfig: PageSiteConfig;
}> = ({ info, handleAnalytic, loading, data, siteConfig }) => {
  const [segment, setSegment] = useState<AnalyticsDuration>("month");
  const getDescription = (type: AnalyticsType) => {
    switch (type) {
      case "Earnings":
        return (
          <p>
            This {segment} you earned{" "}
            <strong>
              {appConstant.payment.currency} {info.total}
            </strong>
            &nbsp; which is <strong>{Math.abs(info.comparedPercentage)}% </strong>{" "}
            {info.comparedPercentage > 0 ? "more" : "less"} than last {segment}
          </p>
        );

      case "Enrollments":
        return (
          <p>
            This {segment}, you had <strong>{info.total}</strong> new enrollments, which is
            <strong>{Math.abs(info.comparedPercentage)}% </strong> {info.comparedPercentage > 0 ? "more" : "less"} than
            last {segment}
          </p>
        );

      case "Users":
        <p>
          This {segment}, you had <strong>{info.total}</strong> new enrollments, which is{" "}
          <strong>{Math.abs(info.comparedPercentage)}% </strong> {info.comparedPercentage > 0 ? "more" : "less"} than
          last {segment}
        </p>;
        return (
          <p>
            This {segment} you gained <strong>{info.total}</strong> new users which is{" "}
            <strong>{Math.abs(info.comparedPercentage)}% </strong> {info.comparedPercentage > 0 ? "more" : "less"} than
            last {segment}
          </p>
        );

      default:
        break;
    }
  };

  useEffect(() => {
    info.type && setSegment("month");
  }, [info.type]);
  return (
    <div className={styles.analytics__wrapper}>
      {!loading ? (
        <Flex vertical gap={50}>
          <Flex align="center" justify="space-between">
            <p>{getDescription(info.type)}</p>
            <Segmented
              className={styles.segment}
              value={segment}
              onChange={(value: AnalyticsDuration) => {
                setSegment(value);
                handleAnalytic(value, info.type);
              }}
              options={[
                {
                  label: "This Month",
                  value: "month",
                },
                {
                  label: "Quarter",
                  value: "quarter",
                },
                {
                  label: "Year",
                  value: "year",
                },
              ]}
            />
          </Flex>
          <div className={styles.line__chart__wrapper} style={{ height: "50vh" }}>
            <LineChart
              data={data}
              title={"Rupees"}
              axisBottomTitle={capsToPascalCase(segment)}
              axisLeftTitle={info.type}
              color={siteConfig.brand?.brandColor}
            />
          </div>
        </Flex>
      ) : (
        <>
          <AnalyticSkeleton />
        </>
      )}
    </div>
  );
};
export default Analytics;
