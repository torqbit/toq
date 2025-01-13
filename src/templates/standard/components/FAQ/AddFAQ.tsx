import ConfigForm from "@/components/Configuration/ConfigForm";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import { Button, CollapseProps, Flex, Form, Input, message, Popconfirm } from "antd";
import { FC, useState } from "react";
import styles from "./FAQ.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "@/components/SvgIcons";
import FAQList from "./FAQList";
import FAQForm from "./FAQForm";
import BasicInfoForm from "@/components/SiteBuilder/sections/BasicInfoForm/BasicInfoForm";
import { postFetch } from "@/services/request";

const AddFAQ: FC<{ siteConfig: PageSiteConfig; setConfig: (value: PageSiteConfig) => void }> = ({
  siteConfig,
  setConfig,
}) => {
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>(siteConfig.sections?.faq?.items || []);
  const [addMore, setAddMore] = useState<boolean>();
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState<number>();
  const [isEdit, setEdit] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [messageApi, contentHolder] = message.useMessage();
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
    setEdit(false);
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

  const handleEdit = (index: number) => {
    setOpen(true);
    setActiveKey(index);
    setEdit(true);
    form.setFieldsValue({
      faqQuestion: faqList[index].question,
      faqAnswer: faqList[index].answer,
    });
  };

  const handleFAQ = () => {
    if (isEdit && typeof activeKey === "number") {
      onUpdate(form.getFieldsValue().faqQuestion, form.getFieldsValue().faqAnswer, activeKey);
    } else {
      onSave();
    }
  };

  const items: CollapseProps["items"] = faqList.map((faq, i) => {
    return {
      key: i,
      extra: (
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
              handleEdit(i);
            }}
          >
            {SvgIcons.boxEdit}
          </i>
        </Flex>
      ),

      label: <h4 style={{ margin: 0 }}> {faq.question}</h4>,
      children: <p>{faq.answer}</p>,
      showArrow: false,
    };
  });

  return (
    <>
      {contentHolder}

      <>
        {faqList.length > 0 ? (
          <Flex vertical gap={10}>
            <FAQList listItems={items} isEditable={true} />

            <Button
              onClick={() => {
                setEdit(false);
                setOpen(true);
              }}
              className={styles.add__more__btn}
              style={{ width: "fit-content" }}
              type="link"
            >
              <Flex align="center">
                <i style={{ fontSize: 18, lineHeight: 0 }}>{SvgIcons.plusBtn}</i>
                Add more
              </Flex>
            </Button>
          </Flex>
        ) : (
          <Flex vertical align="center" justify="center" style={{ height: "calc(100vh - 300px)" }} gap={20}>
            <img src="/img/common/empty.svg" alt="" />
            <h4>No FAQ exist </h4>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setEdit(false);
                form.resetFields();
              }}
            >
              Add FAQ
            </Button>
          </Flex>
        )}

        <FAQForm
          open={open}
          form={form}
          isEdit={isEdit}
          onClose={() => {
            setOpen(false);
            form.resetFields();
            setActiveKey(undefined);
          }}
          handleFAQ={handleFAQ}
        />
      </>
    </>
  );
};

export default AddFAQ;
