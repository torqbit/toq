import AssignmentService, { IScoreSummary, ISubmissionDetail } from "@/services/course/AssignmentService";
import {
  Breadcrumb,
  Button,
  Descriptions,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Segmented,
  Space,
  Spin,
  Steps,
  Tooltip,
} from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "@/styles/AssignmentEvaluation.module.scss";
import styles from "@/styles/AddAssignment.module.scss";
import TextEditor from "@/components/Editor/Quilljs/Editor";
import appConstant from "@/services/appConstant";
import { SegmentedValue } from "antd/es/segmented";
import { countAlphabets, getCookieName, mapToArray, replaceEmptyParagraphs } from "@/lib/utils";
import PreviewAssignment from "@/components/Assignment/Submissions/PreviewAssignment";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { useAppContext } from "@/components/ContextApi/AppContext";
import ViewResult from "@/components/Assignment/Submissions/ViewResult";
import AssignmentCodeEditor from "@/components/Assignment/Submissions/AssignmentCodeEditor";
import { submissionStatus } from "@prisma/client";
import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  AssignmentType,
  QuestionScore,
  SubjectiveAssignment,
  SubjectiveSubmissionContent,
} from "@/types/courses/assignment";
import SubjectiveAssignmentView from "@/components/Assignment/Content/SubjectiveAssignment/SubjectiveAssignmentView";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ConfigForm from "@/components/Configuration/ConfigForm";

const EvaluatePage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluationLoading, setEvaluationLoading] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const router = useRouter();
  const [submissionDetail, setSubmissionDetail] = useState<ISubmissionDetail>();
  const [subjectiveSubmission, setSubjectiveSubmission] = useState<SubjectiveSubmissionContent | null>(null);
  const [subjectiveQuestion, setSubjectiveQuestion] = useState<SubjectiveAssignment | null>(null);
  const [maxScore, setMaxScore] = useState<number>(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [editorValue, setEditorValue] = useState<string>("");
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [refresh, SetRefresh] = useState<boolean>(false);

  const getSubmissionDetail = () => {
    setLoading(true);
    try {
      AssignmentService.getSubmissionDetail(
        Number(router.query.id),
        (result) => {
          setSubmissionDetail(result);
          if (result.content._type === AssignmentType.SUBJECTIVE) {
            const assignContent = result.assignContent as unknown as SubjectiveAssignment;
            setSubjectiveSubmission(result.content as unknown as SubjectiveSubmissionContent);
            setSubjectiveQuestion(assignContent);

            const totalScore = assignContent.gradingParameters.reduce(
              (acc, currentValue) => Number(acc) + Number(currentValue.score),
              0
            );
            setMaxScore(totalScore);
          }
          setLoading(false);
        },
        (error) => {
          messageApi.error(error);
          setLoading(false);
        }
      );
    } catch (error: any) {
      messageApi.error(error);
      setLoading(false);
    }
  };
  const evaluateSubmission = async () => {
    await form.validateFields();
    setEvaluationLoading(true);
    AssignmentService.completeSubmission(
      router.query.slug as string,
      Number(submissionDetail?.assignmentId),
      submissionDetail?.lessonId as number,
      Number(router.query.id),

      async (result) => {
        messageApi.success(result.message);
        form.resetFields();
        setOpen(false);
        setEvaluationLoading(false);
        SetRefresh(!refresh);
        message.success("Assignment evaluated successfully");
      },
      (error) => {
        console.log(error);
        messageApi.error(error);
        setEvaluationLoading(false);
      },
      form.getFieldsValue()
    );
  };

  useEffect(() => {
    if (router.query.id) {
      getSubmissionDetail();
    }
  }, [router.query.id, refresh]);
  return (
    <AppLayout siteConfig={siteConfig}>
      {contextHolder}
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <section className={style.evaluationWrapper}>
          <Breadcrumb
            className={style.breadcrumb}
            items={[
              {
                title: <Link href={`/admin/content`}>admin</Link>,
              },
              {
                title: <Link href={`/admin/content`}>content</Link>,
              },
              {
                title: "Submission",
              },
              {
                title: `${submissionDetail?.assignmentName}`,
              },
              {
                title: `${submissionDetail?.score && submissionDetail?.score > 0 ? "result" : "evaluate"}`,
              },
            ]}
          />
          <Space direction="vertical" style={{ marginTop: 30 }}>
            <Flex align="center" justify="space-between">
              {submissionDetail?.content._type === AssignmentType.SUBJECTIVE &&
              subjectiveSubmission?.answerArchiveUrl ? (
                <Tooltip title="Download submitted file">
                  <Button
                    target="_blank"
                    href={`/download/private-file?fileUrl=${subjectiveSubmission?.answerArchiveUrl}`}
                    download
                    icon={<DownloadOutlined />}
                  >
                    Submitted file
                  </Button>
                </Tooltip>
              ) : (
                <div></div>
              )}
              <>
                {submissionDetail?.isEvaluated ? (
                  <Button onClick={() => setDrawerOpen(true)} type="primary">
                    View Result
                  </Button>
                ) : (
                  <Button onClick={() => setOpen(true)} type="primary">
                    Evaluate
                  </Button>
                )}
              </>
            </Flex>
            <section className={style.submission_view_content}>
              {submissionDetail?.content._type === AssignmentType.SUBJECTIVE &&
                subjectiveSubmission &&
                subjectiveQuestion && (
                  <SubjectiveAssignmentView
                    subjectiveQuestion={subjectiveQuestion}
                    isCompleteBtnDisabled={true}
                    subjectiveAnswer={subjectiveSubmission}
                    onUploadFileUrl={() => {}}
                    onChangeEditor={(v) => {}}
                    evaluate={true}
                  />
                )}
            </section>
          </Space>
          <Drawer
            title="Evaluate Submission"
            placement="right"
            width={600}
            onClose={() => setOpen(false)}
            open={open}
            extra={
              <Button
                type="primary"
                onClick={form.submit}
                loading={evaluationLoading}
                // disabled={!form.getFieldsValue().score || countAlphabets(replaceEmptyParagraphs(editorValue)) === 0}
              >
                Submit Evaluation
              </Button>
            }
          >
            <Steps
              current={subjectiveQuestion?.gradingParameters?.length}
              status="finish"
              size="small"
              progressDot
              direction="vertical"
              className={styles.ant_steps_container}
              items={subjectiveQuestion?.gradingParameters.map((grading, index) => {
                return {
                  title: (
                    <ConfigFormLayout formTitle={`${grading.questionIndex}`} width="530px">
                      <Form form={form} onFinish={evaluateSubmission}>
                        <ConfigForm
                          title="Award points"
                          divider
                          description="The points will be added to the total score for this assessment"
                          input={
                            <Form.Item
                              name={[index, "score"]}
                              rules={[
                                { required: true, message: "Add a score" },
                                {
                                  type: "number",
                                  min: 0,
                                  max: grading.score,
                                  message: "Invalid score",
                                },
                              ]}
                            >
                              <InputNumber
                                min={0}
                                max={grading.score}
                                addonAfter={`/${grading.score}`}
                                style={{ width: 150 }}
                              />
                            </Form.Item>
                          }
                        />
                        <ConfigForm
                          title="Comments"
                          layout="vertical"
                          description="Add descriptive comments to help the student to understand the feedback provided"
                          input={
                            <Form.Item
                              name={[index, "comment"]}
                              rules={[
                                { required: false, message: `Please enter comment for ${grading.questionIndex}` },
                              ]}
                            >
                              <Input.TextArea rows={4} placeholder="Add your comments here" />
                            </Form.Item>
                          }
                        />
                      </Form>
                    </ConfigFormLayout>
                  ),
                };
              })}
            />
          </Drawer>
          <ViewResult
            score={Number(submissionDetail?.score)}
            comment={String(submissionDetail?.comment)}
            maximumScore={submissionDetail?.maximumScore as number}
            passingScore={submissionDetail?.passingScore as number}
            scoreSummary={submissionDetail?.scoreSummary && JSON.parse(submissionDetail?.scoreSummary as any)}
            gradingParameter={subjectiveQuestion?.gradingParameters as QuestionScore[]}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        </section>
      </Spin>
    </AppLayout>
  );
};

export default EvaluatePage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  const { site } = getSiteConfig();
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  const findAuthor = await prisma?.assignmentSubmission.findUnique({
    where: {
      id: Number(params?.id),
      NOT: {
        status: submissionStatus.NOT_SUBMITTED,
      },
    },
    select: {
      assignment: {
        select: {
          lesson: {
            select: {
              chapter: {
                select: {
                  course: {
                    select: {
                      authorId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (user?.id === findAuthor?.assignment.lesson.chapter.course.authorId) {
    return {
      props: {
        siteConfig: site,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/admin/content",
      },
    };
  }
};
