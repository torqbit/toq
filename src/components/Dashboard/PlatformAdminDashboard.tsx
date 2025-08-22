import { FC, useEffect, useState } from "react";
import { PageSiteConfig } from "@/services/siteConstant";
import { message } from "antd";
import { AnalyticsDuration, AnalyticsType, IAnalyticResponse, IAnalyticStats } from "@/types/courses/analytics";
import AnalyticsService from "@/services/AnalyticsService";

import PlatformAnalyticView from "../Analytics/PlatformAnalytics";

const PlatformAdminDashboard: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingOverview, setLoadingOverview] = useState<boolean>(false);
  const [overviewStats, setOverViewStat] = useState<IAnalyticStats[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [analyticStats, setAnalyticStat] = useState<IAnalyticResponse>();

  const handleAnalytics = (duration: AnalyticsDuration, type: AnalyticsType) => {
    setLoadingAnalytics(true);
    AnalyticsService.platformStats(
      duration,
      type,
      (result) => {
        setAnalyticStat(result);
        setLoadingAnalytics(false);
      },
      (error) => {
        messageApi.error(error);
        setLoadingAnalytics(false);
      }
    );
  };

  useEffect(() => {
    setLoadingOverview(true);
    AnalyticsService.platformOverviewStats(
      (result) => {
        setOverViewStat(result);
        handleAnalytics("month", "Orgs");
        setLoadingOverview(false);
      },
      (error) => {
        messageApi.error(error);
        setLoadingOverview(false);
      }
    );
  }, []);

  return (
    <>
      {contextHolder}
      <PlatformAnalyticView
        siteConfig={siteConfig}
        analyticStats={analyticStats}
        loadingOverview={loadingOverview}
        overviewStats={overviewStats}
        loadingAnalytics={loadingAnalytics}
        handleAnalytics={handleAnalytics}
      />
    </>
  );
};

export default PlatformAdminDashboard;
