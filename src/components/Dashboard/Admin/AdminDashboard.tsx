import { FC, useEffect, useState } from "react";
import { PageSiteConfig } from "@/services/siteConstant";
import { message } from "antd";
import { AnalyticsDuration, AnalyticsType, IAnalyticResponse, IAnalyticStats } from "@/types/courses/analytics";
import AnalyticsService from "@/services/AnalyticsService";
import AnalyticView from "@/components/Analytics/AnalyticView";

const AdminDashboard: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingOverview, setLoadingOverview] = useState<boolean>(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>();

  const [overviewStats, setOverViewStat] = useState<IAnalyticStats[]>([]);

  const [analyticStats, setAnalyticStat] = useState<IAnalyticResponse>();

  const handleAnalytics = (duration: AnalyticsDuration, type: AnalyticsType) => {
    setLoadingAnalytics(true);
    AnalyticsService.analyticStats(
      duration,
      type,
      (result) => {
        setCurrency(result.currency);
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
    AnalyticsService.overviewStats(
      (result) => {
        setOverViewStat(result);
        handleAnalytics("month", "Earnings");

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
      <AnalyticView
        siteConfig={siteConfig}
        analyticStats={analyticStats}
        loadingOverview={loadingOverview}
        overviewStats={overviewStats}
        loadingAnalytics={loadingAnalytics}
        handleAnalytics={handleAnalytics}
        currency={currency}
      />
    </>
  );
};

export default AdminDashboard;
