import { FC } from "react";

import styles from "./Analytics.module.scss";

import { Card, Flex, Segmented, Skeleton } from "antd";

export const AnalyticSkeleton: FC<{}> = () => {
  return (
    <div className={styles.analytics__wrapper}>
      <Flex align="center" justify="space-between">
        <Skeleton paragraph={{ rows: 1, width: 200 }} title={{ style: { display: "none" } }} />

        <Skeleton.Input style={{ width: 300 }} />
      </Flex>
      <Skeleton.Image style={{ height: 400, width: 1000, marginTop: 50 }} />
    </div>
  );
};

export const AnalyticsCardSkeleton: FC<{}> = () => {
  return (
    <Card className={styles.stats}>
      <Skeleton paragraph />
    </Card>
  );
};
