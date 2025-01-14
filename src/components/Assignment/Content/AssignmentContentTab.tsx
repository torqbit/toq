import { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import AssignmentService from "@/services/course/AssignmentService";
import { IAssignmentDetail } from "@/types/courses/Course";
import { Button, Flex, message, Popconfirm, Radio, Space, Spin, Tag } from "antd";
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

import { ArrowRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { areAnswersEqualForKey } from "@/lib/utils";
import { submissionStatus } from "@prisma/client";
import { themeColors } from "@/services/darkThemeConfig";

const AssignmentContentTab: FC<{
  lessonId?: number;
  getEvaluateScore: (assignmentId: number, lessonId: number, courseId: string) => void;
}> = ({ lessonId, getEvaluateScore }) => {
  const router = useRouter();
  const [assignmentDetail, setAssignmentDetail] = useState<IAssignmentDetail>();
  const [submissionDetail, setSubmissionDetail] = useState<IAssignmentSubmissionDetail | null>(null);
  const [evaluatioinResult, setEvaluationResult] = useState<IEvaluationResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<MultipleChoiceQA[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersType>({});
  const [savedAsnwers, setsavedAnswer] = useState<SelectedAnswersType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
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
  useEffect(() => {
    resetState();
    lessonId && getAssignmentDetail(lessonId, true);
  }, [lessonId]);

  const resetState = () => {
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setSelectedAnswers({});
    setSubmissionDetail(null);
  };

  const handleSelectAnswer = (answer: string | number, id: string) => {
    if (submissionDetail && submissionDetail?.status !== submissionStatus.NOT_SUBMITTED) return;
    setSelectedAnswers((prev: Record<number, (string | number)[]>) => {
      const currentAnswers = prev[Number(id)] || [];
      const isSelected = currentAnswers.includes(answer);

      return {
        ...prev,
        [id]: isSelected ? currentAnswers.filter((v: string | number) => v !== answer) : [...currentAnswers, answer],
      };
    });
  };

  const onSubmitQuestion = () => {
    if (
      selectedAnswers[currentQuestionIndex + 1]?.length > 0 &&
      !areAnswersEqualForKey(selectedAnswers[currentQuestionIndex + 1], savedAsnwers[currentQuestionIndex + 1])
    ) {
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
          (result) => {
            messageApi.success({ content: result.message });
            setSaveLoading(false);
            if (currentQuestionIndex + 1 !== questions.length) {
              setCurrentQuestionIndex((prev) => prev + 1);
            }
            setRefresh(!refresh);
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
      return;
    }
    if (currentQuestionIndex + 1 !== questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const getAssignmentSubmission = async () => {
    AssignmentService.getSubmissionContent(
      router.query.slug as string,
      lessonId as number,
      assignmentDetail?.assignmentId as number,
      (submissionContent) => {
        console.log(submissionContent, "dd");
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
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  useEffect(() => {
    getAssignmentSubmission();
  }, [refresh, lessonId]);

  const onClickToEvaluate = async () => {
    if (!submissionDetail?.id) return;
    AssignmentService.completeSubmission(
      router.query.slug as string,
      assignmentDetail?.assignmentId as number,
      lessonId as number,
      submissionDetail.id as number,
      (result) => {
        getEvaluateScore(assignmentDetail?.assignmentId as number, lessonId as number, router.query.slug as string);
        setRefresh(!refresh);
        setLoading(false);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };
  return (
    <>
      {contextHolder}

      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <div className={style.assignmen_view_tab}>
          <div className={style.assignment_header}>
            <Flex justify="space-between" align="center">
              <h5>
                Question {currentQuestionIndex + 1}/{questions.length}
              </h5>
              {submissionDetail && submissionDetail?.status !== submissionStatus.NOT_SUBMITTED && (
                <Tag
                  color={
                    evaluatioinResult?.scoreSummary?.eachQuestionScore[currentQuestionIndex]?.score ===
                    assignmentDetail?.maximumScore
                      ? "green"
                      : "red"
                  }
                  style={{ border: "none", padding: "5px 10px" }}
                >
                  Scored {evaluatioinResult?.scoreSummary?.eachQuestionScore[currentQuestionIndex]?.score}/
                  {assignmentDetail?.maximumScore}
                </Tag>
              )}
            </Flex>
          </div>
          {assignmentDetail?.content._type === AssignmentType.MCQ && questions.length > 0 && (
            <MCQViewAssignment
              question={questions[currentQuestionIndex]}
              selectedAnswers={selectedAnswers}
              handleSelectAnswer={handleSelectAnswer}
            />
          )}

          <Flex justify="space-between" align="center" className={style.assignment_footer}>
            <Space>
              <Button
                icon={<LeftOutlined />}
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              >
                Back
              </Button>
              <Button type="primary" loading={saveLoading} onClick={onSubmitQuestion}>
                {selectedAnswers[currentQuestionIndex + 1]?.length > 0 &&
                !areAnswersEqualForKey(
                  selectedAnswers[currentQuestionIndex + 1],
                  savedAsnwers[currentQuestionIndex + 1]
                )
                  ? "Submit"
                  : evaluatioinResult
                  ? "Next"
                  : "Skip"}
                <RightOutlined />
              </Button>
            </Space>
            <Popconfirm
              title="Finish & complete"
              description="Are you sure want to submit! It can't be undo"
              onConfirm={onClickToEvaluate}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                style={{ background: !!evaluatioinResult ? "" : themeColors.commons.success }}
                disabled={!!evaluatioinResult}
              >
                Finish & complete <ArrowRightOutlined />
              </Button>
            </Popconfirm>
          </Flex>
        </div>
      </Spin>
    </>
  );
};

export default AssignmentContentTab;
