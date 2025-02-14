import { FC, useEffect, useState } from "react";
import styles from "./BrandForm.module.scss";
import {
  Button,
  ColorPicker,
  Divider,
  Flex,
  Form,
  FormInstance,
  Input,
  message,
  Segmented,
  Tooltip,
  Upload,
} from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { UploadOutlined } from "@ant-design/icons";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { IBrandConfig, ISocialLinks } from "@/types/schema";
import { RcFile } from "antd/es/upload";
import Image from "next/image";
import SvgIcons from "@/components/SvgIcons";
import { postWithFile } from "@/services/request";
import { checkIfImageIsSquare, getExtension } from "@/lib/utils";

const BrandForm: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const [form] = Form.useForm();
  const [messageApi, contextWrapper] = message.useMessage();
  const [brandConfig, setBrandConfig] = useState<IBrandConfig | undefined>(config.brand);
  const [brandImage, setBrandImage] = useState<{ logo: string; icon: string; darkLogo: string }>({
    logo: config.brand?.logo ? (config.brand.logo as string) : "",
    darkLogo: config.brand?.darkLogo ? (config.brand.darkLogo as string) : "",

    icon: config.brand?.icon ? (config.brand?.icon as string) : "",
  });

  const [selectedSegment, setSelectedSegment] = useState<string>("discord");
  const [segmentLogoValue, setSegmentLogoValue] = useState<string | undefined>(config.brand?.defaultTheme);

  const beforeUpload = async (file: File, imageType: string, mode: string) => {
    const getImageName = () => {
      if (imageType === "icon" && typeof brandConfig?.icon === "string") {
        const name = brandConfig.icon.split("/").pop();
        return name as string;
      } else if (imageType.toLowerCase().includes("logo")) {
        if (mode === "light" && typeof brandConfig?.logo === "string") {
          const name = brandConfig.logo.split("/").pop();
          return name as string;
        }
        if (mode === "dark" && typeof brandConfig?.darkLogo === "string") {
          const name = brandConfig.darkLogo.split("/").pop();
          return name as string;
        }
        return "";
      } else {
        return "";
      }
    };

    try {
      if (file) {
        if (imageType == "icon") {
          const isSquare = await checkIfImageIsSquare(file);
          if (!isSquare) {
            messageApi.warning("Image should be square shaped");
            return;
          }
        }
        const imgName = `${imageType}-${mode}.${getExtension(file.name)}`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("imgName", imgName);
        formData.append("previousPath", getImageName());
        imageType.toLowerCase().includes("logo") && formData.append("resize", "true");
        formData.append("imageType", imageType);

        const postRes = await postWithFile(formData, `/api/v1/admin/site/image/save`);
        if (!postRes.ok) {
          throw new Error("Failed to upload file");
        }
        const res = await postRes.json();
        if (res.success) {
          setBrandImage({
            ...brandImage,
            [imageType]:
              imageType === "icon"
                ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/static/${res.imgName}`
                : `/static/${res.imgName}`,
          });
          setBrandConfig({
            ...brandConfig,
            [imageType]:
              imageType === "icon"
                ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/static/${res.imgName}`
                : `/static/${res.imgName}`,
            favicon: res.icoFileName ? `/static/${res.icoFileName}` : brandConfig?.favicon,
          });
        }
      }
    } catch (error) {
      message.error(`Error uploading file: ${file.name}`);
    }
    return false;
  };

  const onUpdateBrandConfig = (value: string, key: string) => {
    if (key.startsWith("socialLinks")) {
      const linkKey = key.split(".")[1];
      setBrandConfig({ ...brandConfig, socialLinks: { ...brandConfig?.socialLinks, [linkKey]: value } });
    } else {
      setBrandConfig({ ...brandConfig, [key]: value });
    }
  };

  const darkLogo = (
    <Upload showUploadList={false} maxCount={1} beforeUpload={(file: RcFile) => beforeUpload(file, "darkLogo", "dark")}>
      {brandImage.logo === "" ? (
        <Button icon={<UploadOutlined />} style={{ width: 100 }}>
          Dark Logo
        </Button>
      ) : (
        <Tooltip title="Upload dark logo">
          <Image
            className={styles.logo_img}
            src={`${brandConfig?.darkLogo}`}
            height={100}
            width={200}
            alt="image"
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
    </Upload>
  );

  const lightLogo = (
    <Upload showUploadList={false} maxCount={1} beforeUpload={(file: RcFile) => beforeUpload(file, "logo", "light")}>
      {brandImage.logo === "" ? (
        <Button icon={<UploadOutlined />} style={{ width: 100 }}>
          Light Logo
        </Button>
      ) : (
        <Tooltip title="Upload light logo">
          <Image
            className={styles.logo_img}
            src={`${brandConfig?.logo}`}
            height={100}
            width={200}
            alt="image"
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
    </Upload>
  );

  useEffect(() => {
    updateSiteConfig({ ...config, brand: { ...brandConfig, defaultTheme: config.brand?.defaultTheme } });
  }, [brandConfig]);
  const brandItems: IConfigForm[] = [
    {
      title: "Brand name",
      description: "Add a brand name for your site ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            onUpdateBrandConfig(e.currentTarget.value, "name");
          }}
          placeholder="Add brand name"
        />
      ),
      inputName: "name",
    },
    {
      title: "Site title",
      description: "Add a title for your site ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            onUpdateBrandConfig(e.currentTarget.value, "title");
          }}
          placeholder="Add title"
        />
      ),
      inputName: "title",
    },
    {
      title: "Site description",
      description: "Add description for your site ",
      layout: "vertical",
      input: (
        <Input.TextArea
          className={styles.text__area__wrapper}
          showCount={true}
          rows={3}
          style={{ marginBottom: 20 }}
          maxLength={120}
          onChange={(e) => {
            onUpdateBrandConfig(e.currentTarget.value, "description");
          }}
          placeholder="Add description"
        />
      ),
      inputName: "description",
    },
    {
      title: "Accent color",
      layout: "vertical",

      description: "Primary color used in your theme",
      input: (
        <ColorPicker
          onChange={(e) => {
            onUpdateBrandConfig(e.toHexString(), "brandColor");
          }}
          className={styles.form__color__picker}
          defaultValue={DEFAULT_THEME.brand.brandColor}
          disabledAlpha
        />
      ),
      inputName: "brandColor",
    },

    {
      title: "Brand icon",

      description: "A square social icon at least 60 x 60.",
      layout: "vertical",

      input: (
        <Upload
          showUploadList={false}
          maxCount={1}
          beforeUpload={(file: RcFile) => beforeUpload(file, "icon", "light")}
        >
          {brandImage.icon === "" ? (
            <Button icon={<UploadOutlined />} style={{ width: 60, height: 60 }}></Button>
          ) : (
            <Tooltip title="Upload icon">
              <Image
                src={`${brandConfig?.icon}`}
                height={60}
                width={60}
                alt="image"
                style={{ cursor: "pointer", border: "1px solid var(--border-color)" }}
              />
            </Tooltip>
          )}
        </Upload>
      ),
      inputName: "icon",
    },
    {
      title: "Brand logo",
      layout: "vertical",

      description: "The primary logo should be transparent and at least 600 x 72px.",
      input: (
        <Flex vertical gap={20}>
          {config.brand?.themeSwitch && (
            <Segmented
              className={`${styles.segment}`}
              defaultValue={segmentLogoValue}
              options={[
                {
                  label: "Light logo",

                  value: "light",
                },
                {
                  label: "Dark logo",
                  value: "dark",
                },
              ]}
              onChange={(value) => {
                setSegmentLogoValue(value);
              }}
            />
          )}
          {config.brand?.themeSwitch ? (
            <div>{segmentLogoValue === "dark" ? darkLogo : lightLogo}</div>
          ) : (
            <Flex vertical gap={0}>
              <p>Upload logo for {config.brand?.defaultTheme} theme</p>

              {config.brand?.defaultTheme === "dark" ? darkLogo : lightLogo}
            </Flex>
          )}
        </Flex>
      ),
      inputName: "logo",
    },

    {
      title: "Social links",
      optional: true,
      description: "Add social links ",
      layout: "vertical",
      input: (
        <Flex vertical gap={10} align="center">
          <Segmented
            className={`${styles.segment}`}
            onChange={(value) => {
              setSelectedSegment(value);

              form.setFieldValue(
                "social",
                config.brand?.socialLinks && config.brand?.socialLinks[value as keyof ISocialLinks]?.split("/").pop()
              );
            }}
            style={{ lineHeight: 0 }}
            options={[
              {
                label: (
                  <Flex align="center" justify="center">
                    <i>{SvgIcons.discord}</i>
                  </Flex>
                ),
                className: styles.segment__labels,

                value: "discord",
              },
              {
                label: <i>{SvgIcons.github}</i>,
                value: "github",
                className: styles.segment__labels,
              },
              {
                label: <i>{SvgIcons.youtube}</i>,
                value: "youtube",
                className: styles.segment__labels,
              },
              {
                label: <i>{SvgIcons.instagram}</i>,
                value: "instagram",
                className: styles.segment__labels,
              },
              {
                label: <i>{SvgIcons.twitter}</i>,
                value: "twitter",
                className: styles.segment__labels,
              },
            ]}
          />
          <Input
            key={selectedSegment}
            addonBefore={`https://${selectedSegment}.${selectedSegment === "discord" ? "gg" : "com"}`}
            type="url"
            onChange={(e) => {
              onUpdateBrandConfig(
                e.currentTarget.value.startsWith("http")
                  ? e.currentTarget.value
                  : `https://${selectedSegment}.${selectedSegment === "discord" ? "gg" : "com"}/${
                      e.currentTarget.value
                    }`,
                `socialLinks.${selectedSegment}`
              );
            }}
            defaultValue={
              config.brand?.socialLinks &&
              config.brand?.socialLinks[selectedSegment as keyof ISocialLinks]?.split("/").pop()
            }
            placeholder={`Add ${selectedSegment} id`}
          />
        </Flex>
      ),
      inputName: "social",
    },
  ];

  return (
    <div className={styles.brand__wrapper}>
      {contextWrapper}
      <Form
        form={form}
        requiredMark={false}
        initialValues={{
          brandColor: config.brand?.brandColor,
          name: config.brand?.name,
          title: config.brand?.title,
          description: config.brand?.description,
          social:
            config.brand?.socialLinks &&
            config.brand?.socialLinks[selectedSegment as keyof ISocialLinks]?.split("/").pop(),
        }}
      >
        {brandItems.map((item, i) => {
          return (
            <>
              <ConfigForm
                input={
                  <Form.Item
                    name={item.inputName}
                    noStyle
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
            </>
          );
        })}
      </Form>
    </div>
  );
};

export default BrandForm;
