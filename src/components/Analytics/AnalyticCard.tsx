import { AnalyticsType, IAnalyticStats } from "@/types/courses/analytics";
import styles from "./Analytics.module.scss";
import { Card, Flex, Tag } from "antd";
import { FC } from "react";
import SvgIcons from "../SvgIcons";

const AnalyticsCard: FC<IAnalyticStats> = ({ type, total, comparedPercentage, currency }) => {
  const getTitle = (type: AnalyticsType) => {
    switch (type) {
      case "AIMessages":
        return "AI Messages";
      case "PageViews":
        return "Page Views";

      default:
        return type;
    }
  };
  return (
    <Card className={styles.stats}>
      <p>Total {getTitle(type)}</p>
      <h2>{total}</h2>
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
