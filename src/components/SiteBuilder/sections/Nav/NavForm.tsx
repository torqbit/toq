import { FC, useEffect, useState } from "react";
import styles from "./NavForm.module.scss";
import { Button, ColorPicker, Divider, Flex, Form, FormInstance, Input, Upload } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { UploadOutlined } from "@ant-design/icons";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { INavBarConfig } from "@/types/schema";

const NavForm: FC<{
  config: PageSiteConfig;
  form: FormInstance;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ form, updateSiteConfig, config }) => {
  const [navConfig, setNavConfig] = useState<INavBarConfig | undefined>(config.navBar);
  const onUpdateNavInfo = (value: string, key: string) => {
    if (navConfig?.links && navConfig?.links?.length < 1) {
      setNavConfig({ links: [{ ...navConfig.links[0], [key]: value }] });
    } else {
      navConfig?.links && setNavConfig({ links: [...navConfig.links, { ...navConfig.links[0], [key]: value }] });
    }
  };

  useEffect(() => {
    updateSiteConfig({ ...config, navBar: navConfig });
  }, [navConfig]);
  const brandItems: IConfigForm[] = [
    {
      title: "Nav items",
      description: "First item ",
      layout: "vertical",
      input: (
        <Flex vertical gap={10}>
          <Input
            onChange={(e) => {
              onUpdateNavInfo(e.currentTarget.value, "title");
            }}
            placeholder="Add title"
          />
          <Input
            onChange={(e) => {
              onUpdateNavInfo(e.currentTarget.value, "link");
            }}
            placeholder="Add link"
          />
        </Flex>
      ),
      inputName: "name",
    },
    {
      title: "",
      description: "Second item",
      layout: "vertical",
      input: (
        <Flex vertical gap={10}>
          <Input
            onChange={(e) => {
              onUpdateNavInfo(e.currentTarget.value, "title");
            }}
            placeholder="Add title"
          />
          <Input
            onChange={(e) => {
              onUpdateNavInfo(e.currentTarget.value, "link");
            }}
            placeholder="Add link"
          />
        </Flex>
      ),
      inputName: "name",
    },
  ];
  return (
    <div className={styles.add__Nav__wrapper}>
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
        {brandItems.map((item, i) => {
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
                divider={i === brandItems.length - 1 ? false : true}
                inputName={""}
                optional={item.optional}
              />
              {brandItems.length !== i + 1 && (
                <Divider style={{ margin: "0px 0px 15px 0px", color: "var(--bg-primary)" }} />
              )}
            </>
          );
        })}
      </Form>
    </div>
  );
};

export default NavForm;
