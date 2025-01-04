import SvgIcons from "@/components/SvgIcons";
import { Button, Collapse, Flex, Form, Input, Popconfirm } from "antd";
import { FC, useState } from "react";
import ConfigForm from "@/components/Configuration/ConfigForm";
import styles from "./FAQ.module.scss";

const FAQList: FC<{
  onUpdate: (question: string, answer: string, index: number) => void;
  onDelete: (index: number) => void;
  faqList: { question: string; answer: string }[];
  isEditable?: boolean;
}> = ({ isEditable, onUpdate, onDelete, faqList }) => {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  return (
    <section className={isEditable ? styles.faq__form__container : styles.faq__list__container}>
      <Collapse accordion style={{ borderRadius: 4 }} collapsible={"header"}>
        {faqList.map((faq, i) => {
          return (
            <Collapse.Panel
              header={<h4 style={{ margin: 0 }}>{isEdit ? "Update the FAQ" : faq.question}</h4>}
              key={i}
              extra={
                isEditable ? (
                  !isEdit ? (
                    <Flex align="center" gap={10}>
                      <Popconfirm
                        title={`Delete this FAQ`}
                        description={`Are you sure to delete this FAQ?`}
                        onConfirm={() => onDelete(i)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <i>{SvgIcons.delete}</i>
                      </Popconfirm>
                      <div className={styles.edit__pipe}></div>
                      <i
                        onClick={() => {
                          setEdit(true);
                        }}
                      >
                        {SvgIcons.boxEdit}
                      </i>
                    </Flex>
                  ) : (
                    <Flex align="center" gap={10}>
                      <i onClick={() => setEdit(false)}>{SvgIcons.xMark}</i>
                      <Button type="primary" onClick={() => form.submit()}>
                        Update
                      </Button>
                    </Flex>
                  )
                ) : (
                  <></>
                )
              }
              showArrow={false}
            >
              {isEdit ? (
                <Form
                  initialValues={{
                    faqQuestion: faq.question,
                    faqAnswer: faq.answer,
                  }}
                  onFinish={() => {
                    onUpdate(form.getFieldsValue().faqQuestion, form.getFieldsValue().faqAnswer, i);
                    setEdit(false);
                  }}
                  form={form}
                  requiredMark={false}
                >
                  <ConfigForm
                    input={
                      <Form.Item name={"faqQuestion"} rules={[{ required: true, message: "Question is required" }]}>
                        {<Input style={{ width: 350 }} placeholder={"Write a question"} />}
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
                        style={{ width: "100%" }}
                        name={"faqAnswer"}
                        rules={[{ required: true, message: "Answer is required" }]}
                      >
                        <Input.TextArea rows={3} placeholder="Answer for the question" />
                      </Form.Item>
                    }
                    title={"Answer"}
                    description={"Describe about the question asked by the students "}
                    divider={false}
                  />
                </Form>
              ) : (
                <p>{faq.answer}</p>
              )}
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </section>
  );
};

export default FAQList;
