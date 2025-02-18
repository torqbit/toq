import { IAnalyticStats } from "@/types/courses/analytics";
import styles from "./Analytics.module.scss";
import { Card, Flex, Tag } from "antd";
import { FC } from "react";
import appConstant from "@/services/appConstant";
import SvgIcons from "../SvgIcons";

const AnalyticsCard: FC<IAnalyticStats> = ({ type, total, comparedPercentage, currency }) => {
  return (
    <Card className={styles.stats}>
      <p>Total {type}</p>
      <h2>
        {type == "Earnings" && currency ? currency : ""} {total}
      </h2>
      <Flex align="center">
        {comparedPercentage && comparedPercentage !== 0 ? (
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

export default AnalyticsCard;
