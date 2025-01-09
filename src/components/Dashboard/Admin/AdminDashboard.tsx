import { FC, useEffect, useState } from "react";
import { PageSiteConfig } from "@/services/siteConstant";
import styles from "./AdminDashboard.module.scss";
import { Card, Flex, message, Skeleton, Tabs, TabsProps, Tag } from "antd";

import { AnalyticsDuration, AnalyticsType, IAnalyticResponse, IAnalyticStats } from "@/types/courses/analytics";
import AnalyticsService from "@/services/AnalyticsService";
import { getDummyArray } from "@/lib/dummyData";
import SvgIcons from "@/components/SvgIcons";
import Analytics from "./Analytics";
import appConstant from "@/services/appConstant";
import { Serie } from "@nivo/line";

const AnalyticsCard: FC<IAnalyticStats> = ({ type, total, comparedPercentage }) => {
  return (
    <Card className={styles.stats}>
      <p>Total {type}</p>
      <h2>
        {type == "Earnings" && appConstant.payment.currency} {total}
      </h2>
      <Flex align="center">
        {comparedPercentage !== 0 ? (
          <Tag color={comparedPercentage > 0 ? "green" : "volcano"}>
            <Flex align="center" gap={5}>
              <i>{comparedPercentage < 0 ? SvgIcons.arrowTrendingDown : SvgIcons.arrowTrendingUp}</i>
              <div>{Math.abs(comparedPercentage)}%</div>
            </Flex>
          </Tag>
        ) : (
          <Tag>
            <Flex align="center" gap={5}>
              <i>{SvgIcons.arrowRight}</i>
              <div>{Math.abs(comparedPercentage)}%</div>
            </Flex>
          </Tag>
        )}
        <div>from last month</div>
      </Flex>
    </Card>
  );
};
const AnalyticsCardSkeleton: FC<{}> = () => {
  return (
    <Card className={styles.stats}>
      <Skeleton paragraph />
    </Card>
  );
};

const AdminDashboard: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingOverview, setLoadingOverview] = useState<boolean>(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);

  const [overviewStats, setOverViewStat] = useState<IAnalyticStats[]>([]);

  const [analyticStats, setAnalyticStat] = useState<IAnalyticResponse>();

  const [tab, setTab] = useState<AnalyticsType>("Earnings");

  const handleAnalytics = (duration: AnalyticsDuration, type: AnalyticsType) => {
    setLoadingAnalytics(true);
    AnalyticsService.analyticStats(
      duration,
      type,
      (result) => {
        console.log(result.analyticStats);
        setAnalyticStat(result.analyticStats);
        setLoadingAnalytics(false);
      },
      (error) => {
        messageApi.error(error);
        setLoadingAnalytics(false);
      }
    );
  };
  const items: TabsProps["items"] = [
    {
      key: "Earnings",
      label: "Earnings",
      children: (
        <>
          {analyticStats?.info && (
            <Analytics
              key={"Earnings"}
              loading={loadingAnalytics}
              info={analyticStats.info as IAnalyticStats}
              handleAnalytic={handleAnalytics}
              data={analyticStats.data}
              siteConfig={siteConfig}
            />
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    setLoadingOverview(true);
    AnalyticsService.overviewStats(
      (result) => {
        setOverViewStat(result.overviewStats);
        handleAnalytics("month", "Earnings");

        setLoadingOverview(false);
      },
      (error) => {
        messageApi.error(error);
        setLoadingOverview(false);
      }
    );
  }, []);

  const hadleTabs = (value: AnalyticsType) => {
    setTab(value);
    handleAnalytics("month", value);
  };

  return (
    <section className={styles.admin__dashboard}>
      {contextHolder}
      <h3>Overview</h3>
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
          activeKey={tab}
          onChange={(k) => {
            hadleTabs(k as AnalyticsType);
          }}
        />
      </div>
    </section>
  );
};

export default AdminDashboard;
