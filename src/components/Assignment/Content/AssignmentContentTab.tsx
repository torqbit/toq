import { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import AssignmentService, { ISubmissionDetail } from "@/services/course/AssignmentService";
import { IAssignmentDetail } from "@/types/courses/Course";
import { Button, Flex, message, Popconfirm, Radio, Result, Space, Spin, Tag, Tooltip } from "antd";
import MCQViewAssignment from "./MCQViewAssignment/MCQViewAssignment";
import {
  AssignmentType,
  IAssignmentSubmissionDetail,
  IEvaluationResult,
  MCQAssignment,
  MCQASubmissionContent,
  MultipleChoiceQA,
  SelectedAnswersType,
  SubjectiveAssignment,
  SubjectiveSubmissionContent,
} from "@/types/courses/assignment";

import { ArrowRightOutlined, DownloadOutlined, LeftOutlined, LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { setLocalStorage } from "@/lib/utils";
import { Role, submissionStatus } from "@prisma/client";
import { themeColors } from "@/services/darkThemeConfig";
import SubjectiveAssignmentView from "./SubjectiveAssignment/SubjectiveAssignmentView";

const AssignmentContentTab: FC<{
  lessonId?: number;
  setLessonRefresh: () => void;
  onNextLesson: () => void;
  userRole: Role;
}> = ({ lessonId, onNextLesson, setLessonRefresh, userRole }) => {
  const router = useRouter();
  const [assignmentDetail, setAssignmentDetail] = useState<IAssignmentDetail>();
  const [submissionDetail, setSubmissionDetail] = useState<IAssignmentSubmissionDetail | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<IEvaluationResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<MultipleChoiceQA[]>([]);
  const [subjectiveQuestion, setSubjectiveQuestion] = useState<SubjectiveAssignment | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersType>({});
  const [subjectiveAnswer, setSubjectiveAnswer] = useState<SubjectiveSubmissionContent>({
    answerArchiveUrl: "",
    answerContent: "",
    _type: AssignmentType.SUBJECTIVE,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isResultView, setResultView] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isCompleteBtnDisabled, setCompleteBtnDisabled] = useState<boolean>(false);
  const [finishDisabled, setFinishDisabled] = useState<boolean>(true);

  const getAssignmentDetail = (lessonId: number, isNoAnswer: boolean) => {
    setLoading(true);
    AssignmentService.getAssignment(
      lessonId,
      isNoAnswer,
      (assignmentDetail) => {
        setAssignmentDetail(assignmentDetail);

        if (
          assignmentDetail?.status &&
          assignmentDetail.status !== submissionStatus.NOT_SUBMITTED &&
          assignmentDetail.status !== submissionStatus.PENDING
        ) {
          setCompleteBtnDisabled(true);
          setEvaluationResult(assignmentDetail.evaluatedData);
        }

        if (
          assignmentDetail?.status &&
          assignmentDetail?.content._type !== AssignmentType.SUBJECTIVE &&
          assignmentDetail.status !== submissionStatus.NOT_SUBMITTED
        ) {
          setResultView(true);
        }

        if (assignmentDetail?.status && assignmentDetail.status !== submissionStatus.NOT_SUBMITTED) {
          if (assignmentDetail.submission) {
            setSubmissionDetail(assignmentDetail.submission as IAssignmentSubmissionDetail);
          }
          if (assignmentDetail?.content._type === AssignmentType.MCQ) {
            const content = assignmentDetail.submission.content as MCQASubmissionContent;
            setSelectedAnswers(content.selectedAnswers);
          } else if (assignmentDetail?.content._type === AssignmentType.SUBJECTIVE) {
            const content = assignmentDetail.submission.content as SubjectiveSubmissionContent;
            setSubjectiveAnswer(content);
          } else {
            setSelectedAnswers({});
          }
        }

        if (assignmentDetail.content._type === AssignmentType.MCQ) {
          setQuestions((assignmentDetail.content as unknown as MCQAssignment).questions);
        } else if (assignmentDetail.content._type === AssignmentType.SUBJECTIVE) {
          setSubjectiveQuestion(assignmentDetail.content as unknown as SubjectiveAssignment);
        }
        setLoading(false);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };

  const resetState = () => {
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setSelectedAnswers({});
    setSubmissionDetail(null);
    setEvaluationResult(null);
    setSubjectiveAnswer({ answerArchiveUrl: "", answerContent: "", _type: AssignmentType.MCQ });
    setCompleteBtnDisabled(false);
    setResultView(false);
  };

  const handleSelectAnswer = (answer: string | number, id: string) => {
    if (evaluationResult) return;
    setSelectedAnswers((prev: Record<number, (string | number)[]>) => {
      const currentAnswers = prev[Number(id)] || [];
      const isSelected = currentAnswers?.includes(answer);

      const ans = {
        ...prev,
        [id]: isSelected ? currentAnswers.filter((v: string | number) => v !== answer) : [...currentAnswers, answer],
      };

      if (typeof window !== "undefined") {
        setLocalStorage(`assignment-${lessonId}`, ans);
      }
      return ans;
    });
  };

  const onSubmitQuestion = () => {
    if (assignmentDetail?.content._type === AssignmentType.SUBJECTIVE) {
      if (subjectiveQuestion?.file_for_candidate && !subjectiveAnswer.answerArchiveUrl) {
        return messageApi.info({ content: "Please upload assignment file" });
      }
    }

    setSaveLoading(true);
    try {
      let submitData: any = {
        content: {},
        lessonId: lessonId as number,
        courseId: router.query.slug as string,
        assignmentId: assignmentDetail?.assignmentId as number,
      };

      switch (assignmentDetail?.content._type) {
        case AssignmentType.MCQ:
          submitData.content = { ...submitData.content, selectedAnswers, _type: AssignmentType.MCQ };
          break;

        case AssignmentType.SUBJECTIVE: {
          submitData.content = { ...submitData.content, ...subjectiveAnswer, _type: AssignmentType.SUBJECTIVE };
          break;
        }
        default:
          break;
      }

      AssignmentService.saveAssignment(
        submitData,
        async (result) => {
          if (assignmentDetail?.content._type === AssignmentType.MCQ) {
            await onClickToEvaluate(result.id);
          } else {
            setSaveLoading(false);
            setRefresh(!refresh);
            messageApi.success({ content: "Assignment saved successfully" });
          }
          setLessonRefresh();
        },
        (error) => {
          messageApi.error({ content: error });
          setSaveLoading(false);
        }
      );
    } catch (error: any) {
      setSaveLoading(false);

      messageApi.error({
        content: error,
      });
    }
  };

  const onClickToEvaluate = async (subId: number) => {
    AssignmentService.completeSubmission(
      router.query.slug as string,
      assignmentDetail?.assignmentId as number,
      lessonId as number,
      subId as number,
      async (result) => {
        setSaveLoading(false);
        setCurrentQuestionIndex(0);
        setRefresh(!refresh);
        message.success("Assignment evaluated successfully");
      },
      (error) => {
        messageApi.error(error);
        setSaveLoading(false);
      }
    );
  };

  useEffect(() => {
    if (lessonId && typeof window !== "undefined" && assignmentDetail?.content._type === AssignmentType.MCQ) {
      const data = localStorage.getItem(`assignment-${lessonId}`);
      setSelectedAnswers(JSON.parse(data as any));
    }
  }, [refresh, lessonId]);

  useEffect(() => {
    resetState();
    lessonId && getAssignmentDetail(lessonId, true);
  }, [lessonId, assignmentDetail?.assignmentId, refresh]);

  useEffect(() => {
    if (
      assignmentDetail?.content._type === AssignmentType.MCQ &&
      Object.values(selectedAnswers).some((arr) => arr.length)
    ) {
      setFinishDisabled(false);
    } else {
      setFinishDisabled(true);
    }

    if (assignmentDetail?.content._type === AssignmentType.SUBJECTIVE) {
      if (!subjectiveAnswer.answerContent || !subjectiveAnswer?.answerContent?.replace(/(<p><br><\/p>)+$/, "")) {
        setFinishDisabled(true);
      } else {
        setFinishDisabled(false);
      }
    }
  }, [selectedAnswers, subjectiveAnswer]);

  return (
    <>
      {contextHolder}

      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <div className={style.assignment_view_tab}>
          <div className={style.assignment_header}>
            {!loading && (
              <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
                <>
                  {assignmentDetail?.content._type === AssignmentType.SUBJECTIVE && <div></div>}
                  {/* for just UI adjustment */}
                  {!isResultView && assignmentDetail?.content._type === AssignmentType.MCQ && (
                    <h5>
                      Question {currentQuestionIndex + 1}/{questions.length}
                    </h5>
                  )}

                  <Space>
                    {assignmentDetail?.content._type === AssignmentType.MCQ && !isResultView && (
                      <>
                        <>
                          <Button
                            icon={<LeftOutlined />}
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                          />
                          <Button
                            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                            icon={<RightOutlined />}
                            disabled={currentQuestionIndex === questions.length - 1}
                          />
                        </>
                      </>
                    )}

                    {!isResultView && isCompleteBtnDisabled && (
                      <Button type="primary" onClick={() => setResultView(true)}>
                        View final score
                      </Button>
                    )}

                    {userRole === Role.STUDENT &&
                      !isResultView &&
                      !isCompleteBtnDisabled &&
                      assignmentDetail?.status !== submissionStatus.PENDING && (
                        <Popconfirm
                          title={
                            assignmentDetail?.content._type === AssignmentType.MCQ
                              ? "Completed the Quiz?"
                              : "Completed the assessment?"
                          }
                          description={
                            assignmentDetail?.content._type === AssignmentType.MCQ
                              ? "Are you sure you want to submit the answers and complete the quiz?"
                              : "Are you sure you want to submit the answers and complete the assessment?"
                          }
                          onConfirm={onSubmitQuestion}
                          onCancel={() => {}}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            type="primary"
                            loading={saveLoading}
                            style={{
                              background:
                                !!evaluationResult || isCompleteBtnDisabled || finishDisabled
                                  ? ""
                                  : themeColors.commons.success,
                            }}
                            disabled={!!evaluationResult || isCompleteBtnDisabled || finishDisabled}
                          >
                            Finish & complete <ArrowRightOutlined />
                          </Button>
                        </Popconfirm>
                      )}
                  </Space>

                  {assignmentDetail?.content._type === AssignmentType.SUBJECTIVE &&
                    submissionDetail?.status === submissionStatus.PENDING && (
                      <Tag color="orange">Evaluation Pending</Tag>
                    )}
                </>
              </Flex>
            )}
          </div>
          {isResultView && evaluationResult && (
            <Result
              status={submissionDetail?.status === "PASSED" ? "success" : "error"}
              title={`You Scored ${evaluationResult?.score}/${evaluationResult?.maximumScore}`}
              subTitle={`You got ${evaluationResult?.score}/${evaluationResult?.maximumScore} correct answers. You can review the answer or move on to the next lesson`}
              extra={[
                <Button key="buy" onClick={onNextLesson}>
                  Next Lesson
                </Button>,
                <Button type="primary" key="console" onClick={() => setResultView(false)}>
                  Review answers
                </Button>,
              ]}
            />
          )}
          {!isResultView && assignmentDetail?.content._type === AssignmentType.MCQ && questions.length > 0 && (
            <MCQViewAssignment
              question={questions[currentQuestionIndex]}
              selectedAnswers={selectedAnswers}
              handleSelectAnswer={handleSelectAnswer}
              isEvaluated={!!evaluationResult}
            />
          )}
          {!isResultView && assignmentDetail?.content._type === AssignmentType.SUBJECTIVE && subjectiveQuestion && (
            <>
              <SubjectiveAssignmentView
                subjectiveQuestion={subjectiveQuestion}
                isCompleteBtnDisabled={!!submissionDetail}
                subjectiveAnswer={subjectiveAnswer}
                onUploadFileUrl={(url) => setSubjectiveAnswer((prv) => ({ ...prv, answerArchiveUrl: url }))}
                onChangeEditor={(v) => setSubjectiveAnswer((prv) => ({ ...prv, answerContent: v }))}
              />
            </>
          )}
        </div>
      </Spin>
    </>
  );
};

export default AssignmentContentTab;
