import { FC, useEffect, useState } from "react";
import styles from "./BrandForm.module.scss";
import { Button, ColorPicker, Divider, Flex, Form, FormInstance, Input, message, Segmented, Upload } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { UploadOutlined } from "@ant-design/icons";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { IBrandConfig } from "@/types/schema";
import { RcFile } from "antd/es/upload";
import Image from "next/image";
import ImgCrop from "antd-img-crop";
import SvgIcons from "@/components/SvgIcons";

const BrandForm: FC<{
  config: PageSiteConfig;
  form: FormInstance;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ form, updateSiteConfig, config }) => {
  const [brandConfig, setBrandConfig] = useState<IBrandConfig | undefined>(config.brand);
  const [base64Images, setBase64Images] = useState<{ logo: string; icon: string }>({ logo: "", icon: "" });
  const [selectedSegment, setSelectedSegment] = useState<string>("discord");

  // Convert file to Base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = async (file: File, imageType: string) => {
    try {
      const base64 = await getBase64(file);
      setBase64Images({ ...base64Images, [imageType]: base64 });
      setBrandConfig({ ...brandConfig, [imageType]: base64 });
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

  useEffect(() => {
    updateSiteConfig({ ...config, brand: brandConfig });
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
      description: "Choose regions from where ",
      layout: "vertical",
      input: (
        <Input
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
        <ImgCrop rotationSlider aspect={1 / 1}>
          <Upload showUploadList={false} maxCount={1} beforeUpload={(file: RcFile) => beforeUpload(file, "icon")}>
            {base64Images.icon === "" ? (
              <Button icon={<UploadOutlined />} style={{ width: 60, height: 60 }}></Button>
            ) : (
              <Image
                src={`${brandConfig?.icon}`}
                height={60}
                width={60}
                alt="image"
                style={{ cursor: "pointer", border: "1px solid var(--border-color)" }}
              />
            )}
          </Upload>
        </ImgCrop>
      ),
      inputName: "icon",
    },
    {
      title: "Brand logo",
      layout: "vertical",

      description: "The primary logo should be transparent and at least 600 x 72px.",
      input: (
        <ImgCrop rotationSlider aspect={2 / 1}>
          <Upload showUploadList={false} maxCount={1} beforeUpload={(file: RcFile) => beforeUpload(file, "logo")}>
            {base64Images.logo === "" ? (
              <Button icon={<UploadOutlined />} style={{ width: 100 }}>
                Logo
              </Button>
            ) : (
              <Image src={`${brandConfig?.logo}`} height={100} width={200} alt="image" style={{ cursor: "pointer" }} />
            )}
          </Upload>
        </ImgCrop>
      ),
      inputName: "logo",
    },

    {
      title: "Social links",
      optional: true,
      description: "Add social links ",
      layout: "vertical",
      input: (
        <Flex vertical gap={10}>
          <Segmented
            className={styles.segment}
            onChange={(value) => setSelectedSegment(value)}
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
            addonBefore={`https://${selectedSegment}.com`}
            type="url"
            onChange={(e) => {
              onUpdateBrandConfig(
                `https://${selectedSegment}.com/${e.currentTarget.value}`,
                `socialLinks.${selectedSegment}`
              );
            }}
            placeholder={`Add ${selectedSegment} link`}
          />
        </Flex>
      ),
      inputName: "social",
    },
  ];
  return (
    <div className={styles.brand__wrapper}>
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
              {brandItems.length !== i + 1 && <Divider style={{ margin: "0px 0px 15px 0px" }} />}
            </>
          );
        })}
      </Form>
    </div>
  );
};

export default BrandForm;
