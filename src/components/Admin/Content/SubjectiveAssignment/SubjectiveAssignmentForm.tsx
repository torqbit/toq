import ConfigForm from "@/components/Configuration/ConfigForm";
import TextEditor from "@/components/Editor/Quilljs/Editor";
import appConstant from "@/services/appConstant";
import AssignmentService from "@/services/course/AssignmentService";
import { InboxOutlined } from "@ant-design/icons";
import { Form, FormInstance, message, Select, UploadProps, Upload, UploadFile } from "antd";

import React, { FC, useEffect, useState } from "react";
const { Dragger } = Upload;

const SubjectiveAssignmentForm: FC<{
  subjectiveForm: FormInstance;
  editorValue: string;
  setEditorValue: (v: string) => void;
}> = ({ subjectiveForm, editorValue, setEditorValue }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const FormFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const props: UploadProps = {
    name: "file",
    listType: "picture-card",
    fileList: fileList,
    multiple: false,
    data: {
      existArchiveUrl: subjectiveForm?.getFieldsValue()?.archiveUrl,
    },
    style: {
      height: 200,
    },
    action: "/api/v1/resource/assignment/upload",
    onChange(info) {
      setFileList(info.fileList);
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.file.response.success) {
          subjectiveForm.setFieldValue("archiveUrl", info.file.response.archiveUrl);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {},
  };

  useEffect(() => {
    if (subjectiveForm.getFieldsValue().archiveUrl) {
      setFileList([
        {
          uid: "-1",

          name: `file.${subjectiveForm.getFieldsValue().file_for_candidate}`,
          status: "done",
          url: subjectiveForm.getFieldsValue().archiveUrl as string,
        },
      ]);
    }
  }, []);

  return (
    <Form form={subjectiveForm} layout="vertical">
      <TextEditor
        defaultValue={editorValue}
        handleDefaultValue={setEditorValue}
        readOnly={false}
        height={280}
        theme="snow"
        placeholder={`Start writing `}
      />
      <div style={{ marginTop: 60 }}>
        <ConfigForm
          input={
            <Form.Item
              name="archiveUrl"
              valuePropName="archiveUrl"
              getValueFromEvent={FormFile}
              rules={[{ required: false }]}
            >
              <Upload {...props} maxCount={1}>
                + Upload
              </Upload>
            </Form.Item>
          }
          title={"Upload assignment file"}
          description={"Upload the assignment file. The score will be based on various evaluation parameters."}
          divider={false}
        />
      </div>

      <Form.Item
        name="file_for_candidate"
        label="Select a file for candidate"
        rules={[{ required: true, message: "Please Select a file" }]}
      >
        <Select placeholder="Select assignment type">
          {appConstant.documentExtensions.map((file, i) => {
            return (
              <Select.Option key={i} value={`${file.value}`}>
                {file.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default SubjectiveAssignmentForm;
