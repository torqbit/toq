import ConfigForm from "@/components/Configuration/ConfigForm";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import { Button, Divider, Flex, Form, Input } from "antd";
import { FC, useState } from "react";
import styles from "./FAQ.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "@/components/SvgIcons";
import FAQList from "./FAQList";

const FAQForm: FC<{ siteConfig: PageSiteConfig; setConfig: (value: PageSiteConfig) => void }> = ({
  siteConfig,
  setConfig,
}) => {
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>(siteConfig.sections?.faq?.items || []);
  const [addMore, setAddMore] = useState<boolean>();
  const [form] = Form.useForm();
  const onSave = () => {
    if (faqList.length > 0) {
      setFaqList([
        ...faqList,
        { question: form.getFieldsValue().faqQuestion, answer: form.getFieldsValue().faqAnswer },
      ]);
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          faq: {
            ...siteConfig.sections?.faq,
            items: [
              ...faqList,
              { question: form.getFieldsValue().faqQuestion, answer: form.getFieldsValue().faqAnswer },
            ],
          },
        },
      });
    } else {
      setFaqList([{ question: form.getFieldsValue().faqQuestion, answer: form.getFieldsValue().faqAnswer }]);
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          faq: {
            ...siteConfig.sections?.faq,
            items: [{ question: form.getFieldsValue().faqQuestion, answer: form.getFieldsValue().faqAnswer }],
          },
        },
      });
    }

    form.resetFields();
    setAddMore(false);
  };

  const onUpdate = (question: string, answer: string, index: number) => {
    setFaqList((prevItems) => {
      const updatedItems = [...prevItems];
      if (index >= 0 && index < updatedItems.length) {
        updatedItems[index] = { question, answer };
      }
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          faq: {
            ...siteConfig.sections?.faq,

            items: updatedItems,
          },
        },
      });
      return updatedItems;
    });
  };

  const onDelete = (index: number) => {
    setFaqList((prevItems) => {
      let updatedList = prevItems.filter((_, i) => i !== index);
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          faq: {
            ...siteConfig.sections?.faq,

            items: updatedList,
          },
        },
      });
      return updatedList;
    });
  };

  return (
    <>
      {faqList.length > 0 && (
        <Flex vertical>
          <FAQList faqList={faqList} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} showIcon={false} />
          {!addMore && (
            <Button
              onClick={() => setAddMore(true)}
              className={styles.add__more__btn}
              style={{ width: "fit-content", marginTop: -20 }}
              type="link"
            >
              <Flex align="center">
                <i>{SvgIcons.plusBtn}</i>
                Add more
              </Flex>
            </Button>
          )}
        </Flex>
      )}
      {(addMore || faqList.length == 0) && (
        <ConfigFormLayout
          formTitle={"Add FAQ"}
          extraContent={
            <Flex align="center" gap={10}>
              {faqList.length > 0 && (
                <Button
                  onClick={() => {
                    setAddMore(false);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={() => {
                  form.submit();
                }}
                type="primary"
              >
                Save
              </Button>
            </Flex>
          }
        >
          <Form onFinish={onSave} form={form} requiredMark={false}>
            <ConfigForm
              input={
                <Form.Item noStyle name={"faqQuestion"} rules={[{ required: true, message: "Question is required" }]}>
                  {<Input style={{ width: 250 }} placeholder={"Write a question"} />}
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
                  style={{ width: "100%" }}
                  name={"faqAnswer"}
                  rules={[{ required: true, message: "Answer is required" }]}
                >
                  <Input.TextArea rows={3} placeholder="Answer for the question" />
                </Form.Item>
              }
              title={"Answer"}
              description={"Describe about the question asked by the students "}
            />
          </Form>
        </ConfigFormLayout>
      )}
    </>
  );
};

export default FAQForm;
