import { FC, useEffect, useState } from "react";
import styles from "./BlogForm.module.scss";
import { Divider, Form, Input } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { PageSiteConfig } from "@/services/siteConstant";
import { IBlogConfig } from "@/types/schema";
const BlogForm: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const [blogConfig, setBlogConfig] = useState<IBlogConfig | undefined>(config.sections?.courses);
  const [form] = Form.useForm();
  useEffect(() => {
    updateSiteConfig({ ...config, sections: { ...config.sections, blog: blogConfig } });
  }, [blogConfig]);
  const blogItems: IConfigForm[] = [
    {
      title: "Blog list title",
      description: "Add a title for your blog list ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            setBlogConfig({ ...blogConfig, title: e.currentTarget.value });
          }}
          placeholder="Add title"
        />
      ),
      inputName: "title",
    },
    {
      title: "Blog list description",
      description: "Add description for your blog list ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            setBlogConfig({ ...blogConfig, description: e.currentTarget.value });
          }}
          placeholder="Add description"
        />
      ),
      inputName: "description",
    },
  ];

  return (
    <div className={styles.blog__Form__wrapper}>
      <Form
        form={form}
        requiredMark={false}
        initialValues={{
          title: config.sections?.blog?.title,
          description: config.sections?.blog?.description,
        }}
      >
        {blogItems.map((item, i) => {
          return (
            <>
              <ConfigForm
                input={
                  <Form.Item
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
                divider={i === blogItems.length - 1 ? false : true}
                inputName={""}
                optional={item.optional}
              />
              {blogItems.length !== i + 1 && <Divider style={{ margin: "0px 0px 15px 0px" }} />}
            </>
          );
        })}
      </Form>
    </div>
  );
};

export default BlogForm;
