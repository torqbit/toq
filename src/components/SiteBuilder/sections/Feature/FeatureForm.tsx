import { FC, useEffect, useState } from "react";
import styles from "./FeatureForm.module.scss";
import {
  Button,
  ColorPicker,
  Divider,
  Dropdown,
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
import { IFeatureCard, IFeatureInfo } from "@/types/landing/feature";
import { PageSiteConfig } from "@/services/siteConstant";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import Image from "next/image";
import { createSlug, extractValue, getExtension } from "@/lib/utils";
import { postWithFile } from "@/services/request";
import SvgIcons from "@/components/SvgIcons";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";

const AddFeatureForm: FC<{
  imageType: string;
  index: number;
  imgPath: string;
  link: string;
  isIconExist: boolean;
  beforeUpload: (file: RcFile, imageType: string, index: number) => void;
  handleFeatureChange: (index: number, key: string, value: string) => void;
}> = ({ beforeUpload, handleFeatureChange, imageType, index, link, imgPath, isIconExist }) => {
  let text =
    link && !link.includes(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`)
      ? "https://"
      : process.env.NEXT_PUBLIC_NEXTAUTH_URL;

  const [addonText, setAddonText] = useState<string>(text || `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`);
  return (
    <div className={styles.feature__card__form}>
      <div>
        <Form.Item layout="vertical" name={`icon${index}`} label="Upload icon">
          <ImgCrop fillColor={"transparent"} rotationSlider aspect={1 / 1}>
            <Upload
              showUploadList={false}
              maxCount={1}
              beforeUpload={(file: RcFile) => beforeUpload(file, imageType, index)}
            >
              {!isIconExist ? (
                <Button icon={<UploadOutlined />} style={{ width: 60 }}>
                  Logo
                </Button>
              ) : (
                <Tooltip title="Upload icon">
                  <Image src={`${imgPath}`} height={60} width={60} alt="image" style={{ cursor: "pointer" }} />
                </Tooltip>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
      </div>

      <Form.Item layout="vertical" name={`title_${index}`} label="Title">
        <Input
          style={{ width: "100%" }}
          onChange={(e) => {
            handleFeatureChange(index, "title", e.currentTarget.value);
          }}
          placeholder="Add  title "
        />
      </Form.Item>
      <Form.Item layout="vertical" name={`description_${index}`} label="Description">
        <Input
          style={{ width: "100%" }}
          onChange={(e) => {
            handleFeatureChange(index, "description", e.currentTarget.value);
          }}
          placeholder="Add  description "
        />
      </Form.Item>
      <Form.Item layout="vertical" name={`link_${index}`} label="Link">
        <Input
          addonBefore={
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "1",
                    label: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,

                    onClick: () => {
                      setAddonText(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`);
                    },
                  },
                  {
                    key: "2",
                    label: "https://",

                    onClick: () => {
                      setAddonText("https://");
                    },
                  },
                ],
              }}
            >
              <div className={styles.link__dropdown}>
                <i>{SvgIcons.chevronDownOutline}</i>

                {addonText}
              </div>
            </Dropdown>
          }
          onChange={(e) => {
            handleFeatureChange(
              index,
              "link",
              e.currentTarget.value.startsWith("http") ? e.currentTarget.value : `${addonText}/${e.currentTarget.value}`
            );
          }}
          placeholder="Add link "
        />
      </Form.Item>
    </div>
  );
};

const FeatureForm: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const [form] = Form.useForm();
  const [featureConfig, setFeatureConfig] = useState<IFeatureInfo | undefined>(config?.sections?.features);
  const [featureSegment, setFeatureSegment] = useState<string>("first");

  const [featureImages, setFeatureImages] = useState<{ firstIcon: string; secondIcon: string; thirdIcon: string }>({
    firstIcon: featureConfig?.items[0].img ? featureConfig?.items[0].img : "",
    secondIcon: featureConfig?.items[1].img ? featureConfig?.items[1].img : "",
    thirdIcon: featureConfig?.items[2].img ? featureConfig?.items[2].img : "",
  });

  const beforeUpload = async (file: File, imageType: string, index: number) => {
    try {
      if (file) {
        const imgName = `feature-${createSlug(imageType)}.${getExtension(file.name)}`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("imgName", imgName);
        formData.append("previousPath", featureConfig?.items[index].img.split("/").pop() as string);

        const postRes = await postWithFile(formData, `/api/v1/admin/site/image/save`);
        if (!postRes.ok) {
          throw new Error("Failed to upload file");
        }
        const res = await postRes.json();

        if (res.success) {
          setFeatureImages({ ...featureImages, [imageType]: `/static/${res.imgName}` });
          handleFeatureChange(index, "img", `/static/${res.imgName}`);
        }
      }
    } catch (error) {
      message.error(`Error uploading file: ${file.name}`);
    }
    return false;
  };

  const handleFeatureChange = (index: number, key: string, value: string) => {
    setFeatureConfig((prevTheme: any) => {
      const updatedFeatureList = [...prevTheme.items];
      updatedFeatureList[index] = {
        ...updatedFeatureList[index],
        [key]: value,
      };

      return {
        ...prevTheme,
        items: updatedFeatureList,
      };
    });
  };

  useEffect(() => {
    updateSiteConfig({
      ...config,
      sections: {
        ...config.sections,
        features: featureConfig,
      },
    });
  }, [featureConfig]);

  const addFeatureList = [
    {
      key: "first",
      link: `${featureConfig?.items[0].link}`,
      imageType: "firstIcon",
      index: 0,
      imgPath: `${featureConfig?.items[0].img}`,
      isIconExist: featureImages.firstIcon !== "",
      handleFeatureConfig: handleFeatureChange,
      beforeUpload: beforeUpload,
    },
    {
      key: "second",
      link: `${featureConfig?.items[1].link}`,

      imageType: "secondIcon",
      index: 1,
      imgPath: `${featureConfig?.items[1].img}`,
      isIconExist: featureImages.secondIcon !== "",
      handleFeatureConfig: handleFeatureChange,
      beforeUpload: beforeUpload,
    },
    {
      key: "third",
      link: `${featureConfig?.items[2].link}`,

      imageType: "thirdIcon",
      index: 2,
      imgPath: `${featureConfig?.items[2].img}`,
      isIconExist: featureImages.thirdIcon !== "",
      handleFeatureConfig: handleFeatureChange,
      beforeUpload: beforeUpload,
    },
  ];

  let initialValues = {
    title: config.sections?.features?.title,
    description: config.sections?.features?.description,
    title_0: config.sections?.features?.items[0].title,
    description_0: config.sections?.features?.items[0].description,
    link_0: extractValue(`${config.sections?.features?.items[0].link}`),

    title_1: config.sections?.features?.items[1].title,
    description_1: config.sections?.features?.items[1].description,
    link_1: extractValue(`${config.sections?.features?.items[1].link}`),

    title_2: config.sections?.features?.items[2].title,
    description_2: config.sections?.features?.items[2].description,
    link_2: extractValue(`${config.sections?.features?.items[2].link}`),
  };

  const featureItems: IConfigForm[] = [
    {
      title: "Feature Title",
      description: "Add a Title  for feature ",
      input: (
        <Input
          style={{ width: 250 }}
          onChange={(e) => {
            setFeatureConfig({ ...featureConfig, title: e.currentTarget.value } as IFeatureInfo);
          }}
          placeholder="Add feature title "
        />
      ),
      inputName: "title",
    },

    {
      title: "Feature description",
      description: "Add description for feature ",
      layout: "vertical",
      input: (
        <Input.TextArea
          showCount
          maxLength={250}
          style={{ marginBottom: 15 }}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onChange={(e) => {
            setFeatureConfig({ ...featureConfig, description: e.currentTarget.value } as IFeatureInfo);
          }}
          placeholder="Add description"
        />
      ),
      inputName: "description",
    },

    {
      title: "Feature List",
      description: "Add features list ",
      layout: "vertical",

      input: (
        <Flex vertical>
          <Segmented
            className={styles.segment}
            options={[
              {
                label: "First",
                value: "first",
              },
              {
                label: "Second",
                value: "second",
              },
              {
                label: "Third",
                value: "third",
              },
            ]}
            onChange={(value) => setFeatureSegment(value)}
          />
          {addFeatureList.map((list, i) => {
            return (
              <div style={{ width: "50%", marginTop: featureSegment === list.key ? 15 : 0 }}>
                {featureSegment === list.key && (
                  <AddFeatureForm
                    key={i}
                    imageType={list.imageType}
                    index={list.index}
                    imgPath={list.imgPath}
                    link={list.link}
                    isIconExist={list.isIconExist}
                    beforeUpload={list.beforeUpload}
                    handleFeatureChange={list.handleFeatureConfig}
                  />
                )}
              </div>
            );
          })}
        </Flex>
      ),
      inputName: "",
    },
  ];

  return (
    <div className={styles.feature__wrapper}>
      <ConfigFormLayout formTitle="Add Features">
        <Form form={form} requiredMark={false} initialValues={initialValues}>
          {featureItems.map((item, i) => {
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
                  divider={i === featureItems.length - 1 ? false : true}
                  inputName={""}
                  optional={item.optional}
                />
              </>
            );
          })}
        </Form>
      </ConfigFormLayout>
    </div>
  );
};

export default FeatureForm;
