import { Button, Drawer, Form, FormInstance, Input, InputNumber, message, Segmented, Select, Space } from "antd";
import styles from "@/styles/AddAssignment.module.scss";
import appConstant from "@/services/appConstant";
import TextEditor from "@/components/Editor/Quilljs/Editor";
import { FC, useEffect, useState } from "react";
import AssignmentService from "@/services/AssignmentService";
import { ResourceContentType } from "@prisma/client";
import { CloseOutlined } from "@ant-design/icons";
import { Editor } from "@monaco-editor/react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { IProgrammingLangSubmission, SubmissionType } from "@/types/courses/assignment";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [editorValue, setDefaultValue] = useState<string>();
  const [submissionType, setSubmissionType] = useState<SubmissionType>();
  const [programmingLang, setProgrammingLang] = useState<string>("");
  const [initialCode, setInitialCode] = useState<string>("");
  const { globalState } = useAppContext();
  const handleAssignment = () => {
    setLoading(true);
    if (!submissionType) return message.error("Please select assignment type");
    const progAssignment: IProgrammingLangSubmission = {
      _type: submissionType,
      initialCode: initialCode,
      programmingLang: programmingLang,
    };
    AssignmentService.createAssignment(
      {
        lessonId: Number(currResId),
        assignmentFiles: assignmentForm.getFieldsValue().assignmentFiles,
        title: assignmentForm.getFieldsValue().title,
        submissionType: submissionType,
        submissionConfig: progAssignment,
        content: editorValue,
        isEdit,
        estimatedDuration: assignmentForm.getFieldsValue().estimatedDuration,
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
    if (isEdit) {
      AssignmentService.getAssignment(
        currResId,
        (result) => {
          assignmentForm.setFieldValue("title", result.assignmentDetail.name);
          assignmentForm.setFieldValue("assignmentFiles", result.assignmentDetail.assignmentFiles);
          assignmentForm.setFieldValue("estimatedDuration", result.assignmentDetail.estimatedDuration);

          switch (result.assignmentDetail.submissionConfig._type) {
            case SubmissionType.PROGRAMMING_LANG:
              const submissionConf = result.assignmentDetail.submissionConfig as IProgrammingLangSubmission;
              setSubmissionType(SubmissionType.PROGRAMMING_LANG);
              setInitialCode(submissionConf.initialCode);
              setProgrammingLang(submissionConf.programmingLang);
              assignmentForm.setFieldValue("programmingLang", submissionConf.programmingLang);
              break;
            default:
              break;
          }
          setDefaultValue(result.assignmentDetail.content as string);
        },
        (error) => {}
      );
    }
  }, [currResId, isEdit]);

  const onClose = (closeDrawer: boolean) => {
    if (closeDrawer) {
      currResId && !isEdit && onDeleteResource(currResId);
    }
    setResourceDrawer(false);
    assignmentForm.resetFields();
    setInitialCode("");
    setDefaultValue("");
    onRefresh();
  };

  return (
    <Drawer
      classNames={{ header: styles.headerWrapper, body: styles.body, footer: `${styles.footer} add_assignment_footer` }}
      width={"50vw"}
      maskClosable={false}
      closeIcon={false}
      className={styles.newResDetails}
      title={
        <div className={styles.drawerHeader}>
          <Space className={styles.drawerTitle}>
            <CloseOutlined
              onClick={() => {
                onClose(true);

                setEdit(false);
              }}
            />
            {isEdit ? `Update ${contentType} Details` : `New ${contentType} Details`}
          </Space>
        </div>
      }
      placement="right"
      open={showResourceDrawer}
      footer={
        <Space className={styles.footerBtn}>
          <Button loading={loading} onClick={() => assignmentForm.submit()} type="primary">
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
      <Form form={assignmentForm} onFinish={handleAssignment} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please Enter Title" }]}>
          <Input placeholder="Add a title" />
        </Form.Item>
        <Form.Item label="Submission Type" required>
          <Segmented
            value={submissionType}
            className={`${styles.Segmented_wrapper} segment__wrapper`}
            options={appConstant.submissionTypes}
            onChange={(value) => {
              setSubmissionType(value as SubmissionType);
            }}
          />
        </Form.Item>

        {submissionType === "PROGRAMMING_LANG" && (
          <Form.Item
            name="programmingLang"
            label="Select Programming Lang"
            rules={[{ required: true, message: "Please Select a Lang" }]}
          >
            <Select placeholder="Select assignment type" onSelect={setProgrammingLang}>
              {appConstant.programmingLanguages.map((lang, i) => {
                return (
                  <Select.Option key={i} value={`${lang.key}`}>
                    {lang.value}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        )}

        {submissionType === "PROGRAMMING_LANG" && programmingLang && (
          <Form.Item label="Initial Code">
            <Editor
              width={"100%"}
              className={styles.code__editor_container}
              theme={globalState.theme === "dark" ? "vs-dark" : "light"}
              height={"250px"}
              language={programmingLang}
              value={initialCode}
              onChange={(e) => setInitialCode(e?.toString() || "")}
              options={{ formatOnType: true }}
              // onMount={handleEditorDidMount}
            />
          </Form.Item>
        )}

        <Form.Item
          name="estimatedDuration"
          label="Estimated Duration ( in minutes )"
          rules={[{ required: true, message: "Please Enter Duration" }]}
        >
          <InputNumber type="number" style={{ width: "100%" }} placeholder="Add a estimatd duration" />
        </Form.Item>

        <TextEditor
          defaultValue={editorValue as string}
          handleDefaultValue={setDefaultValue}
          readOnly={false}
          height={300}
          theme="snow"
          placeholder={`Start writing your ${contentType.toLowerCase()}`}
        />
      </Form>
    </Drawer>
  );
};

export default AddAssignment;
