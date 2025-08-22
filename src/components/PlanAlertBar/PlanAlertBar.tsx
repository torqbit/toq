import React, { FC } from "react";
import { Alert, Button, Flex, Progress, Row } from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { daysLeftForTrial, getPercentage } from "@/services/helper";
import { generateDayAndYear, getPlanTotalDays } from "@/lib/utils";
import SvgIcons from "../SvgIcons";
import Link from "next/link";

const PlanAlertBar: FC<{ onUpgrade: () => void }> = ({ onUpgrade }) => {
  const { data: user, status, update } = useSession();
  const router = useRouter();
  let subscriptionStartDate = user?.tenant?.subscription?.startDate;

  let subscriptionEndDate = user?.tenant?.subscription?.endDate;

  let daysLeft = daysLeftForTrial(subscriptionEndDate as Date);
  let totalDays = getPlanTotalDays(`${subscriptionStartDate}`, `${subscriptionEndDate}`);

  let percentage = Math.trunc(getPercentage(totalDays - daysLeft, totalDays));

  return (
    <Alert
      style={{ width: "100%", border: "none", borderRadius: 0, backgroundColor: "var(--btn-primary)" }}
      message={
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <Flex align="center" gap={30}>
            <Progress
              size={{ width: 250 }}
              status={percentage > 90 ? "exception" : "active"}
              percent={percentage}
              trailColor="#242424"
              strokeColor={percentage > 90 ? "red" : "#fff"}
              showInfo={false}
            />
            <Flex align="center" gap={10} style={{ width: "140%" }}>
              <p style={{ margin: 0, color: "#fff" }}>
                Day {totalDays - daysLeft} / {totalDays}
              </p>
              <div style={{ height: 20, width: 1, backgroundColor: "#fff" }}></div>
              <p style={{ margin: 0, color: "#fff" }}>
                {new Date(String(subscriptionEndDate)).getTime() > new Date().getTime()
                  ? ` Free trial until ${generateDayAndYear(new Date(String(subscriptionEndDate)))}`
                  : ` Free trial is ended on ${generateDayAndYear(new Date(String(subscriptionEndDate)))}`}
              </p>
            </Flex>
          </Flex>

          <Flex align="center" gap={20}>
            <Link href={`https://cal.com/torqbit/30min`} target="_blank">
              <Flex align="center" gap={10} style={{ color: "#fff" }}>
                <i style={{ fontSize: 24, color: "#fff", lineHeight: 0 }}>{SvgIcons.message}</i>
                Talk to Us
              </Flex>
            </Link>

            <Button
              style={{ backgroundColor: "#fff", color: "var(--btn-primary)", border: "none" }}
              onClick={onUpgrade}
            >
              Upgrade
            </Button>
          </Flex>
        </Flex>
      }
      showIcon={false}
    />
  );
};

export default PlanAlertBar;
