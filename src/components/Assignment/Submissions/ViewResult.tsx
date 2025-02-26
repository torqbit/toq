import { Drawer, Flex, Form, Input, InputNumber, Steps } from "antd";
import { FC } from "react";
import PurifyContent from "../../PurifyContent/PurifyContent";
import appConstant from "@/services/appConstant";
import styles from "@/styles/AssignmentEvaluation.module.scss";
import SvgIcons from "../../SvgIcons";
import { IScoreSummary } from "@/services/course/AssignmentService";
import { AssignmentType, QuestionScore } from "@/types/courses/assignment";
import ConfigForm from "@/components/Configuration/ConfigForm";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";

const ViewResult: FC<{
  score: number;
  comment: string;
  maximumScore: number;
  passingScore: number;
  setDrawerOpen: (value: boolean) => void;
  scoreSummary: IScoreSummary;
  gradingParameter: QuestionScore[];
  drawerOpen: boolean;
}> = ({ score, comment, drawerOpen, setDrawerOpen, maximumScore, passingScore, scoreSummary, gradingParameter }) => {
  return (
    <Drawer
      width={"35vw"}
      classNames={{ header: styles.headerWrapper }}
      title={
        <Flex className={styles.drawerHeader} align="center" justify="space-between">
          <div>Details</div>
          <Flex align="center" gap={10} className={styles.scoreWrapper}>
            <div>
              {score >= passingScore ? (
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
              {score}/{maximumScore} Points
            </div>
          </Flex>
        </Flex>
      }
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      {scoreSummary && scoreSummary?._type === AssignmentType.SUBJECTIVE && gradingParameter && (
        <Steps
          current={gradingParameter?.length}
          status="finish"
          size="small"
          progressDot
          direction="vertical"
          className={styles.ant_steps_container}
          items={gradingParameter.map((grading, index) => {
            return {
              title: (
                <ConfigFormLayout formTitle={`${grading.questionIndex}`} width="450px">
                  <Form>
                    <ConfigForm
                      title="Awarded points"
                      divider
                      description={`Scored :  ${scoreSummary?.eachQuestionScore[index]?.score}/${grading.score}`}
                      input={<></>}
                    />
                    <ConfigForm
                      title="Comments"
                      layout="vertical"
                      description={`${scoreSummary?.eachQuestionScore[index]?.comment}`}
                      input={<></>}
                    />
                  </Form>
                </ConfigFormLayout>
              ),
            };
          })}
        />
      )}

      {scoreSummary && scoreSummary?._type === AssignmentType.MCQ && (
        <div className={styles.editorContainer}>
          <PurifyContent content={String(comment)} />
        </div>
      )}
    </Drawer>
  );
};
export default ViewResult;
