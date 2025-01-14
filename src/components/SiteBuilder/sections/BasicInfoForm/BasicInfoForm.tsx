import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import { Button, Flex, Form, FormInstance, Input } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import React, { FC } from "react";
const BasicInfoForm: FC<{
  form: FormInstance;
  initialValue?: { title?: string; description?: string };
  extraContent?: React.ReactNode;

  onFinish: () => void;
}> = ({ form, initialValue, onFinish, extraContent }) => {
  return (
    <ConfigFormLayout showArrow={false} formTitle="Basic info" extraContent={extraContent}>
      <Form form={form} initialValues={initialValue} onChange={onFinish}>
        <Flex vertical gap={10}>
          <ConfigForm
            input={
              <Form.Item
                style={{ width: 250 }}
                name={"title"}
                rules={[{ required: true, message: "Title is required" }]}
              >
                <Input placeholder="Add a title" />
              </Form.Item>
            }
            title={"Title"}
            description={"Add a title for the section "}
            divider={true}
          />
          <ConfigForm
            layout="vertical"
            input={
              <Form.Item noStyle name={"description"} rules={[{ required: true, message: "Description is required" }]}>
                <Input.TextArea rows={3} placeholder="Add a description" />
              </Form.Item>
            }
            title={"Description"}
            description={"Add a description for the section "}
            divider={false}
          />
        </Flex>
      </Form>
    </ConfigFormLayout>
  );
};

export default BasicInfoForm;
