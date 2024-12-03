import { FC, useEffect, useState } from "react";
import styles from "./HeroForm.module.scss";
import { Button, ColorPicker, Divider, Flex, Form, FormInstance, Input, Upload } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { UploadOutlined } from "@ant-design/icons";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { IHeroConfig } from "@/types/schema";

const HeroForm: FC<{
  config: PageSiteConfig;
  form: FormInstance;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ form, updateSiteConfig, config }) => {
  const [heroConfig, setHeroConfig] = useState<IHeroConfig | undefined>(config.heroSection);

  const onUpdateHeroConfig = (value: string, key: string) => {
    if (key.startsWith("actionButtons")) {
      const buttonType = key.split(".")[1];
      const buttonKey = key.split(".")[2];
      if (buttonType === "primary") {
        setHeroConfig({
          ...heroConfig,
          actionButtons: {
            ...heroConfig?.actionButtons,
            primary: { ...heroConfig?.actionButtons?.primary, [buttonKey]: value },
          },
        });
      } else {
        setHeroConfig({
          ...heroConfig,
          actionButtons: {
            ...heroConfig?.actionButtons,
            secondary: { ...heroConfig?.actionButtons?.secondary, [buttonKey]: value },
          },
        });
      }
    } else {
      setHeroConfig({ ...heroConfig, [key]: value });
    }
  };

  useEffect(() => {
    updateSiteConfig({ ...config, heroSection: heroConfig });
  }, [heroConfig]);

  const heroItems: IConfigForm[] = [
    {
      title: "Title",
      description: "Add title for the hero section ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            onUpdateHeroConfig(e.currentTarget.value, "title");
          }}
          placeholder="Add title "
        />
      ),
      inputName: "title",
    },
    {
      title: "Description",
      description: "Add description for hero section ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            onUpdateHeroConfig(e.currentTarget.value, "description");
          }}
          placeholder="Add description"
        />
      ),
      inputName: "description",
    },
    {
      title: "Action buttons",
      description: "Add actions buttons ",
      layout: "vertical",
      input: (
        <Flex vertical gap={10}>
          <Flex vertical gap={10}>
            <h5>Primary</h5>
            <Input
              onChange={(e) => {
                onUpdateHeroConfig(e.currentTarget.value, "actionButtons.primary.label");
              }}
              placeholder="Add label"
            />
            <Input
              addonBefore="https://"
              onChange={(e) => {
                onUpdateHeroConfig(e.currentTarget.value, "actionButtons.primary.link");
              }}
              placeholder="Add link"
            />
          </Flex>
          <Flex vertical gap={10}>
            <h5>Secondary</h5>
            <Input
              onChange={(e) => {
                onUpdateHeroConfig(e.currentTarget.value, "actionButtons.secondary.label");
              }}
              placeholder="Add label"
            />
            <Input
              addonBefore="https://"
              onChange={(e) => {
                onUpdateHeroConfig(e.currentTarget.value, "actionButtons.secondary.link");
              }}
              placeholder="Add link"
            />
          </Flex>
        </Flex>
      ),
      inputName: "actionButtons",
    },
    {
      title: "Hero image",
      layout: "vertical",

      description: "The hero image should be  at least 1200 x 600px.",
      input: (
        <Upload>
          <Button icon={<UploadOutlined />} style={{ width: 240, height: 120 }}>
            Upload Hero image
          </Button>
        </Upload>
      ),
      inputName: "logo",
    },
  ];
  return (
    <div className={styles.add__hero__wrapper}>
      <Form
        form={form}
        requiredMark={false}
        initialValues={{
          brandColor: config.brand?.brandColor,
          name: config.brand?.name,
          title: config.brand?.title,
          description: config.brand?.description,
        }}
      >
        {heroItems.map((item, i) => {
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
                divider={i === heroItems.length - 1 ? false : true}
                inputName={""}
                optional={item.optional}
              />
              {heroItems.length !== i + 1 && <Divider style={{ margin: "0px 0px 15px 0px" }} />}
            </>
          );
        })}
      </Form>
    </div>
  );
};

export default HeroForm;
