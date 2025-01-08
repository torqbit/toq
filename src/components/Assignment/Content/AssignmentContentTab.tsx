import { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import AssignmentService from "@/services/course/AssignmentService";
import { IAssignmentDetail } from "@/types/courses/Course";
import { Button, Flex, message, Radio, Space, Tag } from "antd";
import SpinLoader from "../../SpinLoader/SpinLoader";
import MCQViewAssignment from "./MCQViewAssignment/MCQViewAssignment";
import {
  AssignmentType,
  IAssignmentSubmissoionDetail,
  MCQAssignment,
  MCQASubmissionContent,
  MultipleChoiceQA,
  SelectedAnswersType,
} from "@/types/courses/assignment";
import { ArrowLeftOutlined, ArrowRightOutlined, CaretLeftFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { areAnswersEqualForKey } from "@/lib/utils";
import { submissionStatus } from "@prisma/client";

const AssignmentContentTab: FC<{ lessonId?: number }> = ({ lessonId }) => {
  const router = useRouter();
  const [assignmentDetail, setAssignmentDetail] = useState<IAssignmentDetail>();
  const [submissionDetail, setSubmissionDetail] = useState<IAssignmentSubmissoionDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<MultipleChoiceQA[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersType>({});
  const [savedAsnwers, setsavedAnswer] = useState<SelectedAnswersType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const getAssignmentDetail = (lessonId: number) => {
    setLoading(true);
    AssignmentService.getAssignment(
      lessonId,
      submissionDetail?.status !== "NOT_SUBMITTED" ? true : false,
      (result) => {
        setAssignmentDetail(result.assignmentDetail);
        if (result.assignmentDetail.content._type === AssignmentType.MCQ) {
          setQuestions((result.assignmentDetail.content as unknown as MCQAssignment).questions);
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
    lessonId && getAssignmentDetail(lessonId);
  }, [lessonId]);

  const resetState = () => {
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setSelectedAnswers({});
    setSubmissionDetail(null);
  };

  const handleSelectAnswer = (answer: string | number, id: string) => {
    if (submissionDetail && submissionDetail?.status !== "NOT_SUBMITTED") return;
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
      (result) => {
        if (result.submissionContent) {
          setSubmissionDetail(result.submissionContent);
        }
        if (result?.submissionContent?.content._type === AssignmentType.MCQ) {
          const content = result.submissionContent.content as MCQASubmissionContent;
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

  useEffect(() => {
    getAssignmentSubmission();
  }, [refresh, lessonId, assignmentDetail?.assignmentId]);

  const onClickToEvaluate = async () => {
    if (!submissionDetail?.id) return;
    AssignmentService.completeSubmission(
      router.query.slug as string,
      assignmentDetail?.assignmentId as number,
      lessonId as number,
      submissionDetail.id as number,
      (result) => {
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
      {loading ? (
        <Flex align="center" justify="center">
          <SpinLoader className="editor_spinner" />
        </Flex>
      ) : (
        <div className={style.assignmen_view_tab}>
          <div className={style.assignment_header}>
            <Flex justify="space-between" align="center">
              <h5>
                Question {currentQuestionIndex + 1}/{questions.length}
              </h5>
              {submissionDetail && submissionDetail?.status !== "NOT_SUBMITTED" && (
                <Tag
                  color={submissionDetail?.isPassed ? "green" : "red"}
                  style={{ border: "none", padding: "5px 10px" }}
                >
                  Scored {submissionDetail?.totalScore}/{submissionDetail?.totalMarks}
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
                  : "Skip"}{" "}
                <RightOutlined />
              </Button>
            </Space>
            <Button
              type="primary"
              color="#70e000"
              disabled={
                !submissionDetail?.id ||
                (submissionDetail && submissionDetail.status !== submissionStatus.NOT_SUBMITTED)
              }
              onClick={onClickToEvaluate}
            >
              Finish & complete <ArrowRightOutlined />
            </Button>
          </Flex>
        </div>
      )}
    </>
  );
};

export default AssignmentContentTab;
