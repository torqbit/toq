import { FC, useEffect, useState } from "react";
import styles from "./LearningDesign.module.scss";
import { Divider, Flex, Form, Input, Switch } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { PageSiteConfig } from "@/services/siteConstant";
import { ILearningConfig } from "@/types/schema";
const LearningDesignForm: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const [learningConfig, setLearningConfig] = useState<ILearningConfig | undefined>(config.sections?.learning);
  const [form] = Form.useForm();
  useEffect(() => {
    updateSiteConfig({ ...config, sections: { ...config.sections, learning: learningConfig } });
  }, [learningConfig]);
  const courseItems: IConfigForm[] = [
    {
      title: "Learning path list title",
      description: "Add a title for your learning path list ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            setLearningConfig({ ...learningConfig, title: e.currentTarget.value });
          }}
          placeholder="Add title"
        />
      ),
      inputName: "title",
    },
    {
      title: "Learning path list description",
      description: "Add description for your learning path list ",
      layout: "vertical",
      input: (
        <Input.TextArea
          className={styles.text__area__wrapper}
          showCount={true}
          rows={3}
          style={{ marginBottom: 20 }}
          maxLength={250}
          onChange={(e) => {
            setLearningConfig({ ...learningConfig, description: e.currentTarget.value });
          }}
          placeholder="Add description"
        />
      ),
      inputName: "description",
    },
  ];

  return (
    <div className={styles.course__Form__wrapper}>
      <Flex className={styles.disable__switch} align="center" justify="space-between">
        <h5> {config.sections?.learning?.enabled ? "Disable learning path" : "Enable learning path"}</h5>
        <Switch
          size="small"
          value={config.sections?.learning?.enabled}
          onChange={(value) => {
            setLearningConfig({ ...learningConfig, enabled: !config.sections?.learning?.enabled });
          }}
        />
      </Flex>
      {config.sections?.courses?.enable && (
        <>
          <Divider style={{ margin: "15px 0px ", color: "var(--bg-primary)" }} />

          <Form
            form={form}
            requiredMark={false}
            initialValues={{
              title: config.sections?.learning?.title,
              description: config.sections?.learning?.description,
            }}
          >
            {courseItems.map((item, i) => {
              return (
                <>
                  <ConfigForm
                    input={
                      <Form.Item
                        noStyle
                        name={item.inputName}
                        rules={[{ required: !item.optional, message: `Field is required!` }]}
                        key={i}
                      >
                        {item.input}
                      </Form.Item>
                    }
                    title={item.title}
                    description={item.description}
                    layout={item.layout}
                    divider={i === courseItems.length - 1 ? false : true}
                    inputName={""}
                    optional={item.optional}
                  />
                </>
              );
            })}
          </Form>
        </>
      )}
    </div>
  );
};

export default LearningDesignForm;
