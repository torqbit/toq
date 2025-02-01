import { Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Space, Steps } from "antd";
import styles from "@/styles/AddAssignment.module.scss";
import { FC, useEffect, useState } from "react";
import AssignmentService from "@/services/course/AssignmentService";
import { ResourceContentType } from "@prisma/client";
import { DeleteFilled, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
import FormDisableOverlay from "@/components/Configuration/FormDisableOverlay";
import SubjectiveAssignmentForm from "./SubjectiveAssignment/SubjectiveAssignmentForm";

const AssignmentTypeOptions = [
  {
    title: "Multiple Choice",
    description: "Single or multiple correct answers",
    value: AssignmentType.MCQ,
    disabled: false,
  },
  {
    title: "Subjective",
    description: "Free text answers with option to upload attachments",
    value: AssignmentType.SUBJECTIVE,
    disabled: false,
  },
];

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
  onDeleteResource: (id: number) => void;
  setEdit: (value: boolean) => void;
}> = ({
  setResourceDrawer,
  contentType,
  onRefresh,
  currResId,
  setEdit,
  isEdit,
  showResourceDrawer,
  onDeleteResource,
}) => {
  const [assignmentForm] = Form.useForm();
  const [subjectiveForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [editorValue, setEditorValue] = useState<string>("");
  const [submissionType, setSubmissionType] = useState<AssignmentType>();
  const [questions, setQuestions] = useState<MultipleChoiceQA[]>([createEmptyQuestion("1")]);
  const [current, setCurrent] = useState<number>(0);

  const handleAssignment = async () => {
    // GRADING PARAMETERS CHECK

    if (assignmentForm.getFieldValue("gradingParameters")?.length) {
      const questionScores = assignmentForm.getFieldValue("gradingParameters") as QuestionScore[];
      const sumOfGradingScore = questionScores.reduce(
        (acc, currentValue) => Number(acc) + Number(currentValue.score),
        0
      );
      if (
        submissionType === AssignmentType.SUBJECTIVE &&
        sumOfGradingScore !== Number(assignmentForm.getFieldsValue().maximumScore)
      ) {
        return message.info("Ensure the sum of grading points equals the maximum points.");
      }
    }

    if (!submissionType) return message.error("Please select assignment type");
    if (
      submissionType === AssignmentType.MCQ &&
      questions.length > 0 &&
      questions[0].title === "" &&
      questions[0].options[0].text === "" &&
      questions[0].options[1].text === ""
    ) {
      return message.error("Please complete the questions");
    }
    setLoading(true);
    let progAssignment: IAssignmentDetails;

    // Base object with `_type` for all cases
    const baseAssignment = { _type: submissionType };

    switch (submissionType) {
      case AssignmentType.MCQ:
        progAssignment = {
          ...baseAssignment,
          questions: questions,
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
        message.success(result.message);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        message.error(error);
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
          setSubmissionType(assignmentDetail.content._type);

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
      currResId && !isEdit && onDeleteResource(currResId);
    }
    setResourceDrawer(false);
    assignmentForm.resetFields();
    subjectiveForm.resetFields();
    setQuestions([createEmptyQuestion("1")]);
    setCurrent(0);
    setEditorValue("");
    setSubmissionType(undefined);
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
        currResId && !isEdit && onDeleteResource(currResId);
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
              assignmentForm.submit();
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
        className={styles.ant_steps}
        items={[
          {
            title: (
              <ConfigFormLayout formTitle={"Configure Assignment Type"} width="100%">
                <Form form={assignmentForm} initialValues={{ estimatedDurationInMins: 30 }}>
                  <ConfigForm
                    title="Assignment Title"
                    description="Enter the title of the assignment"
                    input={
                      <Form.Item name="title">
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
                  <ConfigForm
                    input={
                      <Form.Item name="assignmentType">
                        <Radio.Group>
                          <Space style={{ width: "100%" }}>
                            {AssignmentTypeOptions.map((item, i) => (
                              <Radio
                                key={item.value}
                                value={item.value}
                                disabled={item.disabled}
                                onChange={(e) => {
                                  setSubmissionType(e.target.value);
                                  if (current === 0) setCurrent(1);
                                }}
                                className={`assignment_type_radio ${styles.assignment_type_radio}`}
                              >
                                <h5>{item.title}</h5>

                                <p>{item.description}</p>
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    }
                    title={"Assignment Type"}
                    description={
                      "Chose what kind of assignment you want to give in order to assess the skills of the student "
                    }
                    divider={false}
                  />
                </Form>
              </ConfigFormLayout>
            ),
          },
          {
            title: (
              <>
                {submissionType === AssignmentType.MCQ && (
                  <ConfigFormLayout formTitle={"Multiple choice question"} width="100%">
                    <p>
                      Provide the list of questions that will be presented to the learners for completing this
                      assignment
                    </p>
                    <MCQForm questions={questions} setQuestions={setQuestions} />
                    {current < 1 && <FormDisableOverlay message="First complete the previous step" />}
                  </ConfigFormLayout>
                )}

                {submissionType === AssignmentType.SUBJECTIVE && (
                  <ConfigFormLayout formTitle={"Subjective"} width="100%">
                    <p>
                      Provide the list of questions that will be presented to the learners for completing this
                      assignment
                    </p>

                    <SubjectiveAssignmentForm
                      subjectiveForm={subjectiveForm}
                      editorValue={editorValue}
                      setEditorValue={(v) => setEditorValue(v)}
                    />

                    {current < 1 && <FormDisableOverlay message="First complete the previous step" />}
                  </ConfigFormLayout>
                )}
              </>
            ),
          },

          {
            title: (
              <ConfigFormLayout formTitle={"Setup Grading"} width="100%">
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
                        <Input addonAfter="points" type="number" defaultValue="5" />
                      </Form.Item>
                    }
                    title={"Maximum Scores"}
                    description={"This is the max score for the assignment, that will be based on multiple parameters "}
                    divider={false}
                  />
                  {submissionType === AssignmentType.MCQ ? (
                    <ConfigForm
                      input={
                        <Form.Item name="passingScore">
                          <Input addonAfter="%" type="number" defaultValue="80" />
                        </Form.Item>
                      }
                      title={"Passing Scores"}
                      description={"Setup the passing percentage for this assignment"}
                      divider={false}
                    />
                  ) : (
                    <ConfigForm
                      input={
                        <Form.List name="gradingParameters">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} justify="end" gutter={[10, 10]}>
                                  <Col span={3}>
                                    <Button type="text" onClick={() => remove(name)} icon={<DeleteFilled />} />
                                  </Col>
                                  <Col span={10}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "questionIndex"]}
                                      rules={[{ required: true, message: "Please enter any question no" }]}
                                    >
                                      <Input placeholder="Question 01" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={10}>
                                    <Form.Item {...restField} name={[name, "score"]} rules={[{ required: true }]}>
                                      <Input placeholder="points" type="number" addonAfter="points" />
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
                {current < 2 && <FormDisableOverlay message="First complete the previous step" />}
              </ConfigFormLayout>
            ),
          },
        ]}
      />
    </Drawer>
  );
};

export default AddAssignment;
