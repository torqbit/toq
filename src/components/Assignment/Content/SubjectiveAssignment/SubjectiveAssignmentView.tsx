import PurifyContent from "@/components/PurifyContent/PurifyContent";
import { SubjectiveAssignment, SubjectiveSubmissionContent } from "@/types/courses/assignment";
import style from "@/styles/AssignmentEvaluation.module.scss";
import React, { FC, useEffect, useState } from "react";
import TextEditor from "@/components/Editor/Quilljs/Editor";
import { Form, message, Space, Upload, UploadFile, UploadProps } from "antd";

const SubjectiveAssignmentView: FC<{
  subjectiveQuestion: SubjectiveAssignment;
  subjectiveAnswer: SubjectiveSubmissionContent;
  onChangeEditor: (v: string) => void;
  onUploadFileUrl: (url: string) => void;
}> = ({ subjectiveQuestion, subjectiveAnswer, onChangeEditor, onUploadFileUrl }) => {
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
          name: `file.${subjectiveQuestion.file_for_candidate}`,
          status: "done",
          url: subjectiveAnswer.answerArchiveUrl as string,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [subjectiveAnswer]);

  const props: UploadProps = {
    name: "file",
    listType: "picture-card",
    fileList: fileList,
    multiple: false,
    data: {
      existArchiveUrl: subjectiveAnswer.answerArchiveUrl,
    },
    style: {
      height: 200,
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

        <h4>Write your Answer</h4>
        <TextEditor
          defaultValue={subjectiveAnswer.answerContent as string}
          handleDefaultValue={onChangeEditor}
          readOnly={false}
          height={250}
          theme="snow"
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
            + Upload
          </Upload>
        </Form.Item>
      </Space>
    </section>
  );
};

export default SubjectiveAssignmentView;
