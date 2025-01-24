import { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import AssignmentService from "@/services/course/AssignmentService";
import { IAssignmentDetail } from "@/types/courses/Course";
import { Button, Flex, message, Popconfirm, Radio, Result, Space, Spin, Tag } from "antd";
import MCQViewAssignment from "./MCQViewAssignment/MCQViewAssignment";
import {
  AssignmentType,
  IAssignmentSubmissionDetail,
  IEvaluationResult,
  MCQAssignment,
  MCQASubmissionContent,
  MultipleChoiceQA,
  SelectedAnswersType,
} from "@/types/courses/assignment";

import { ArrowRightOutlined, LeftOutlined, LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { setLocalStorage } from "@/lib/utils";
import { submissionStatus } from "@prisma/client";
import { themeColors } from "@/services/darkThemeConfig";

const AssignmentContentTab: FC<{
  lessonId?: number;
  onMarkAsCompleted: () => void;
}> = ({ lessonId, onMarkAsCompleted }) => {
  const router = useRouter();
  const [assignmentDetail, setAssignmentDetail] = useState<IAssignmentDetail>();
  const [submissionDetail, setSubmissionDetail] = useState<IAssignmentSubmissionDetail | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<IEvaluationResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<MultipleChoiceQA[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersType>({});
  const [savedAsnwers, setsavedAnswer] = useState<SelectedAnswersType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isResultView, setResultView] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const getAssignmentDetail = (lessonId: number, isNoAnswer: boolean) => {
    setLoading(true);
    AssignmentService.getAssignment(
      lessonId,
      isNoAnswer,
      (assignmentDetail) => {
        setAssignmentDetail(assignmentDetail);
        if (assignmentDetail.content._type === AssignmentType.MCQ) {
          setQuestions((assignmentDetail.content as unknown as MCQAssignment).questions);
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
    setResultView(false);
  };

  const handleSelectAnswer = (answer: string | number, id: string) => {
    if (submissionDetail && submissionDetail?.status !== submissionStatus.NOT_SUBMITTED) return;
    setSelectedAnswers((prev: Record<number, (string | number)[]>) => {
      const currentAnswers = prev[Number(id)] || [];
      const isSelected = currentAnswers.includes(answer);

      const ans = {
        ...prev,
        [id]: isSelected ? currentAnswers.filter((v: string | number) => v !== answer) : [...currentAnswers, answer],
      };

      if (typeof window !== "undefined") {
        setLocalStorage(`assignment-${lessonId}`, ans);
      }
      setsavedAnswer(ans);
      return ans;
    });
  };

  const onSubmitQuestion = () => {
    setSaveLoading(true);
    try {
      let submitData = {
        content: {
          selectedAnswers,
          _type: assignmentDetail?.content._type,
        },
        lessonId: lessonId as number,
        courseId: router.query.slug as string,
        assignmentId: assignmentDetail?.assignmentId as number,
      };
      AssignmentService.saveAssignment(
        submitData,
        async (result) => {
          // messageApi.success({ content: result.message });
          await onClickToEvaluate(result.id);
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

  const getAssignmentSubmission = async () => {
    setLoading(true);
    AssignmentService.getSubmissionContent(
      router.query.slug as string,
      lessonId as number,
      assignmentDetail?.assignmentId as number,
      (submissionContent) => {
        if (submissionContent && submissionContent?.status !== submissionStatus.NOT_SUBMITTED) {
          getEvaluationResult(submissionContent?.id);
          lessonId && getAssignmentDetail(lessonId, false);
        }
        if (submissionContent) {
          setSubmissionDetail(submissionContent);
        }
        if (submissionContent?.content._type === AssignmentType.MCQ) {
          const content = submissionContent.content as MCQASubmissionContent;
          setSelectedAnswers(content.selectedAnswers);
          setsavedAnswer(content.selectedAnswers);
        } else {
          setSelectedAnswers({});
        }
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
        setResultView(true);
        setLoading(false);
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
      (result) => {
        setRefresh(!refresh);
        setSaveLoading(false);
        setCurrentQuestionIndex(0);
        message.success("Assignment evaluated successfully");
      },
      (error) => {
        messageApi.error(error);
        setSaveLoading(false);
      }
    );
  };

  useEffect(() => {
    getAssignmentSubmission();
    if (lessonId && typeof window !== "undefined") {
      const data = localStorage.getItem(`assignment-${lessonId}`);
      setSelectedAnswers(JSON.parse(data as any));
      setsavedAnswer(JSON.parse(data as any));
    }
  }, [refresh, lessonId]);

  useEffect(() => {
    resetState();
    lessonId && getAssignmentDetail(lessonId, true);
  }, [lessonId]);

  return (
    <>
      {contextHolder}

      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <div className={style.assignmen_view_tab}>
          <div className={style.assignment_header}>
            {!isResultView && (
              <Flex justify="space-between" align="center">
                <h5>
                  Question {currentQuestionIndex + 1}/{questions.length}
                </h5>
                <Space>
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
                  {submissionDetail && submissionDetail?.status !== submissionStatus.NOT_SUBMITTED ? (
                    <Button type="primary" onClick={() => setResultView(true)}>
                      View final score
                    </Button>
                  ) : (
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
                        style={{ background: !!evaluationResult ? "" : themeColors.commons.success }}
                        disabled={!!evaluationResult}
                      >
                        Finish & complete <ArrowRightOutlined />
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              </Flex>
            )}
          </div>
          {isResultView && (
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
                <Button key="buy" onClick={onMarkAsCompleted}>
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
        </div>
      </Spin>
    </>
  );
};

export default AssignmentContentTab;
