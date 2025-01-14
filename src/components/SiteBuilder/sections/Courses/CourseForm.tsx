import { FC, useEffect, useState } from "react";
import styles from "./Course.module.scss";
import { Divider, Flex, Form, Input, Switch } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { ICourseConfig } from "@/types/schema";
const CourseForm: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const [courseConfig, setCourseConfig] = useState<ICourseConfig | undefined>(config.sections?.courses);
  const [form] = Form.useForm();
  useEffect(() => {
    updateSiteConfig({ ...config, sections: { ...config.sections, courses: courseConfig } });
  }, [courseConfig]);
  const courseItems: IConfigForm[] = [
    {
      title: "Course list title",
      description: "Add a title for your course list ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            setCourseConfig({ ...courseConfig, title: e.currentTarget.value });
          }}
          placeholder="Add title"
        />
      ),
      inputName: "title",
    },
    {
      title: "Course list description",
      description: "Add description for your course list ",
      layout: "vertical",
      input: (
        <Input.TextArea
          className={styles.text__area__wrapper}
          showCount={true}
          rows={3}
          style={{ marginBottom: 20 }}
          maxLength={250}
          onChange={(e) => {
            setCourseConfig({ ...courseConfig, description: e.currentTarget.value });
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
        <h5> {config.sections?.courses?.enable ? "Disable course" : "Enable course"}</h5>
        <Switch
          size="small"
          value={config.sections?.courses?.enable}
          onChange={(value) => {
            setCourseConfig({ ...courseConfig, enable: !config.sections?.courses?.enable });
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
              title: config.sections?.courses?.title,
              description: config.sections?.courses?.description,
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

export default CourseForm;
