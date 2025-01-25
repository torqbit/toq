import PurifyContent from "@/components/PurifyContent/PurifyContent";
import { SubjectiveAssignment, SubjectiveSubmissionContent } from "@/types/courses/assignment";
import style from "@/styles/AssignmentEvaluation.module.scss";
import React, { FC, useEffect, useState } from "react";
import TextEditor from "@/components/Editor/Quilljs/Editor";
import { Button, Form, message, Space, Tooltip, Upload, UploadFile, UploadProps } from "antd";
import { DownloadOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons";

const SubjectiveAssignmentView: FC<{
  subjectiveQuestion: SubjectiveAssignment;
  subjectiveAnswer: SubjectiveSubmissionContent;
  isCompleteBtnDisabled: boolean;
  onChangeEditor: (v: string) => void;
  onUploadFileUrl: (url: string) => void;
}> = ({ subjectiveQuestion, subjectiveAnswer, onChangeEditor, onUploadFileUrl, isCompleteBtnDisabled }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const FormFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    if (subjectiveAnswer?.answerArchiveUrl) {
      setFileList([
        {
          uid: "-1",
          name: `uploaded_file.${subjectiveQuestion.file_for_candidate}`,
          status: "done",
          url: subjectiveAnswer.answerArchiveUrl as string,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [subjectiveAnswer]);

  const props: UploadProps = {
    accept: `.${subjectiveQuestion.file_for_candidate}`,
    name: "file",
    disabled: isCompleteBtnDisabled,
    fileList: fileList,
    multiple: false,
    data: {
      existArchiveUrl: subjectiveAnswer.answerArchiveUrl,
    },
    action: "/api/v1/resource/assignment/upload",
    onChange(info) {
      setFileList(info.fileList);
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.file.response.success) {
          onUploadFileUrl(info.file.response.archiveUrl);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <section className={style.subjective_assignment_view}>
      <Space direction="vertical">
        {subjectiveQuestion.description && <PurifyContent content={subjectiveQuestion.description as string} />}

        {subjectiveQuestion?.projectArchiveUrl && (
          <Tooltip title="Download assignment file">
            <Button
              style={{ marginBottom: 30 }}
              target="_blank"
              href={`/download/private-file?fileUrl=${subjectiveQuestion.projectArchiveUrl}`}
              download
              icon={<DownloadOutlined />}
            >
              Assignment file
            </Button>
          </Tooltip>
        )}

        <h4>Write your Answer</h4>
        <TextEditor
          defaultValue={subjectiveAnswer.answerContent as string}
          handleDefaultValue={onChangeEditor}
          readOnly={isCompleteBtnDisabled}
          height={250}
          width={700}
          theme="snow"
          className={style.subjective_assign_editor}
          placeholder={`Start writing your`}
        />

        <Form.Item
          style={{ marginTop: 50 }}
          name="archiveUrl"
          valuePropName="archiveUrl"
          getValueFromEvent={FormFile}
          rules={[{ required: false }]}
        >
          <Upload {...props} maxCount={1}>
            <Button icon={<PlusOutlined />}>Upload file</Button>
          </Upload>
        </Form.Item>
      </Space>
    </section>
  );
};

export default SubjectiveAssignmentView;
