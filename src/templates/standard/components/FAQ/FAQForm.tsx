import ConfigForm from "@/components/Configuration/ConfigForm";

import { Button, Drawer, Flex, Form, FormInstance, Input } from "antd";
import { FC } from "react";

import styles from "./FAQ.module.scss";

const FAQForm: FC<{
  open: boolean;
  form: FormInstance;
  onClose: () => void;
  handleFAQ: () => void;
  isEdit: boolean;
}> = ({ open, onClose, form, handleFAQ, isEdit }) => {
  return (
    <Drawer
      closeIcon={true}
      title={isEdit ? "Update FAQ" : "Add FAQ"}
      classNames={{ header: styles.drawer__header, footer: styles.drawer__footer }}
      footer={
        <Flex align="center" gap={10}>
          <Button
            type="primary"
            onClick={() => {
              form.submit();
            }}
          >
            {isEdit ? "Update" : "Add"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Flex>
      }
      open={open}
      onClose={onClose}
      children={
        <Form
          onFinish={() => {
            handleFAQ();
            onClose();
          }}
          form={form}
          requiredMark={false}
        >
          <Flex vertical gap={10}>
            <ConfigForm
              layout="vertical"
              input={
                <Form.Item name={"faqQuestion"} rules={[{ required: true, message: "Question is required" }]}>
                  {<Input style={{ width: "100%" }} placeholder={"Write a question"} />}
                </Form.Item>
              }
              title={"Question"}
              description={"Add a question which is frequently asked by the students "}
              divider={true}
            />
            <ConfigForm
              layout="vertical"
              input={
                <Form.Item
                  noStyle
                  style={{ width: 250 }}
                  name={"faqAnswer"}
                  rules={[{ required: true, message: "Answer is required" }]}
                >
                  <Input.TextArea rows={6} placeholder="Answer for the question" />
                </Form.Item>
              }
              title={"Answer"}
              description={"Describe about the question asked by the students "}
            />
          </Flex>
        </Form>
      }
    />
  );
};

export default FAQForm;
