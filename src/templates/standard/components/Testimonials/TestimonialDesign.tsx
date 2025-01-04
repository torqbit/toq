import { FC, useEffect, useState } from "react";
import styles from "./Testimonials.module.scss";
import { Button, Flex, Form, Input, Switch } from "antd";
import { PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "@/components/SvgIcons";
import { useRouter } from "next/router";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ConfigForm from "@/components/Configuration/ConfigForm";
const TestimonialDesign: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const router = useRouter();
  const [basicForm] = Form.useForm();

  return (
    <div className={styles.testimonial__design__wrapper}>
      <Flex className={styles.disable__switch} align="center" justify="space-between">
        <h5> {config.sections?.testimonials?.enabled ? "Disable Testimonials" : "Enable Testimonials"}</h5>
        <Switch
          size="small"
          value={config.sections?.testimonials?.enabled}
          onChange={(value) => {
            updateSiteConfig({
              ...config,
              sections: {
                ...config.sections,
                testimonials: { ...config.sections?.testimonials, enabled: !config.sections?.testimonials?.enabled },
              },
            });
          }}
        />
      </Flex>
      <Form
        form={basicForm}
        initialValues={{
          title: config.sections?.testimonials?.title,
          description: config.sections?.testimonials?.description,
        }}
        onFinish={() => {}}
      >
        <Flex vertical gap={10}>
          <ConfigForm
            layout="vertical"
            input={
              <Form.Item name={"title"} rules={[{ required: true, message: "Title is required" }]}>
                <Input
                  onChange={(e) =>
                    updateSiteConfig({
                      ...config,
                      sections: {
                        ...config.sections,
                        testimonials: {
                          ...config.sections?.testimonials,
                          title: e.currentTarget.value,
                        },
                      },
                    })
                  }
                  placeholder="Title for the testimonials"
                />
              </Form.Item>
            }
            title={"Title"}
            description={"Add a title for the testimonials "}
            divider={true}
          />
          <ConfigForm
            layout="vertical"
            input={
              <Form.Item name={"description"} rules={[{ required: true, message: "Description is required" }]}>
                <Input.TextArea
                  onChange={(e) =>
                    updateSiteConfig({
                      ...config,
                      sections: {
                        ...config.sections,
                        testimonials: {
                          ...config.sections?.testimonials,
                          description: e.currentTarget.value,
                        },
                      },
                    })
                  }
                  rows={3}
                  placeholder="Description for the testimonials"
                />
              </Form.Item>
            }
            title={"Description"}
            description={"Add a description for the testimonials "}
            divider={false}
          />
        </Flex>
      </Form>

      {config.sections?.testimonials?.items?.length === 0 && (
        <Flex vertical justify="center" style={{ textAlign: "center" }}>
          <p>No Testimonials exists</p>
          <Button
            onClick={() => {
              router.push("/admin/site/content/testimonials");
            }}
            type="primary"
          >
            <Flex align="center" gap={10}>
              Add Testimonials
              <i>{SvgIcons.arrowRight}</i>
            </Flex>
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default TestimonialDesign;
