import { FC, useEffect, useState } from "react";
import styles from "./FeatureForm.module.scss";
import { Button, ColorPicker, Divider, Flex, Form, FormInstance, Input, message, Segmented, Upload } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { IFeatureCard, IFeatureInfo } from "@/types/landing/feature";
import { PageSiteConfig } from "@/services/siteConstant";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import Image from "next/image";

const FeatureForm: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const [form] = Form.useForm();
  const [featureConfig, setFeatureConfig] = useState<IFeatureInfo | undefined>(config?.sections?.feature?.featureInfo);

  const [base64Images, setBase64Images] = useState<{ firstIcon: string; secondIcon: string; thirdIcon: string }>({
    firstIcon: featureConfig?.featureList[0].img ? featureConfig?.featureList[0].img : "",
    secondIcon: featureConfig?.featureList[1].img ? featureConfig?.featureList[1].img : "",
    thirdIcon: featureConfig?.featureList[2].img ? featureConfig?.featureList[2].img : "",
  });

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUploadFirstIcon = async (file: File) => {
    try {
      const base64 = await getBase64(file);
      setBase64Images({ ...base64Images, firstIcon: base64 });
      setFeatureConfig({
        ...featureConfig,
        featureList: [
          {
            ...featureConfig?.featureList[0],
            img: base64,
          },
          {
            ...featureConfig?.featureList[1],
          },
          {
            ...featureConfig?.featureList[2],
          },
        ],
      } as IFeatureInfo);
    } catch (error) {
      message.error(`Error uploading file: ${file.name}`);
    }
    return false;
  };

  const beforeUploadSecondIcon = async (file: File) => {
    try {
      const base64 = await getBase64(file);
      setBase64Images({ ...base64Images, secondIcon: base64 });
      setFeatureConfig({
        ...featureConfig,
        featureList: [
          {
            ...featureConfig?.featureList[0],
          },
          {
            ...featureConfig?.featureList[1],
            img: base64,
          },
          {
            ...featureConfig?.featureList[2],
          },
        ],
      } as IFeatureInfo);
    } catch (error) {
      message.error(`Error uploading file: ${file.name}`);
    }
    return false;
  };
  const beforeUploadThirdIcon = async (file: File) => {
    try {
      const base64 = await getBase64(file);
      setBase64Images({ ...base64Images, thirdIcon: base64 });
      setFeatureConfig({
        ...featureConfig,
        featureList: [
          {
            ...featureConfig?.featureList[0],
          },
          {
            ...featureConfig?.featureList[1],
          },
          {
            ...featureConfig?.featureList[2],
            img: base64,
          },
        ],
      } as IFeatureInfo);
    } catch (error) {
      message.error(`Error uploading file: ${file.name}`);
    }
    return false;
  };
  useEffect(() => {
    updateSiteConfig({
      ...config,
      sections: {
        ...config.sections,
        feature: {
          featureInfo: featureConfig,
        },
      },
    });
  }, [featureConfig]);
  const featureItems: IConfigForm[] = [
    {
      title: "Feature Title",
      description: "Add a Title  for feature ",
      layout: "vertical",
      input: (
        <Input
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
        <Flex vertical gap={10}>
          <div className={styles.feature__card__form}>
            <ImgCrop rotationSlider aspect={1 / 1}>
              <Upload showUploadList={false} maxCount={1} beforeUpload={(file: RcFile) => beforeUploadFirstIcon(file)}>
                {base64Images.firstIcon === "" ? (
                  <Button icon={<UploadOutlined />} style={{ width: 60 }}>
                    Logo
                  </Button>
                ) : (
                  <Image
                    src={`${featureConfig?.featureList[0].img}`}
                    height={60}
                    width={60}
                    alt="image"
                    style={{ cursor: "pointer" }}
                  />
                )}
              </Upload>
            </ImgCrop>
            <Input
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                      title: e.currentTarget.value,
                    },
                    {
                      ...featureConfig?.featureList[1],
                    },
                    {
                      ...featureConfig?.featureList[2],
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  title "
            />
            <Input
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                      description: e.currentTarget.value,
                    },
                    {
                      ...featureConfig?.featureList[1],
                    },
                    {
                      ...featureConfig?.featureList[2],
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  description "
            />
            <Input
              addonBefore={"https://"}
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                      link: `/${e.currentTarget.value}`,
                    },
                    {
                      ...featureConfig?.featureList[1],
                    },
                    {
                      ...featureConfig?.featureList[2],
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  link "
            />
          </div>
          <div className={styles.feature__card__form}>
            <ImgCrop rotationSlider aspect={1 / 1}>
              <Upload showUploadList={false} maxCount={1} beforeUpload={(file: RcFile) => beforeUploadSecondIcon(file)}>
                {base64Images.firstIcon === "" ? (
                  <Button icon={<UploadOutlined />} style={{ width: 60 }}>
                    Logo
                  </Button>
                ) : (
                  <Image
                    src={`${featureConfig?.featureList[1].img}`}
                    height={60}
                    width={60}
                    alt="image"
                    style={{ cursor: "pointer" }}
                  />
                )}
              </Upload>
            </ImgCrop>
            <Input
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                    },
                    {
                      ...featureConfig?.featureList[1],
                      title: e.currentTarget.value,
                    },
                    {
                      ...featureConfig?.featureList[2],
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  title "
            />
            <Input
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                    },
                    {
                      ...featureConfig?.featureList[1],
                      description: e.currentTarget.value,
                    },
                    {
                      ...featureConfig?.featureList[2],
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  description "
            />
            <Input
              addonBefore={"https://"}
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                    },
                    {
                      ...featureConfig?.featureList[1],
                      link: `/${e.currentTarget.value}`,
                    },
                    {
                      ...featureConfig?.featureList[2],
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  link "
            />
          </div>
          <div className={styles.feature__card__form}>
            <ImgCrop rotationSlider aspect={1 / 1}>
              <Upload showUploadList={false} maxCount={1} beforeUpload={(file: RcFile) => beforeUploadThirdIcon(file)}>
                {base64Images.firstIcon === "" ? (
                  <Button icon={<UploadOutlined />} style={{ width: 60 }}>
                    Logo
                  </Button>
                ) : (
                  <Image
                    src={`${featureConfig?.featureList[2].img}`}
                    height={60}
                    width={60}
                    alt="image"
                    style={{ cursor: "pointer" }}
                  />
                )}
              </Upload>
            </ImgCrop>
            <Input
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                    },
                    {
                      ...featureConfig?.featureList[1],
                    },
                    {
                      ...featureConfig?.featureList[2],
                      title: e.currentTarget.value,
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  title "
            />
            <Input
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                    },
                    {
                      ...featureConfig?.featureList[1],
                    },
                    {
                      ...featureConfig?.featureList[2],
                      description: e.currentTarget.value,
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  description "
            />
            <Input
              addonBefore={"https://"}
              onChange={(e) => {
                setFeatureConfig({
                  ...featureConfig,
                  featureList: [
                    {
                      ...featureConfig?.featureList[0],
                    },
                    {
                      ...featureConfig?.featureList[1],
                      link: `/${e.currentTarget.value}`,
                    },
                    {
                      ...featureConfig?.featureList[2],
                    },
                  ],
                } as IFeatureInfo);
              }}
              placeholder="Add  link "
            />
          </div>
        </Flex>
      ),
      inputName: "",
    },
  ];

  console.log(config.sections?.feature?.featureInfo, "feature info");

  return (
    <div className={styles.feature__wrapper}>
      <Form
        form={form}
        requiredMark={false}
        initialValues={{
          title: config.sections?.feature?.featureInfo?.title,
          description: config.sections?.feature?.featureInfo?.description,
        }}
      >
        {featureItems.map((item, i) => {
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
                divider={i === featureItems.length - 1 ? false : true}
                inputName={""}
                optional={item.optional}
              />
              {featureItems.length !== i + 1 && <Divider style={{ margin: "0px 0px 15px 0px" }} />}
            </>
          );
        })}
      </Form>
    </div>
  );
};

export default FeatureForm;
