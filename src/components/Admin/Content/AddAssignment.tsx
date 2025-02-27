import { Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Space, Steps } from "antd";
import styles from "@/styles/AddAssignment.module.scss";
import { FC, useEffect, useState } from "react";
import AssignmentService from "@/services/course/AssignmentService";
import { ResourceContentType } from "@prisma/client";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import {
  IAssignmentDetails,
  AssignmentType,
  MultipleChoiceQA,
  MCQAssignment,
  SubjectiveAssignment,
  QuestionScore,
} from "@/types/courses/assignment";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ConfigForm from "@/components/Configuration/ConfigForm";
import MCQForm from "./MCQForm/MCQForm";
import SubjectiveAssignmentForm from "./SubjectiveAssignment/SubjectiveAssignmentForm";
import { cleanEmptyOptions, findEmptyCorrectOptions, findEmptyGivenOptions } from "@/services/helper";
import { MessageInstance } from "antd/es/message/interface";

export const createEmptyQuestion = (id: string): MultipleChoiceQA => ({
  id,
  title: "",
  description: "",
  options: [
    { key: "A", text: "" },
    { key: "B", text: "" },
  ],
  correctOptionIndex: [],
  answerExplanation: "",
});

const AddAssignment: FC<{
  setResourceDrawer: (value: boolean) => void;
  isEdit: boolean;
  currResId: number;
  contentType: ResourceContentType;
  showResourceDrawer: boolean;
  onRefresh: () => void;
  onDeleteResource: (id: number, isCanceled: boolean) => void;
  setEdit: (value: boolean) => void;
  lessonType: AssignmentType;
  messageApi: MessageInstance;
}> = ({
  setResourceDrawer,
  contentType,
  onRefresh,
  currResId,
  setEdit,
  isEdit,
  showResourceDrawer,
  onDeleteResource,
  lessonType,
  messageApi,
}) => {
  const [assignmentForm] = Form.useForm();
  const [subjectiveForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [editorValue, setEditorValue] = useState<string>("");
  const [questions, setQuestions] = useState<MultipleChoiceQA[]>([createEmptyQuestion("1")]);
  const [current, setCurrent] = useState<number>(0);
  const [assignmentType, setAssignmentType] = useState<AssignmentType>(lessonType);

  const handleAssignment = async () => {
    // GRADING PARAMETERS CHECK

    await assignmentForm.validateFields();
    if (assignmentType === AssignmentType.SUBJECTIVE) {
      if (assignmentForm.getFieldValue("gradingParameters")?.length) {
        const questionScores = assignmentForm.getFieldValue("gradingParameters") as QuestionScore[];
        const sumOfGradingScore = questionScores.reduce(
          (acc, currentValue) => Number(acc) + Number(currentValue.score),
          0
        );
        if (sumOfGradingScore !== Number(assignmentForm.getFieldsValue().maximumScore)) {
          return messageApi.info({ content: "Ensure the sum of grading points equals the maximum points." });
        }
      } else {
        return messageApi.info({ content: "Add atleast one grading parameter" });
      }
      if (editorValue.replace(/(<p><br><\/p>)+$/, "") === "") {
        return messageApi.info({ content: "Please add some description for assignment" });
      }
    }
    if (
      assignmentType === AssignmentType.MCQ &&
      questions.length > 0 &&
      questions[0].title === "" &&
      questions[0].options[0].text === "" &&
      questions[0].options[1].text === ""
    ) {
      return messageApi.error({ content: "Please complete the questions" });
    }

    if (assignmentType === AssignmentType.MCQ) {
      const indices = findEmptyCorrectOptions(questions);
      const givenOptionIndeices = findEmptyGivenOptions(questions);
      if (indices.length > 0) {
        return messageApi.info({
          content: `Please select a correct answer key for question ${indices.map((v) => v + 1).join(",")}`,
        });
      }
      if (givenOptionIndeices.length > 0) {
        return messageApi.info({
          content: `Please give at least two option to choose the answer in question  ${indices
            .map((v) => v + 1)
            .join(",")}`,
        });
      }
    }

    setLoading(true);
    let progAssignment: IAssignmentDetails;

    // Base object with `_type` for all cases
    const baseAssignment = { _type: assignmentType };

    switch (assignmentType) {
      case AssignmentType.MCQ:
        progAssignment = {
          ...baseAssignment,
          questions: cleanEmptyOptions(questions),
        } as MCQAssignment;
        break;

      case AssignmentType.SUBJECTIVE: {
        const { file_for_candidate, archiveUrl: projectArchiveUrl } = subjectiveForm.getFieldsValue();
        progAssignment = {
          ...baseAssignment,
          description: editorValue,
          file_for_candidate: file_for_candidate,
          projectArchiveUrl: projectArchiveUrl,
          gradingParameters: assignmentForm.getFieldValue("gradingParameters"),
        } as SubjectiveAssignment;
        break;
      }

      default:
        progAssignment = { ...baseAssignment } as IAssignmentDetails;
        break;
    }

    AssignmentService.createAssignment(
      {
        lessonId: Number(currResId),
        title: assignmentForm.getFieldsValue().title,
        estimatedDurationInMins: assignmentForm.getFieldsValue().estimatedDurationInMins || 30,
        maximumScore: Number(assignmentForm.getFieldsValue().maximumScore),
        passingScore: Number(assignmentForm.getFieldsValue().passingScore) || 0,
        isEdit,
        details: progAssignment,
      },
      (result) => {
        onClose(false);
        messageApi.success({ content: "Assignment has been saved" });
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        messageApi.error({ content: error });
      }
    );
    setLoading(false);
  };

  useEffect(() => {
    setQuestions([createEmptyQuestion("1")]);
    if (isEdit) {
      AssignmentService.getAssignment(
        currResId,
        false,
        (assignmentDetail) => {
          assignmentForm.setFieldValue("title", assignmentDetail.name);
          assignmentForm.setFieldValue("estimatedDurationInMins", assignmentDetail.estimatedDurationInMins);
          assignmentForm.setFieldValue("assignmentType", assignmentDetail.content._type);
          setAssignmentType(assignmentDetail.content._type);

          switch (assignmentDetail.content._type) {
            case AssignmentType.MCQ:
              const content = assignmentDetail.content as MCQAssignment;
              setQuestions(content.questions);
              setCurrent(1);
              break;
            case AssignmentType.SUBJECTIVE:
              const subjectiveContent = assignmentDetail.content as SubjectiveAssignment;
              subjectiveForm.setFieldValue("file_for_candidate", subjectiveContent.file_for_candidate);
              assignmentForm.setFieldValue("gradingParameters", subjectiveContent.gradingParameters);
              subjectiveForm.setFieldValue("archiveUrl", subjectiveContent.projectArchiveUrl);
              setEditorValue(subjectiveContent.description);
              setCurrent(1);
              break;
            default:
              break;
          }

          if (assignmentDetail.maximumScore || assignmentDetail.passingScore) {
            assignmentForm.setFieldValue("maximumScore", assignmentDetail.maximumScore);
            assignmentForm.setFieldValue("passingScore", assignmentDetail.passingScore);
            setCurrent(2);
          }
        },
        (error) => {}
      );
    }
  }, [currResId, isEdit]);

  useEffect(() => {
    if (editorValue) {
      setCurrent(2);
    }
    if (
      questions.length > 0 &&
      questions[0].title !== "" &&
      questions[0].options[0].text !== "" &&
      questions[0].options[1].text !== ""
    ) {
      setCurrent(2);
    }
  }, [questions, editorValue]);

  const onClose = (closeDrawer: boolean) => {
    if (closeDrawer) {
      currResId && !isEdit && onDeleteResource(currResId, true);
    }
    setResourceDrawer(false);
    assignmentForm.resetFields();
    subjectiveForm.resetFields();
    setQuestions([createEmptyQuestion("1")]);
    setCurrent(0);
    setEditorValue("");
    onRefresh();
  };

  return (
    <Drawer
      classNames={{ header: styles.headerWrapper, body: styles.body, footer: `${styles.footer} add_assignment_footer` }}
      width={"55vw"}
      maskClosable={false}
      closeIcon={true}
      onClose={() => {
        setQuestions([createEmptyQuestion("1")]);
        currResId && !isEdit && onDeleteResource(currResId, true);
        setResourceDrawer(false);
        assignmentForm.resetFields();
        onRefresh();
      }}
      className={styles.newResDetails}
      title={
        <div className={styles.drawerHeader}>
          <Space className={styles.drawerTitle}>
            {isEdit ? `Update ${contentType} Details` : `New ${contentType} Details`}
          </Space>
        </div>
      }
      placement="right"
      open={showResourceDrawer}
      footer={
        <Space className={styles.footerBtn}>
          <Button
            loading={loading}
            onClick={() => {
              handleAssignment();
              subjectiveForm.submit();
            }}
            type="primary"
          >
            {isEdit ? "Update" : "Save Lesson"}
          </Button>
          <Button
            type="default"
            onClick={() => {
              onClose(true);
              setEdit(false);
            }}
          >
            Cancel
          </Button>
        </Space>
      }
    >
      <Steps
        current={current}
        status="finish"
        size="small"
        progressDot
        direction="vertical"
        className={styles.ant_steps_container}
        items={[
          {
            title: (
              <ConfigFormLayout formTitle={"Configure Assignment Type"} width="760px">
                <Form form={assignmentForm} initialValues={{ estimatedDurationInMins: 30 }}>
                  <ConfigForm
                    title="Assignment Title"
                    description="Enter the title of the assignment"
                    input={
                      <Form.Item name="title" rules={[{ required: true }]}>
                        <Input placeholder="Enter the title of the assignment" />
                      </Form.Item>
                    }
                  />

                  <ConfigForm
                    title="Estimated Duration"
                    description="Enter the estimated duration in minutes"
                    input={
                      <Form.Item name="estimatedDurationInMins">
                        <InputNumber placeholder="" defaultValue={30} />
                      </Form.Item>
                    }
                  />
                </Form>
              </ConfigFormLayout>
            ),
          },
          {
            title: (
              <>
                {assignmentType === AssignmentType.MCQ && (
                  <ConfigFormLayout formTitle={"Multiple choice question"} width="760px">
                    <p>
                      Provide the list of questions that will be presented to the learners for completing this
                      assignment
                    </p>
                    <MCQForm questions={questions} setQuestions={setQuestions} />
                  </ConfigFormLayout>
                )}

                {assignmentType === AssignmentType.SUBJECTIVE && (
                  <ConfigFormLayout formTitle={"Subjective"} width="760px">
                    <p>
                      Provide the list of questions that will be presented to the learners for completing this
                      assignment
                    </p>

                    <SubjectiveAssignmentForm
                      subjectiveForm={subjectiveForm}
                      editorValue={editorValue}
                      setEditorValue={(v) => setEditorValue(v)}
                    />
                  </ConfigFormLayout>
                )}
              </>
            ),
          },

          {
            title: (
              <ConfigFormLayout formTitle={"Setup Grading"} width="760px">
                <Form
                  form={assignmentForm}
                  initialValues={{
                    maximumScore: 5,
                    passingScore: 80,
                    gradingParameters: [{ questionIndex: "", score: 0 }],
                  }}
                >
                  <ConfigForm
                    input={
                      <Form.Item name="maximumScore">
                        <InputNumber addonAfter="points" type="number" defaultValue="5" />
                      </Form.Item>
                    }
                    title={"Maximum Scores"}
                    description={"This is the max score for the assignment, that will be based on multiple parameters "}
                    divider={false}
                  />

                  <ConfigForm
                    input={
                      <Form.Item name="passingScore">
                        <InputNumber addonAfter="%" type="number" defaultValue="80" />
                      </Form.Item>
                    }
                    title={"Passing Scores"}
                    description={"Setup the passing percentage for this assignment"}
                    divider={false}
                  />
                  {assignmentType === AssignmentType.SUBJECTIVE && (
                    <ConfigForm
                      input={
                        <Form.List name="gradingParameters">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} justify="end" gutter={[10, 10]}>
                                  <Col span={3}>
                                    <Button
                                      type="text"
                                      disabled={fields.length === 1}
                                      onClick={() => remove(name)}
                                      icon={<DeleteFilled />}
                                    />
                                  </Col>
                                  <Col span={10}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "questionIndex"]}
                                      rules={[{ required: true, message: "Required question no" }]}
                                    >
                                      <Input placeholder="e.g. Parameter Name" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={10}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "score"]}
                                      rules={[{ required: true }, { type: "number", min: 0 }]}
                                    >
                                      <InputNumber min={0} placeholder="points" type="number" addonAfter="points" />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              ))}

                              <Space size={2} onClick={() => add()} style={{ cursor: "pointer", marginLeft: 53 }}>
                                <PlusOutlined /> <span>Add another parameter</span>
                              </Space>
                            </>
                          )}
                        </Form.List>
                      }
                      title={"Grading Parameters"}
                      description={"Add additional parameter, based on with total points will be calculated"}
                      divider={false}
                    />
                  )}
                </Form>
              </ConfigFormLayout>
            ),
          },
        ]}
      />
    </Drawer>
  );
};

export default AddAssignment;
