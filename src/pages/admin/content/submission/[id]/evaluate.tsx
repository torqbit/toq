import AssignmentService, { ISubmissionDetail } from "@/services/course/AssignmentService";
import {
  Breadcrumb,
  Button,
  Descriptions,
  Drawer,
  Flex,
  Form,
  InputNumber,
  message,
  Modal,
  Segmented,
  Space,
  Spin,
  Tooltip,
} from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "@/styles/AssignmentEvaluation.module.scss";
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
import { AssignmentType, SubjectiveAssignment, SubjectiveSubmissionContent } from "@/types/courses/assignment";
import SubjectiveAssignmentView from "@/components/Assignment/Content/SubjectiveAssignment/SubjectiveAssignmentView";

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
  const evaluateSubmission = () => {
    setEvaluationLoading(true);
    if (!editorValue) {
      setEvaluationLoading(false);
      messageApi.warning("Add a comment first");
      return;
    }
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
      replaceEmptyParagraphs(editorValue),
      Number(form.getFieldsValue().score)
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
              {submissionDetail?.content._type === AssignmentType.SUBJECTIVE && (
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
          <Modal
            maskClosable={false}
            open={open}
            onCancel={() => setOpen(false)}
            onOk={form.submit}
            okButtonProps={{
              disabled: !form.getFieldsValue().score || countAlphabets(replaceEmptyParagraphs(editorValue)) === 0,
            }}
            confirmLoading={evaluationLoading}
          >
            {subjectiveQuestion && (
              <Descriptions title="Grading Parameters" style={{ marginBottom: 20 }}>
                {subjectiveQuestion.gradingParameters.map((grading, index) => (
                  <Descriptions.Item key={index} label={<h5>{grading.questionIndex} : </h5>}>
                    {grading.score} points
                  </Descriptions.Item>
                ))}
              </Descriptions>
            )}
            <Form layout="vertical" form={form} onFinish={evaluateSubmission}>
              <Form.Item
                name="score"
                label="Add Score"
                rules={[
                  { required: true, message: "Add a score" },
                  {
                    type: "number",
                    min: 0,
                    max: maxScore,
                    message: "Invalid score",
                  },
                ]}
              >
                <InputNumber style={{ width: 300 }} placeholder="Input score" />
              </Form.Item>
              <TextEditor
                defaultValue={String(editorValue)}
                handleDefaultValue={setEditorValue}
                readOnly={false}
                theme="snow"
                placeholder="Evaluation Comment"
              />
            </Form>
          </Modal>
          <ViewResult
            score={Number(submissionDetail?.score)}
            comment={String(submissionDetail?.comment)}
            maximumScore={submissionDetail?.maximumScore as number}
            passingScore={submissionDetail?.passingScore as number}
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
