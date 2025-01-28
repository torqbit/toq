import { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import AssignmentService from "@/services/course/AssignmentService";
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
import { submissionStatus } from "@prisma/client";
import { themeColors } from "@/services/darkThemeConfig";
import SubjectiveAssignmentView from "./SubjectiveAssignment/SubjectiveAssignmentView";

const AssignmentContentTab: FC<{
  lessonId?: number;
  onNextLesson: () => void;
}> = ({ lessonId, onNextLesson }) => {
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
  const [isResultView, setResultView] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [isCompleteBtnDisabled, setCompleteBtnDisabled] = useState<boolean>(true);

  const getAssignmentDetail = (lessonId: number, isNoAnswer: boolean) => {
    setLoading(true);
    AssignmentService.getAssignment(
      lessonId,
      isNoAnswer,
      (assignmentDetail) => {
        if (!assignmentDetail.status) {
          setCompleteBtnDisabled(false);
          setResultView(false);
        }
        if (assignmentDetail.content._type === AssignmentType.SUBJECTIVE && assignmentDetail.status) {
          setResultView(false);
        }
        setAssignmentDetail(assignmentDetail);
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
      if (!subjectiveAnswer.answerContent) {
        return messageApi.info({ content: "Please write you answer" });
      }
      if (subjectiveQuestion?.file_for_candidate && !subjectiveAnswer.answerArchiveUrl) {
        return messageApi.info({ content: "Please upload assignment file" });
      }
    }

    if (assignmentDetail?.content._type === AssignmentType.MCQ) {
      if (!selectedAnswers && !selectedAnswers["1"]) {
        return messageApi.info({ content: "You haven't complete any question" });
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

  const getAssignmentSubmission = async (assId: number) => {
    setLoading(true);
    AssignmentService.getSubmissionContent(
      router.query.slug as string,
      lessonId as number,
      assId as number,
      async (submissionContent) => {
        if (submissionContent && submissionContent?.status !== submissionStatus.NOT_SUBMITTED) {
          await getEvaluationResult(submissionContent?.id);
          lessonId && getAssignmentDetail(lessonId, false);
        }
        if (submissionContent) {
          setSubmissionDetail(submissionContent);
        }
        if (submissionContent?.content._type === AssignmentType.MCQ) {
          const content = submissionContent.content as MCQASubmissionContent;
          setSelectedAnswers(content.selectedAnswers);
        } else if (submissionContent?.content._type === AssignmentType.SUBJECTIVE) {
          const content = submissionContent.content as SubjectiveSubmissionContent;
          setSubjectiveAnswer(content);
        } else {
          setSelectedAnswers({});
        }

        setCompleteBtnDisabled(true);
        setLoading(false);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };

  const getEvaluationResult = async (submissionId: number) => {
    AssignmentService.getEvaluationResult(
      router.query.slug as string,
      lessonId as number,
      assignmentDetail?.assignmentId as number,
      submissionId,
      (result) => {
        setEvaluationResult(result);
        setLoading(false);
        if (assignmentDetail?.content._type === AssignmentType.MCQ) {
          setResultView(true);
        }
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const onClickToEvaluate = async (subId: number) => {
    AssignmentService.completeSubmission(
      router.query.slug as string,
      assignmentDetail?.assignmentId as number,
      lessonId as number,
      subId as number,
      async (result) => {
        if (assignmentDetail?.content._type === AssignmentType.MCQ) {
          await getEvaluationResult(subId);
        }
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
    if (assignmentDetail) {
      getAssignmentSubmission(assignmentDetail.assignmentId);
    }
  }, [lessonId, assignmentDetail?.assignmentId, refresh]);

  console.log("result ", !isResultView, submissionDetail);

  return (
    <>
      {contextHolder}

      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <div className={style.assignment_view_tab}>
          <div className={style.assignment_header}>
            {!isResultView && (
              <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
                <>
                  {assignmentDetail?.content._type === AssignmentType.SUBJECTIVE && <div></div>}
                  {/* for just UI adjustment */}
                  {assignmentDetail?.content._type === AssignmentType.MCQ && (
                    <h5>
                      Question {currentQuestionIndex + 1}/{questions.length}
                    </h5>
                  )}

                  <Space>
                    {assignmentDetail?.content._type === AssignmentType.MCQ && (
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

                        {!isResultView && isCompleteBtnDisabled && (
                          <Button type="primary" onClick={() => setResultView(true)}>
                            View final score
                          </Button>
                        )}
                      </>
                    )}

                    {!isResultView && !isCompleteBtnDisabled && (
                      <Popconfirm
                        title="Finish & complete"
                        description="Are you sure want to submit! It can't be undo"
                        onConfirm={onSubmitQuestion}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="primary"
                          loading={saveLoading}
                          style={{
                            background: !!evaluationResult || isCompleteBtnDisabled ? "" : themeColors.commons.success,
                          }}
                          disabled={!!evaluationResult || isCompleteBtnDisabled}
                        >
                          Finish & complete <ArrowRightOutlined />
                        </Button>
                      </Popconfirm>
                    )}
                  </Space>

                  {assignmentDetail?.content._type === AssignmentType.SUBJECTIVE && submissionDetail?.status && (
                    <Tag color="orange">
                      {submissionDetail?.status === submissionStatus.PENDING && "Evaluation Pending"}
                    </Tag>
                  )}
                </>
              </Flex>
            )}
          </div>
          {assignmentDetail?.content._type === AssignmentType.MCQ && isResultView && evaluationResult && (
            <Result
              status={
                evaluationResult?.scoreSummary?.eachQuestionScore[currentQuestionIndex]?.score ===
                assignmentDetail?.maximumScore
                  ? "success"
                  : "error"
              }
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
          {assignmentDetail?.content._type === AssignmentType.SUBJECTIVE && subjectiveQuestion && (
            <>
              <SubjectiveAssignmentView
                subjectiveQuestion={subjectiveQuestion}
                isCompleteBtnDisabled={isCompleteBtnDisabled}
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
