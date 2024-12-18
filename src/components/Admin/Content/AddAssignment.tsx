import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Segmented,
  Select,
  Space,
  Upload,
  UploadProps,
} from "antd";
import styles from "@/styles/AddAssignment.module.scss";
import appConstant from "@/services/appConstant";
import TextEditor from "@/components/Editor/Quilljs/Editor";
import { FC, useEffect, useState } from "react";
import AssignmentService from "@/services/AssignmentService";
import { ResourceContentType } from "@prisma/client";
import { CloseOutlined, DeleteOutlined, FileZipOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { Editor } from "@monaco-editor/react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import {
  IAssignmentSubmission,
  IFileSubmission,
  IProgrammingLangSubmission,
  IProgrammingProjectSubmission,
  ITextSubmissionContent,
  IUrlSubmission,
  SubmissionType,
} from "@/types/courses/assignment";
const { Dragger } = Upload;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

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
  const [editorValue, setDefaultValue] = useState<string>();
  const [submissionType, setSubmissionType] = useState<SubmissionType>();
  const [programmingLang, setProgrammingLang] = useState<string>("");
  const [archiveUrl, setArchiveUrl] = useState<string>("");
  const [initialCode, setInitialCode] = useState<string>("");
  const { globalState } = useAppContext();
  const handleAssignment = () => {
    if (!archiveUrl) return message.error("Please upload starter project template");
    if (!submissionType) return message.error("Please select assignment type");
    let progAssignment: IAssignmentSubmission;

    // Base object with `_type` for all cases
    const baseAssignment = { _type: submissionType };

    switch (submissionType) {
      case SubmissionType.PROGRAMMING_LANG:
        progAssignment = {
          ...baseAssignment,
          initialCode,
          programmingLang,
        } as IProgrammingLangSubmission;
        break;

      case SubmissionType.PROGRAMMING_PROJECT: {
        const { projectFramework, archiveUrl } = assignmentForm.getFieldsValue();
        setArchiveUrl(archiveUrl);
        progAssignment = {
          ...baseAssignment,
          framework: projectFramework,
          baseProjectArchiveUrl: archiveUrl,
        } as IProgrammingProjectSubmission;
        break;
      }

      case SubmissionType.FILE: {
        const { fileExts } = assignmentForm.getFieldsValue();
        progAssignment = {
          ...baseAssignment,
          fileExts,
        } as IFileSubmission;
        break;
      }

      case SubmissionType.URL:
        progAssignment = {
          ...baseAssignment,
        } as IUrlSubmission;
        break;

      case SubmissionType.TEXT:
        progAssignment = {
          ...baseAssignment,
          text: editorValue,
        } as ITextSubmissionContent;
        break;

      default:
        progAssignment = { ...baseAssignment } as IAssignmentSubmission;
        break;
    }

    AssignmentService.createAssignment(
      {
        lessonId: Number(currResId),
        assignmentFiles: assignmentForm.getFieldsValue().assignmentFiles,
        title: assignmentForm.getFieldsValue().title,
        submissionConfig: progAssignment,
        content: editorValue,
        isEdit,
        estimatedDuration: assignmentForm.getFieldsValue().estimatedDuration,
      },
      (result) => {
        onClose(false);
        message.success(result.message);
      },
      (error) => {
        message.error(error);
      }
    );
  };

  useEffect(() => {
    if (isEdit) {
      AssignmentService.getAssignment(
        currResId,
        (result) => {
          assignmentForm.setFieldValue("title", result.assignmentDetail.name);
          assignmentForm.setFieldValue("assignmentFiles", result.assignmentDetail.assignmentFiles);
          assignmentForm.setFieldValue("estimatedDuration", result.assignmentDetail.estimatedDuration);
          setSubmissionType(result.assignmentDetail.submissionConfig._type);

          switch (result.assignmentDetail.submissionConfig._type) {
            case SubmissionType.PROGRAMMING_LANG:
              const submissionConf = result.assignmentDetail.submissionConfig as IProgrammingLangSubmission;
              setInitialCode(submissionConf.initialCode);
              setProgrammingLang(submissionConf.programmingLang);
              assignmentForm.setFieldValue("programmingLang", submissionConf.programmingLang);
              break;
            case SubmissionType.PROGRAMMING_PROJECT:
              const submissionConf2 = result.assignmentDetail.submissionConfig as IProgrammingProjectSubmission;
              assignmentForm.setFieldValue("projectFramework", submissionConf2.framework);
              assignmentForm.setFieldValue("archiveUrl", submissionConf2.baseProjectArchiveUrl);
              setArchiveUrl(submissionConf2.baseProjectArchiveUrl);
              break;
            case SubmissionType.FILE:
              const submissionConf3 = result.assignmentDetail.submissionConfig as IFileSubmission;
              assignmentForm.setFieldValue("fileExts", submissionConf3.fileExts);
              break;
            case SubmissionType.URL:
              const submissionConf4 = result.assignmentDetail.submissionConfig as IUrlSubmission;
              break;
            case SubmissionType.TEXT:
              const submissionConf5 = result.assignmentDetail.submissionConfig as ITextSubmissionContent;
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
    setSubmissionType(undefined);
    setArchiveUrl("");
    onRefresh();
  };

  const props: UploadProps = {
    name: "file",
    disabled: !!assignmentForm.getFieldsValue()?.archiveUrl,
    multiple: false,
    data: {
      existArchiveUrl: assignmentForm.getFieldsValue().archiveUrl,
    },
    style: {
      height: 200,
    },
    action: "/api/v1/resource/assignment/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.file.response.success) {
          assignmentForm.setFieldValue("archiveUrl", info.file.response.archiveUrl);
          setArchiveUrl(info.file.response.archiveUrl);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const onDeleteArchive = () => {
    AssignmentService.deleteAssignmentArchive(
      archiveUrl,
      (result) => {
        message.success(result.message);
        setArchiveUrl("");
        assignmentForm.setFieldValue("archiveUrl", "");
      },
      (error) => {
        message.error(error);
      }
    );
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
          <Button onClick={() => assignmentForm.submit()} type="primary">
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
        <Form.Item label="Description">
          <TextEditor
            defaultValue={editorValue as string}
            handleDefaultValue={setDefaultValue}
            readOnly={false}
            height={280}
            theme="snow"
            placeholder={`Start writing your ${contentType.toLowerCase()}`}
          />
        </Form.Item>
        <Form.Item label="Submission Type" required style={{ marginTop: 60 }}>
          <Segmented
            value={submissionType}
            className={`${styles.Segmented_wrapper} segment__wrapper`}
            options={appConstant.submissionTypes}
            onChange={(value) => {
              setSubmissionType(value as SubmissionType);
            }}
          />
        </Form.Item>

        {submissionType === SubmissionType.FILE && (
          <Form.Item
            name="fileExts"
            label="Select File Types"
            rules={[{ required: true, message: "Please Select a File Type" }]}
          >
            <Select mode="multiple" placeholder="Select File Type">
              {appConstant.documentExtensions.map((ext, i) => {
                return (
                  <Select.Option key={i} value={`${ext.value}`}>
                    {ext.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        )}

        {submissionType === SubmissionType.PROGRAMMING_PROJECT && (
          <Form.Item
            name="projectFramework"
            label="Select Project Framework"
            rules={[{ required: true, message: "Please Select a Framework" }]}
          >
            <Select placeholder="Select assignment Framework">
              {appConstant.projectFramework.map((framework, i) => {
                return (
                  <Select.Option key={i} value={`${framework.value}`}>
                    {framework.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        )}

        {submissionType === SubmissionType.PROGRAMMING_PROJECT && !archiveUrl && (
          <>
            <Form.Item
              label="Upload starter template"
              name="archiveUrl"
              valuePropName="archiveUrl"
              getValueFromEvent={normFile}
              required
            >
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single upload. Strictly prohibited from uploading company data or other banned files.
                </p>
              </Dragger>
            </Form.Item>
          </>
        )}

        {submissionType === SubmissionType.PROGRAMMING_PROJECT && archiveUrl && (
          <Form.Item label="Starter Template">
            <Space>
              <Space>
                <FileZipOutlined style={{ fontSize: 30 }} />
              </Space>

              <Button size="small" icon={<DeleteOutlined />} onClick={onDeleteArchive}>
                Delete
              </Button>
            </Space>
          </Form.Item>
        )}

        {submissionType === SubmissionType.PROGRAMMING_LANG && (
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

        {submissionType === SubmissionType.PROGRAMMING_LANG && programmingLang && (
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
      </Form>
    </Drawer>
  );
};

export default AddAssignment;
