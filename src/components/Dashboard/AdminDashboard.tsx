import { FC, useEffect, useState } from "react";
import { PageSiteConfig } from "@/services/siteConstant";
import styles from "./AdminDashboard.module.scss";
import { Card, Flex, message, Skeleton, Tabs, TabsProps, Tag } from "antd";
import SvgIcons from "../SvgIcons";
import { IOverviewStats } from "@/types/courses/analytics";
import AnalyticsService from "@/services/AnalyticsService";
import { getDummyArray } from "@/lib/dummyData";

const AnalyticsCard: FC<IOverviewStats> = ({ type, total, comparedPercentage }) => {
  return (
    <Card className={styles.analyticsCard}>
      <p>Total {type}</p>
      <h2>{total}</h2>
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
    <Card className={styles.analyticsCard}>
      <Skeleton paragraph />
    </Card>
  );
};

const AdminDashboard: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingOverview, setLoadingOverview] = useState<boolean>(false);
  const [overviewStats, setOverViewStat] = useState<IOverviewStats[]>([]);
  const [tab, setTab] = useState("1");
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Earnings",
      children: <></>,
    },
  ];

  useEffect(() => {
    setLoadingOverview(true);
    AnalyticsService.overviewStats(
      (result) => {
        setOverViewStat(result.overviewStats);
        setLoadingOverview(false);
      },
      (error) => {
        messageApi.error(error);
        setLoadingOverview(false);
      }
    );
  }, []);

  return (
    <section className={styles.admin__dashboard}>
      {contextHolder}
      <h3>Overview</h3>
      <div className={styles.analytics__card__wrapper}>
        {loadingOverview || overviewStats.length === 0
          ? getDummyArray(3).map((d, i) => {
              return <AnalyticsCardSkeleton key={i} />;
            })
          : overviewStats.map((overview, i) => {
              return <AnalyticsCard {...overview} key={i} />;
            })}
      </div>
      <div className={styles.analytics__tab__wrapper}>
        <Tabs tabBarGutter={40} items={items} activeKey={tab} onChange={(k) => setTab(k)} />
      </div>
    </section>
  );
};

export default AdminDashboard;
