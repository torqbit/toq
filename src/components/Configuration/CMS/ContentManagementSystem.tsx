import { Button, Flex, Form, Input, message, Select, Steps } from "antd";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import { FC, ReactNode, useEffect, useState } from "react";
import cmsClient from "@/lib/admin/cms/cmsClient";
import styles from "./CMS.module.scss";
import FormDisableOverlay from "../FormDisableOverlay";

import cmsConstant from "@/lib/admin/cms/cmsConstant";
import { PageSiteConfig } from "@/services/siteConstant";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { ConfigurationState } from "@prisma/client";
import SvgIcons from "@/components/SvgIcons";

export interface IConfigForm {
  title: string;
  description: string;
  input: ReactNode;
  inputName: string;
  optional?: boolean;
  divider?: boolean;
}

const ContentManagementSystem: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [accessKeyForm] = Form.useForm();
  const [selectedWatermark, setWatermark] = useState<string | null>(null);
  const [initialValue, setInitialValue] = useState<{
    vod: {
      replicatedRegions?: string[];
      allowedDomains?: string[];
      videoResolutions?: string[];
    };
  }>();

  const [replicationRegions, setRegions] = useState<{ name: string; code: string }[]>([]);
  const [videoForm] = Form.useForm();
  const [cdnForm] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [vodLoading, setVodLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState<number>(0);
  let logoUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${siteConfig.brand?.logo}`;
  let iconUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/img/logo.png`;

  const videoItems = [
    {
      title: "Choose Replication Regions",
      description: "Choose regions from where the video will be accessed and streamed to the users",
      optional: false,

      input: (
        <Select
          labelInValue
          optionLabelProp="label"
          style={{ width: 250 }}
          mode="tags"
          placeholder="Choose replication regions"
        >
          {replicationRegions.map((region, i) => {
            return (
              <Select.Option key={i} value={`${region.code}`}>
                {region.name}
              </Select.Option>
            );
          })}
        </Select>
      ),
      inputName: "replicatedRegions",
    },

    {
      title: "Upload Watermark",
      optional: true,

      description:
        "Automatically watermark uploaded videos. The watermark is encoded into the video itself and cannot be removed after encoding.",
      input: (
        <Flex className={styles.watermark__options} align="center" gap={20}>
          <div
            onClick={() => {
              if (iconUrl === selectedWatermark) {
                setWatermark(null);
              } else {
                setWatermark(iconUrl);
              }
            }}
            className={iconUrl === selectedWatermark ? styles.selected__watermark : ""}
          >
            <img src={iconUrl} alt="torqbit icon" />
          </div>
          <div
            onClick={() => {
              if (logoUrl === selectedWatermark) {
                setWatermark(null);
              } else {
                setWatermark(logoUrl);
              }
            }}
            className={logoUrl === selectedWatermark ? styles.selected__watermark : ""}
          >
            <img src={logoUrl} alt="torqbit logo" />
          </div>
        </Flex>
      ),
      inputName: "watermarkUrl",
    },
    {
      title: "Set Resolutions",
      optional: false,

      description:
        "Select te enabled resolutions that will be encoded. Only resolutions smaller than or equal to the original video resolutions will be used during encoding.",
      input: (
        <Select
          labelInValue
          optionLabelProp="label"
          style={{ width: 250 }}
          mode="tags"
          placeholder="Select resolutions"
        >
          {cmsConstant.videoResolutions.map((resolution, i) => {
            return (
              <Select.Option key={i} value={`${resolution.value}`}>
                {resolution.label}
              </Select.Option>
            );
          })}
        </Select>
      ),
      inputName: "videoResolutions",
    },
  ];

  const cdnItems: IConfigForm[] = [
    {
      title: "Main Storage Region",
      description:
        "Give a name to the storage zone that will be storing all the static images for courses, events and users",
      input: <Input placeholder="Add main storage name" />,

      inputName: "mainStorageName",
    },
    {
      title: "Choose Replication Regions",
      description: "Choose regions from where the video will be accessed and streamed to the users",
      input: (
        <Select
          labelInValue
          optionLabelProp="label"
          style={{ width: 250 }}
          mode="tags"
          placeholder="Choose replication regions"
        >
          {replicationRegions.map((region, i) => {
            return (
              <Select.Option key={i} value={`${region.code}`}>
                {region.name}
              </Select.Option>
            );
          })}
        </Select>
      ),
      inputName: "replicationRegion",
    },
    {
      title: "Custom Domain",
      description: "Use a custom domain that will be used to access images",
      input: <Input placeholder="Add custom domain" />,
      inputName: "domainNames",
      optional: true,
    },

    {
      title: "Allowed hostnames",
      optional: true,

      description:
        "The list of hostnames that are allowed to access the images. If no hostnames are listed all requests will be allowed.",
      input: <Select mode="tags" suffixIcon={<></>} placeholder="Add hostnames" open={false} style={{ width: 250 }} />,
      inputName: "hostNames",
    },
  ];

  const listRegions = () => {
    try {
      cmsClient.listReplicationRegions(
        "ACCESS_KEY",
        "bunny.net",
        (result) => {
          setRegions(result.regions);

          setLoading(false);
        },
        (error) => {
          setCurrent(0);
          messageApi.error(error);
          setLoading(false);
        }
      );
    } catch (error) {
      setCurrent(0);
      messageApi.error(error as string);
      setLoading(false);
    }
  };

  const onTestAccessKey = () => {
    try {
      setLoading(true);
      cmsClient.testAccessKey(
        accessKeyForm.getFieldsValue().accessKey,
        "bunny.net",
        (result) => {
          listRegions();
          setCurrent(1);
          messageApi.success(result.message);
        },
        (error) => {
          setCurrent(0);
          messageApi.error(error);
          setLoading(false);
        }
      );
    } catch (error) {
      setCurrent(0);
      messageApi.error(error as string);
      setLoading(false);
    }
  };

  const onSubmitVideoInfo = () => {
    setVodLoading(true);

    let data = {
      ...videoForm.getFieldsValue(),
      replicatedRegions: videoForm
        .getFieldsValue()
        .replicatedRegions.map((r: any) => (typeof r === "object" ? r.value : r)),
      videoResolutions: videoForm
        .getFieldsValue()
        .videoResolutions.map((r: any) => (typeof r === "object" ? r.value : r)),
      watermarkUrl: selectedWatermark || undefined,
      brandName: siteConfig.brand?.name,
      playerColor: siteConfig.brand?.brandColor,
      provider: "bunny.net",
    };

    cmsClient.addVod(
      data,
      (result) => {
        messageApi.success(result.message);
        setCurrent(2);
        setVodLoading(false);
      },
      (error) => {
        messageApi.error(error);
        setVodLoading(false);
      }
    );
  };

  const getCurrentStep = (status: ConfigurationState) => {
    switch (status) {
      case ConfigurationState.AUTHENTICATED:
        return setCurrent(1);
      case ConfigurationState.VOD_CONFIGURED:
        return setCurrent(2);
      case ConfigurationState.CDN_CONFIGURED:
        return setCurrent(3);
      default:
        return setCurrent(0);
    }
  };
  const getDetail = () => {
    cmsClient.getConfigDetail(
      "bunny.net",
      (result) => {
        listRegions();
        setInitialValue({
          ...initialValue,
          vod: {
            replicatedRegions: result.config.vodConfig?.replicatedRegions,
            allowedDomains: result.config.vodConfig?.allowedDomains,
            videoResolutions: result.config.vodConfig?.videoResolutions,
          },
        });
        setWatermark(result.config.vodConfig?.watermarkUrl as string);
        getCurrentStep(result.config.state as ConfigurationState);
        videoForm.setFieldsValue({
          replicatedRegions: result.config.vodConfig?.replicatedRegions,
          videoResolutions: result.config.vodConfig?.videoResolutions,
        });
      },
      (error) => {}
    );
  };
  useEffect(() => {
    getDetail();
  }, []);

  return (
    <section>
      {contextHolder}
      <h3>Content Management System</h3>

      <Steps
        current={current}
        status="finish"
        size="small"
        progressDot
        direction="vertical"
        items={[
          {
            title: (
              <ConfigFormLayout
                formTitle={"Configure Bunny.net"}
                extraContent={
                  <Flex align="center" gap={10}>
                    {current < 0 && <Button onClick={() => accessKeyForm.resetFields()}>Reset</Button>}

                    <Button
                      loading={loading}
                      disabled={current > 0}
                      onClick={() => accessKeyForm.submit()}
                      type="primary"
                    >
                      {current > 0 ? (
                        <Flex align="center" gap={5}>
                          <i style={{ lineHeight: 0 }}>{SvgIcons.checkFilled}</i>
                          Connected
                        </Flex>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </Flex>
                }
              >
                <Form form={accessKeyForm} onFinish={onTestAccessKey} requiredMark={false}>
                  <ConfigForm
                    input={
                      <Form.Item
                        style={{ width: 250 }}
                        name={"accessKey"}
                        rules={[{ required: true, message: "Access key is required!" }]}
                      >
                        {current < 0 && <Input.Password placeholder="Add access key" />}
                      </Form.Item>
                    }
                    title={"Bunny.net Access Key"}
                    description={
                      "Provide access key for Bunny.net that will be used to configure video stream, image CDN and file storage"
                    }
                    divider={false}
                    inputName={""}
                  />
                </Form>
              </ConfigFormLayout>
            ),
          },
          {
            title: (
              <ConfigFormLayout
                extraContent={
                  <Flex align="center" gap={10}>
                    {
                      <Button
                        onClick={() => {
                          videoForm.resetFields();
                          setWatermark(null);
                        }}
                      >
                        Reset
                      </Button>
                    }

                    <Button onClick={() => videoForm.submit()} type="primary">
                      Save
                    </Button>
                  </Flex>
                }
                formTitle={"Video On Demand"}
              >
                <Form form={videoForm} onFinish={onSubmitVideoInfo} requiredMark={false}>
                  {videoItems.map((item, i) => {
                    return (
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
                        divider={i === videoItems.length - 1 ? false : true}
                        inputName={""}
                        optional={item.optional}
                      />
                    );
                  })}
                  {current < 1 && <FormDisableOverlay />}
                </Form>
              </ConfigFormLayout>
            ),
          },
          {
            title: (
              <ConfigFormLayout
                extraContent={
                  <Flex align="center" gap={10}>
                    {<Button onClick={() => cdnForm.resetFields()}>Reset</Button>}

                    <Button onClick={() => cdnForm.submit()} type="primary">
                      Save
                    </Button>
                  </Flex>
                }
                formTitle={"Content Delivery Network-Images"}
              >
                <Form form={cdnForm}>
                  {cdnItems.map((item, i) => {
                    return (
                      <ConfigForm
                        input={
                          <Form.Item
                            rules={[{ required: !item.optional, message: `Field is required!` }]}
                            name={item.inputName}
                            key={i}
                          >
                            {item.input}
                          </Form.Item>
                        }
                        title={item.title}
                        description={item.description}
                        divider={i === cdnItems.length - 1 ? false : true}
                        optional={item.optional}
                        inputName={""}
                      />
                    );
                  })}
                  {current < 2 && <FormDisableOverlay />}
                </Form>
              </ConfigFormLayout>
            ),
          },
        ]}
      />
    </section>
  );
};

export default ContentManagementSystem;
