import { PageSiteConfig } from "@/services/siteConstant";
import { FC, useEffect, useState } from "react";
import { Card, Flex, message, Progress, Skeleton } from "antd";
import { IUsageData } from "@/types/admin/plans";
import styles from "./Plan.module.scss";
import { getDummyArray } from "@/lib/dummyData";
import { formatUsedStorage } from "@/lib/utils";
const UsageCard: FC<IUsageData> = ({ label, total, used, percentage }) => {
  return (
    <Card style={{ minWidth: 300 }}>
      <Flex align="flex-start" justify="space-between" gap={10}>
        <div>
          <div>{label}</div>
          <h4>
            {formatUsedStorage(used)} / {formatUsedStorage(total)}
          </h4>
        </div>
        <Progress
          type="circle"
          format={(percentage) => (percentage == 100 ? <span className="text-[30px]"> !</span> : `${percentage} %`)}
          status={percentage == 100 ? "exception" : "active"}
          percent={percentage}
          size={60}
        />
      </Flex>
    </Card>
  );
};

const UsageData: FC<{
  siteConfig: PageSiteConfig;
  active: boolean;
  trialMode?: boolean;
}> = ({ siteConfig, active, trialMode }) => {
  const [data, setData] = useState<IUsageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <section>
      {contextHolder}
      <Flex vertical gap={20}>
        {" "}
        <h4>Usage Summary</h4>
        <div style={{ position: "relative" }}>
          <p>
            Your plan includes limited amount of usage. If exceeded, you may experience restirictions, as you are not
            billed for over usages.
          </p>
          {loading ? (
            <Flex align="center" gap={40}>
              {getDummyArray(2).map((d, i) => {
                return (
                  <Card key={i} style={{ minWidth: 300, height: 100 }}>
                    <Skeleton paragraph={{ rows: 1 }} />
                  </Card>
                );
              })}
            </Flex>
          ) : (
            <div className={styles.usage__card}>
              {data.map((d, i) => {
                return (
                  <>
                    <UsageCard key={i} label={d.label} total={d.total} used={d.used} percentage={d.percentage} />
                  </>
                );
              })}
            </div>
          )}
        </div>
      </Flex>
    </section>
  );
};

export default UsageData;
