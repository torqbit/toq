import { FC, useEffect, useState } from "react";
import styles from "./HeroForm.module.scss";
import { Button, Divider, Dropdown, Flex, Form, Input, message, Radio, Segmented, Tooltip, Upload } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { UploadOutlined } from "@ant-design/icons";
import { PageSiteConfig } from "@/services/siteConstant";
import { IHeroConfig } from "@/types/schema";
import Image from "next/image";
import ImgCrop from "antd-img-crop";
import { postWithFile } from "@/services/request";
import { extractLinkKey, extractValue, getExtension, mailtoRegex, regex, telRegex } from "@/lib/utils";
import SvgIcons from "@/components/SvgIcons";

const HeroForm: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const [form] = Form.useForm();
  const [segmentValue, setSegmentValue] = useState<string | undefined>(config.brand?.defaultTheme);
  const [heroConfig, setHeroConfig] = useState<IHeroConfig | undefined>(config.heroSection);
  const [heroImages, setHeroImages] = useState<{ lightModePath: string; darkModePath: string }>({
    lightModePath: heroConfig?.banner?.lightModePath ? heroConfig.banner.lightModePath : "",
    darkModePath: heroConfig?.banner?.darkModePath ? heroConfig.banner.darkModePath : "",
  });

  const [primaryAddonText, setPrimaryAddon] = useState<string>(
    extractLinkKey(`${config.heroSection?.actionButtons?.primary?.link}`)
  );
  const [secondaryAddonText, setSecondaryAddon] = useState<string>(
    extractLinkKey(`${config.heroSection?.actionButtons?.secondary?.link}`)
  );
  const beforeUpload = async (file: File, mode: string) => {
    const getImageName = () => {
      if (mode === "lightModePath") {
        const name = heroConfig?.banner?.lightModePath?.split("/").pop();
        return name as string;
      } else if (mode === "darkModePath") {
        const name = heroConfig?.banner?.darkModePath?.split("/").pop();
        return name as string;
      } else {
        return "";
      }
    };
    try {
      if (file) {
        const imgName = `${mode}.${getExtension(file.name)}`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("imgName", imgName);
        formData.append("previousPath", getImageName());

        const postRes = await postWithFile(formData, `/api/v1/admin/site/image/save`);
        if (!postRes.ok) {
          throw new Error("Failed to upload file");
        }
        const res = await postRes.json();

        if (res.success) {
          setHeroImages({ ...heroImages, [mode]: `/static/${res.imgName}` });
          setHeroConfig({
            ...heroConfig,
            banner: { ...heroConfig?.banner, [mode]: `/static/${res.imgName}` },
          });
        }
      }
    } catch (error) {
      message.error(`Error uploading file: ${file.name}`);
    }
    return false;
  };

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

  const lightHeroImage = (
    <Upload maxCount={1} showUploadList={false} beforeUpload={(file) => beforeUpload(file, "lightModePath")}>
      {heroImages.lightModePath === "" ? (
        <Button icon={<UploadOutlined />} style={{ width: 240, height: 120 }}>
          Light Hero banner
        </Button>
      ) : (
        <Tooltip title="Upload light mode banner">
          <Image
            src={`${heroConfig?.banner?.lightModePath}`}
            height={120}
            width={240}
            alt="image"
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
    </Upload>
  );

  const darkHeroImage = (
    <Upload maxCount={1} showUploadList={false} beforeUpload={(file) => beforeUpload(file, "darkModePath")}>
      {heroImages.darkModePath === "" ? (
        <Button icon={<UploadOutlined />} style={{ width: 240, height: 120 }}>
          Dark Hero banner
        </Button>
      ) : (
        <Tooltip title="Upload dark mode banner">
          <Image
            src={`${heroConfig?.banner?.darkModePath}`}
            height={120}
            width={240}
            alt="image"
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
    </Upload>
  );
  const heroItems: IConfigForm[] = [
    {
      title: "Title",
      description: "Add title for the hero section ",
      layout: "vertical",
      input: (
        <Form.Item noStyle name={"title"} rules={[{ required: true, message: `title is required!` }]} key={1}>
          <Input
            onChange={(e) => {
              onUpdateHeroConfig(e.currentTarget.value, "title");
            }}
            placeholder="Add title "
          />
        </Form.Item>
      ),
      inputName: "title",
    },
    {
      title: "Description",
      description: "Add description for hero section ",
      layout: "vertical",
      input: (
        <Form.Item
          noStyle
          name={"description"}
          rules={[{ required: true, message: `description is required!` }]}
          key={2}
        >
          <Input.TextArea
            className={styles.text__area__wrapper}
            showCount={true}
            rows={3}
            style={{ marginBottom: 20 }}
            maxLength={250}
            onChange={(e) => {
              onUpdateHeroConfig(e.currentTarget.value, "description");
            }}
            placeholder="Add description"
          />
        </Form.Item>
      ),
      inputName: "description",
    },
    {
      title: "Action buttons",
      description: "Add actions buttons ",
      layout: "vertical",
      input: (
        <Flex vertical gap={10} key={3}>
          <Flex vertical gap={10}>
            <h5>Primary</h5>
            <Form.Item noStyle name={"primaryLabel"} rules={[{ required: true, message: `Primary link is required!` }]}>
              <Input
                defaultValue={config.heroSection?.actionButtons?.primary?.label}
                onChange={(e) => {
                  onUpdateHeroConfig(e.currentTarget.value, "actionButtons.primary.label");
                }}
                placeholder="Add label"
              />
            </Form.Item>
            <Form.Item
              noStyle
              name={"primaryLink"}
              rules={[
                () => ({
                  validator(rule, value, callBack) {
                    switch (primaryAddonText) {
                      case "https://":
                        if (regex.test(form.getFieldsValue().primaryLink)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Domain is missing");
                        }
                      case "mailto:":
                        if (mailtoRegex.test(form.getFieldsValue().primaryLink)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Enter a valid email");
                        }
                      case "tel:":
                        if (telRegex.test(form.getFieldsValue().primaryLink)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Enter a valid phone number");
                        }

                      case `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/`:
                        if (!form.getFieldsValue().primaryLink?.startsWith("http")) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Enter a valid url");
                        }

                      default:
                        return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Input
                defaultValue={config.heroSection?.actionButtons?.primary?.link}
                addonBefore={
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: [
                        {
                          key: "1",
                          label: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,

                          onClick: () => {
                            setPrimaryAddon(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/`);
                          },
                        },
                        {
                          key: "2",
                          label: "https://",

                          onClick: () => {
                            setPrimaryAddon("https://");
                          },
                        },
                        {
                          key: "3",
                          label: "mailto:",

                          onClick: () => {
                            setPrimaryAddon("mailto:");
                          },
                        },
                        {
                          key: "4",
                          label: "tel:",

                          onClick: () => {
                            setPrimaryAddon("tel:");
                          },
                        },
                      ],
                    }}
                  >
                    <Flex align="center" gap={5} style={{ lineHeight: 0 }}>
                      {primaryAddonText}
                      <i>{SvgIcons.chevronDownOutline}</i>
                    </Flex>
                  </Dropdown>
                }
                onChange={(e) => {
                  onUpdateHeroConfig(`${primaryAddonText}${e.currentTarget.value}`, "actionButtons.primary.link");
                }}
                placeholder="Add link"
              />
            </Form.Item>
          </Flex>
          <Flex vertical gap={10}>
            <h5>Secondary</h5>
            <Form.Item
              noStyle
              name={"secondaryLabel"}
              rules={[{ required: true, message: `Secondary link is required!` }]}
            >
              <Input
                defaultValue={config.heroSection?.actionButtons?.secondary?.label}
                onChange={(e) => {
                  onUpdateHeroConfig(e.currentTarget.value, "actionButtons.secondary.label");
                }}
                placeholder="Add label"
              />
            </Form.Item>
            <Form.Item
              noStyle
              name={"secondaryLink"}
              rules={[
                () => ({
                  validator(rule, value, callBack) {
                    switch (secondaryAddonText) {
                      case "https://":
                        if (regex.test(form.getFieldsValue().secondaryLink)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Domain is missing");
                        }
                      case "mailto:":
                        if (mailtoRegex.test(form.getFieldsValue().secondaryLink)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Enter a valid email");
                        }
                      case "tel:":
                        if (telRegex.test(form.getFieldsValue().secondaryLink)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Enter a valid phone number");
                        }
                      case `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/`:
                        if (!form.getFieldsValue().primaryLink?.startsWith("http")) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Enter a valid url");
                        }

                      default:
                        return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Input
                defaultValue={config.heroSection?.actionButtons?.secondary?.link}
                addonBefore={
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: [
                        {
                          key: "1",
                          label: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,

                          onClick: () => {
                            setSecondaryAddon(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/`);
                          },
                        },
                        {
                          key: "2",
                          label: "https://",

                          onClick: () => {
                            setSecondaryAddon("https://");
                          },
                        },
                        {
                          key: "3",
                          label: "mailto:",

                          onClick: () => {
                            setSecondaryAddon("mailto:");
                          },
                        },
                        {
                          key: "4",
                          label: "tel:",

                          onClick: () => {
                            setSecondaryAddon("tel:");
                          },
                        },
                      ],
                    }}
                  >
                    <Flex align="center" gap={5} style={{ lineHeight: 0 }}>
                      {secondaryAddonText}
                      <i>{SvgIcons.chevronDownOutline}</i>
                    </Flex>
                  </Dropdown>
                }
                onChange={(e) => {
                  onUpdateHeroConfig(`${secondaryAddonText}${e.currentTarget.value}`, "actionButtons.secondary.link");
                }}
                placeholder="Add link"
              />
            </Form.Item>
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
        <Flex align="center" vertical gap={20} key={4} style={{ marginBottom: 15 }}>
          {config.brand?.themeSwitch && (
            <Segmented
              className={`${styles.segment} `}
              defaultValue={segmentValue}
              options={[
                {
                  label: "Light banner",
                  value: "light",
                  disabled: config.brand?.defaultTheme === "dark" && !config.brand.themeSwitch,
                },
                {
                  label: "Dark banner",
                  value: "dark",
                  disabled: config.brand?.defaultTheme !== "dark" && !config.brand?.themeSwitch,
                },
              ]}
              onChange={(value) => {
                setSegmentValue(value);
              }}
            />
          )}
          {config.brand?.themeSwitch ? (
            <>{segmentValue === "dark" ? darkHeroImage : lightHeroImage}</>
          ) : (
            <Flex vertical gap={0}>
              <p>Upload hero image for {config.brand?.defaultTheme} theme</p>

              {config.brand?.defaultTheme === "dark" ? darkHeroImage : lightHeroImage}
            </Flex>
          )}
        </Flex>
      ),
      inputName: "logo",
    },
    {
      title: "Image position",
      layout: "vertical",

      description: "Select the position of the image",
      input: (
        <Flex vertical gap={10} key={5} style={{ width: "fit-content" }}>
          <Flex gap={62}>
            <Radio
              className={styles.radio}
              checked={heroConfig?.banner?.position === "left"}
              onChange={(e) => {
                setHeroConfig({ ...heroConfig, banner: { ...heroConfig?.banner, position: "left" } });
              }}
              title="Left"
            >
              Left
            </Radio>
            <Radio
              className={styles.radio}
              checked={heroConfig?.banner?.position === "right"}
              onChange={(e) => {
                setHeroConfig({ ...heroConfig, banner: { ...heroConfig?.banner, position: "right" } });
              }}
              title="Left"
            >
              Right
            </Radio>
          </Flex>{" "}
          <Flex gap={40}>
            <Radio
              className={styles.radio}
              checked={heroConfig?.banner?.position === "bottom"}
              onChange={(e) => {
                setHeroConfig({ ...heroConfig, banner: { ...heroConfig?.banner, position: "bottom" } });
              }}
              title="Left"
            >
              Bottom
            </Radio>

            <Radio
              className={styles.radio}
              checked={heroConfig?.banner?.position === "background"}
              onChange={(e) => {
                setHeroConfig({ ...heroConfig, banner: { ...heroConfig?.banner, position: "background" } });
              }}
              title="Left"
            >
              Background
            </Radio>
          </Flex>
        </Flex>
      ),
      inputName: "position",
    },
  ];

  return (
    <div className={styles.add__hero__wrapper}>
      <Form
        validateTrigger="onBlur"
        form={form}
        requiredMark={false}
        initialValues={{
          title: config.heroSection?.title,
          description: config.heroSection?.description,
          primaryLabel: config.heroSection?.actionButtons?.primary?.label,
          secondaryLabel: config.heroSection?.actionButtons?.secondary?.label,
          primaryLink: extractValue(`${config.heroSection?.actionButtons?.primary?.link}`),
          secondaryLink: extractValue(`${config.heroSection?.actionButtons?.secondary?.link}`),
        }}
      >
        {heroItems.map((item, i) => {
          return (
            <>
              <ConfigForm
                input={item.input}
                title={item.title}
                description={item.description}
                layout={item.layout}
                divider={i === heroItems.length - 1 ? false : true}
                inputName={""}
                optional={item.optional}
              />
            </>
          );
        })}
      </Form>
    </div>
  );
};

export default HeroForm;
