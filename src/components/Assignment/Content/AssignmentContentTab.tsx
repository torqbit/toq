import { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import AssignmentService from "@/services/course/AssignmentService";
import { IAssignmentDetail } from "@/types/courses/Course";
import { Button, Flex, message, Popconfirm, Radio, Space, Spin, Tag, Tooltip } from "antd";
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
import { areAnswersEqualForKey } from "@/lib/utils";
import { submissionStatus } from "@prisma/client";
import { themeColors } from "@/services/darkThemeConfig";
import SubjectiveAssignmentView from "./SubjectiveAssignment/SubjectiveAssignmentView";
import DownloadInvoice from "@/pages/setting/invoice/download/[invoiceId]";

const AssignmentContentTab: FC<{
  lessonId?: number;
  getEvaluateScore: (assignmentId: number, lessonId: number, courseId: string) => void;
}> = ({ lessonId, getEvaluateScore }) => {
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
  const [savedAsnwers, setsavedAnswer] = useState<SelectedAnswersType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isCompleteBtnDisabled, setCompleteBtnDisabled] = useState<boolean>(false);

  const getAssignmentDetail = (lessonId: number, isNoAnswer: boolean) => {
    setLoading(true);
    AssignmentService.getAssignment(
      lessonId,
      isNoAnswer,
      (assignmentDetail) => {
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
  useEffect(() => {
    resetState();
    lessonId && getAssignmentDetail(lessonId, true);
  }, [lessonId]);

  const resetState = () => {
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setsavedAnswer({});
    setSelectedAnswers({});
    setSubmissionDetail(null);
    setEvaluationResult(null);
    setSubjectiveAnswer({ answerArchiveUrl: "", answerContent: "", _type: AssignmentType.MCQ });
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
    setSaveLoading(true);
    try {
      let submitData: any = {
        content: {
          _type: assignmentDetail?.content._type,
        },
        lessonId: lessonId as number,
        courseId: router.query.slug as string,
        assignmentId: assignmentDetail?.assignmentId as number,
      };

      switch (assignmentDetail?.content._type) {
        case AssignmentType.MCQ:
          submitData.content = { ...submitData.content, selectedAnswers };
          break;

        case AssignmentType.SUBJECTIVE: {
          submitData.content = { ...submitData.content, ...subjectiveAnswer };
          break;
        }
        default:
          break;
      }

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
  };

  const getAssignmentSubmission = async () => {
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
        } else if (submissionContent?.content._type === AssignmentType.SUBJECTIVE) {
          const content = submissionContent.content as SubjectiveSubmissionContent;
          setSubjectiveAnswer(content);
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

  const checkIsCompleteBtnDisabled = () => {
    if (!!evaluationResult && !!submissionDetail) {
      setCompleteBtnDisabled(true);
    } else {
      setCompleteBtnDisabled(false);
    }
  };

  useEffect(() => {
    checkIsCompleteBtnDisabled();
  }, [evaluationResult, lessonId]);

  const onClickToEvaluate = async () => {
    if (assignmentDetail?.content._type === AssignmentType.SUBJECTIVE) {
      onSubmitQuestion();
      return;
    }
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
        <div className={style.assignment_view_tab}>
          <div className={style.assignment_header}>
            <Flex justify="space-between" align="center">
              {assignmentDetail?.content._type === AssignmentType.MCQ ? (
                <h5>
                  Question {currentQuestionIndex + 1}/{questions.length}
                </h5>
              ) : (
                <div></div>
              )}

              {assignmentDetail?.content._type === AssignmentType.SUBJECTIVE &&
                subjectiveQuestion?.projectArchiveUrl && (
                  <Tooltip title="Download assignment file">
                    <Button
                      type="primary"
                      target="_blank"
                      href={`/download/private-file?fileUrl=${subjectiveQuestion.projectArchiveUrl}`}
                      download
                      icon={<DownloadOutlined />}
                    />
                  </Tooltip>
                )}

              {submissionDetail && submissionDetail?.status !== submissionStatus.NOT_SUBMITTED && (
                <Tag
                  color={
                    evaluationResult?.scoreSummary?.eachQuestionScore[currentQuestionIndex]?.score ===
                    assignmentDetail?.maximumScore
                      ? "green"
                      : "red"
                  }
                  style={{ border: "none", padding: "5px 10px" }}
                >
                  Scored {evaluationResult?.scoreSummary?.eachQuestionScore[currentQuestionIndex]?.score}/
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
              isEvaluated={!!evaluationResult}
            />
          )}
          {assignmentDetail?.content._type === AssignmentType.SUBJECTIVE && subjectiveQuestion && (
            <SubjectiveAssignmentView
              subjectiveQuestion={subjectiveQuestion}
              subjectiveAnswer={subjectiveAnswer}
              onUploadFileUrl={(url) => setSubjectiveAnswer((prv) => ({ ...prv, answerArchiveUrl: url }))}
              onChangeEditor={(v) => setSubjectiveAnswer((prv) => ({ ...prv, answerContent: v }))}
            />
          )}

          <Flex justify="space-between" align="center" className={style.assignment_footer}>
            {assignmentDetail?.content._type === AssignmentType.MCQ && (
              <Space>
                <Button
                  icon={<LeftOutlined />}
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  loading={saveLoading}
                  onClick={onSubmitQuestion}
                  disabled={!!evaluationResult && currentQuestionIndex === questions.length - 1}
                >
                  {selectedAnswers[currentQuestionIndex + 1]?.length > 0 &&
                  !areAnswersEqualForKey(
                    selectedAnswers[currentQuestionIndex + 1],
                    savedAsnwers[currentQuestionIndex + 1]
                  )
                    ? "Submit"
                    : evaluationResult
                    ? "Next"
                    : "Skip"}
                  <RightOutlined />
                </Button>
              </Space>
            )}

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
                style={{ background: isCompleteBtnDisabled ? "" : themeColors.commons.success }}
                disabled={isCompleteBtnDisabled}
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
