import { Drawer, Flex } from "antd";
import { FC } from "react";
import PurifyContent from "../../PurifyContent/PurifyContent";
import appConstant from "@/services/appConstant";
import styles from "@/styles/AssignmentEvaluation.module.scss";
import SvgIcons from "../../SvgIcons";

const ViewResult: FC<{
  score: number;
  comment: string;
  setDrawerOpen: (value: boolean) => void;
  drawerOpen: boolean;
}> = ({ score, comment, drawerOpen, setDrawerOpen }) => {
  return (
    <Drawer
      width={"30vw"}
      classNames={{ header: styles.headerWrapper }}
      title={
        <Flex className={styles.drawerHeader} align="center" justify="space-between">
          <div>Details</div>
          <Flex align="center" gap={10} className={styles.scoreWrapper}>
            <div>
              {score >= appConstant.assignmentPassingMarks ? (
                <Flex gap={5} align="center">
                  <i>{SvgIcons.checkFilled}</i>
                  <span> Passed</span>
                </Flex>
              ) : (
                <Flex gap={5} align="center">
                  <i>{SvgIcons.cross}</i>
                  <span> Failed</span>
                </Flex>
              )}
            </div>
            <div className={styles.dot}></div>
            <div>
              {score}/{appConstant.assignmentMaxScore} Points
            </div>
          </Flex>
        </Flex>
      }
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <div className={styles.editorContainer}>
        <PurifyContent content={String(comment)} />
      </div>
    </Drawer>
  );
};
export default ViewResult;
