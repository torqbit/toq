import styles from "@/styles/Analytics.module.scss";
import { FC } from "react";

const OverallMembersList: FC<{
  overallMembers: {
    totalMembers: number;
    totalEnrolled: number;
    activeMembers: number;
  };
}> = ({ overallMembers }) => {
  return (
    <div className={styles.overallMemberContainer}>
      <div className={styles.memberLists}>
        <div>
          <div>Total Members</div>
          <h2>{overallMembers.totalMembers}</h2>
        </div>
        <div>
          <div>Enrolled Members</div>
          <h2>{overallMembers.totalEnrolled}</h2>
        </div>
        <div>
          <div>Active this week</div>
          <h2>{overallMembers.activeMembers}</h2>
        </div>
      </div>
    </div>
  );
};

export default OverallMembersList;
