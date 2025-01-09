import { FC } from "react";

import styles from "./AdminDashboard.module.scss";
import { Flex, Segmented, Skeleton } from "antd";

const AnalyticSkeleton: FC<{}> = () => {
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
export default AnalyticSkeleton;
