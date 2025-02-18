import { FC, useEffect, useState } from "react";
import styles from "./Analytics.module.scss";
import { Flex, Segmented } from "antd";
import { AnalyticsDuration, AnalyticsType, IAnalyticStats } from "@/types/courses/analytics";
import LineChart from "@/components/Admin/Analytics/LineChart";
import { Serie } from "@nivo/line";
import appConstant from "@/services/appConstant";
import { capsToPascalCase } from "@/lib/utils";
import { PageSiteConfig } from "@/services/siteConstant";

export const ToolTipContainer: FC<{ title: string; value: string; date: string }> = ({ title, value, date }) => {
  return (
    <div className={styles.tooltip__wrapper}>
      <p>{title}</p>
      <h4>{value}</h4>
      <p> {date}</p>
    </div>
  );
};

const Analytics: FC<{
  info: IAnalyticStats;
  handleAnalytic: (duration: AnalyticsDuration, type: AnalyticsType) => void;
  loading: boolean;
  data: Serie[];
  siteConfig: PageSiteConfig;
  currency?: string;
}> = ({ info, handleAnalytic, loading, data, siteConfig, currency }) => {
  const [segment, setSegment] = useState<AnalyticsDuration>("month");
  const getDescription = (type: AnalyticsType) => {
    switch (type) {
      case "Earnings":
        return (
          <p>
            This {segment} you earned{" "}
            <strong>
              {currency} {info.total}
            </strong>
            &nbsp; which is <strong>{Math.abs(info.comparedPercentage)}% </strong>{" "}
            {info.comparedPercentage > 0 ? "more" : "less"} than last {segment}
          </p>
        );

      case "Enrollments":
        return (
          <p>
            This {segment}, you had <strong>{info.total}</strong> new enrollments, which is
            <strong> {Math.abs(info.comparedPercentage)}% </strong> {info.comparedPercentage > 0 ? "more" : "less"} than
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

  const TooltipWrapper = (value: number, date: string): React.ReactNode => {
    switch (info.type) {
      case "Earnings":
        return (
          <ToolTipContainer
            title="Earned"
            value={` ${currency} ${value}`}
            date={
              segment === "month"
                ? `on ${date} ${new Date().toLocaleString("default", { month: "short" })}`
                : `in ${date}`
            }
          />
        );

      case "Enrollments":
        return (
          <ToolTipContainer
            title="Enrolled"
            value={`${value} ${value > 0 && value > 1 ? "students" : "Student"}`}
            date={
              segment === "month"
                ? `on ${date} ${new Date().toLocaleString("default", { month: "short" })}`
                : `in ${date}`
            }
          />
        );
      case "Users":
        return (
          <ToolTipContainer
            title="Users"
            value={`${value} ${value > 0 && value > 1 ? "users" : "user"}`}
            date={
              segment === "month"
                ? `on ${date} ${new Date().toLocaleString("default", { month: "short" })}`
                : `in ${date}`
            }
          />
        );
      default:
        return <></>;
    }
  };
  const getYmaxLength = (data: number[]) => {
    let total = 0;
    data.reduce((pre, curr) => {
      return (total = pre + curr);
    });
    return total > 0 ? undefined : 1;
  };

  const getAxisBottomTitle = () => {
    let currentDate = new Date();
    switch (segment) {
      case "month":
        return currentDate.toLocaleString("default", { month: "long" });

      case "quarter":
        const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3;
        if (quarterStartMonth >= 0 && quarterStartMonth <= 2) {
          return `Q1 ${currentDate.getFullYear()}`;
        } else if (quarterStartMonth >= 3 && quarterStartMonth <= 5) {
          return `Q2 ${currentDate.getFullYear()}`;
        } else if (quarterStartMonth >= 6 && quarterStartMonth <= 8) {
          return `Q3 ${currentDate.getFullYear()}`;
        } else {
          return `Q4 ${currentDate.getFullYear()}`;
        }

      case "year":
        return `Year (${currentDate.getFullYear()})`;

      default:
        return "";
    }
  };
  return (
    <div className={styles.analytics__wrapper}>
      <Flex vertical gap={50}>
        <Flex align="center" justify="space-between">
          {getDescription(info.type)}
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
            key={segment}
            TooltipWrapper={TooltipWrapper}
            data={data}
            title={"Rupees"}
            axisBottomTitle={getAxisBottomTitle()}
            axisLeftTitle={info.type}
            yMaxLength={data.length > 0 ? getYmaxLength(data[0].data.map((d) => Number(d.y))) : undefined}
            color={siteConfig.brand?.brandColor}
          />
        </div>
      </Flex>
    </div>
  );
};
export default Analytics;
