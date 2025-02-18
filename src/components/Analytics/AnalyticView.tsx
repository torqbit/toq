import { FC, useState } from "react";
import { PageSiteConfig } from "@/services/siteConstant";
import styles from "./Analytics.module.scss";
import { Tabs, TabsProps } from "antd";
import { AnalyticsDuration, AnalyticsType, IAnalyticResponse, IAnalyticStats } from "@/types/courses/analytics";
import { getDummyArray } from "@/lib/dummyData";
import { AnalyticsCardSkeleton, AnalyticSkeleton } from "@/components/Analytics/AnalyticSkeleton";
import Analytics from "@/components/Analytics/Analytics";
import AnalyticsCard from "@/components/Analytics/AnalyticCard";

const AnalyticView: FC<{
  siteConfig: PageSiteConfig;
  analyticStats?: IAnalyticResponse;
  loadingOverview: boolean;
  overviewStats: IAnalyticStats[];
  loadingAnalytics: boolean;
  handleAnalytics: (duration: AnalyticsDuration, type: AnalyticsType) => void;
  currency?: string;
}> = ({ siteConfig, analyticStats, overviewStats, loadingOverview, handleAnalytics, loadingAnalytics, currency }) => {
  const [selectedTab, setTab] = useState<AnalyticsType>("Earnings");
  const handleTabs = (value: AnalyticsType) => {
    setTab(value);
    handleAnalytics("month", value);
  };
  const items: TabsProps["items"] = [
    {
      key: "Earnings",
      label: "Earnings",
      children: (
        <>
          {analyticStats?.info ? (
            <Analytics
              key={"Earnings"}
              loading={loadingAnalytics}
              info={analyticStats.info as IAnalyticStats}
              handleAnalytic={handleAnalytics}
              data={analyticStats.data}
              siteConfig={siteConfig}
              currency={currency}
            />
          ) : (
            <AnalyticSkeleton />
          )}
        </>
      ),
    },
    {
      key: "Enrollments",
      label: "Enrollments",
      children: (
        <>
          {analyticStats?.info ? (
            <Analytics
              key={"Enrollments"}
              loading={loadingAnalytics}
              info={analyticStats.info as IAnalyticStats}
              handleAnalytic={handleAnalytics}
              data={analyticStats.data}
              siteConfig={siteConfig}
              currency={currency}
            />
          ) : (
            <AnalyticSkeleton />
          )}
        </>
      ),
    },
    {
      key: "Users",
      label: "Users",
      children: (
        <>
          {analyticStats?.info ? (
            <Analytics
              key={"Users"}
              loading={loadingAnalytics}
              info={analyticStats.info as IAnalyticStats}
              handleAnalytic={handleAnalytics}
              data={analyticStats.data}
              siteConfig={siteConfig}
              currency={currency}
            />
          ) : (
            <AnalyticSkeleton />
          )}
        </>
      ),
    },
  ];

  return (
    <section className={styles.analytic__view__wrapper}>
      <div className={styles.analytics__stats__wrapper}>
        {loadingOverview || overviewStats.length === 0
          ? getDummyArray(3).map((d, i) => {
              return <AnalyticsCardSkeleton key={i} />;
            })
          : overviewStats.map((overview, i) => {
              return <AnalyticsCard {...overview} key={i} />;
            })}
      </div>
      <div className={styles.analytics__tab__wrapper}>
        <Tabs
          tabBarGutter={40}
          items={items}
          activeKey={selectedTab}
          onChange={(k) => {
            handleTabs(k as AnalyticsType);
          }}
        />
      </div>
    </section>
  );
};

export default AnalyticView;
