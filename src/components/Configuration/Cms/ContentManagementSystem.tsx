import Layout2 from "@/components/Layouts/Layout2";
import { Button, Flex, Form, Input, Steps } from "antd";
import styles from "./Cms.module.scss";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ContentConfigForm from "@/components/Configuration/Cms/ContentConfigForm";
import { ReactNode } from "react";
export interface ICmsForm {
  title: string;
  description: string;
  input: ReactNode;
  inputName: string;
  optional?: boolean;
  divider?: boolean;
}

const ContentManagementSystem = () => {
  const videoItems = [
    {
      title: "Choose Replication Regions",
      description: "Choose regions from where the video will be accessed and streamed to the users",
      input: <Input placeholder="Choose replication regions" />,
      inputName: "replicationRegion",
    },

    {
      title: "Allowed Domain names",
      description:
        "The list of domains that are allowed to access the videos. If no hostnames are listed all requests will be allowed.",
      input: <Input placeholder="Add domain names" />,
      inputName: "domainNames",
    },
    {
      title: "Upload Watermark",
      description:
        "Automatically watermark uploaded videos. The watermark is encoded into the video itself and cannot be removed after encoding.",
      input: <Input placeholder="Add watermark" />,
      inputName: "waterMark",
    },
    {
      title: "Set Resolutions",
      description:
        "Select te enabled resolutions that will be encoded. Only resolutions smaller than or equal to the original video resolutions will be used during encoding.",
      input: <Input placeholder="Set resolutions" />,
      inputName: "resolution",
    },
  ];
  const cdnItems: ICmsForm[] = [
    {
      title: "Image CDN Name",
      description:
        "Give a name to the storage zone that will be storing all the static images for courses, events and users",
      input: <Input placeholder="Add cdn name" />,

      inputName: "cdnName",
    },

    {
      title: "Custom Domain",
      description: "Use a custom domain that will be used to access images",
      input: <Input placeholder="Add custom domain" />,
      inputName: "domainNames",
      optional: true,
    },
  ];

  return (
    <section>
      <h3>Content Management System</h3>
      <Form>
        <Steps
          current={0}
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
                      {<Button>Reset</Button>}

                      <Button type="primary">Connect & Save</Button>
                    </Flex>
                  }
                >
                  <Form.Item name={"accessKey"}>
                    <ContentConfigForm
                      input={<Input placeholder="Add access key" />}
                      title={"Bunny.net Access Key"}
                      description={
                        "Provide access key for Bunny.net that will be used to configure video stream, image CND and file storage"
                      }
                      divider={false}
                    />
                  </Form.Item>
                </ConfigFormLayout>
              ),
            },
            {
              title: (
                <ConfigFormLayout formTitle={"Video On Demand"}>
                  {videoItems.map((item, i) => {
                    return (
                      <Form.Item name={item.inputName} key={i}>
                        <ContentConfigForm
                          input={item.input}
                          title={item.title}
                          description={item.description}
                          divider={i === videoItems.length - 1 ? false : true}
                        />
                      </Form.Item>
                    );
                  })}
                </ConfigFormLayout>
              ),
            },
            {
              title: (
                <ConfigFormLayout formTitle={"Content Delivery Network-Images"}>
                  {cdnItems.map((item, i) => {
                    return (
                      <Form.Item name={item.inputName} key={i}>
                        <ContentConfigForm
                          input={item.input}
                          title={item.title}
                          description={item.description}
                          divider={i === cdnItems.length - 1 ? false : true}
                          optional={item.optional}
                        />
                      </Form.Item>
                    );
                  })}
                </ConfigFormLayout>
              ),
            },
          ]}
        />
      </Form>
    </section>
  );
};

export default ContentManagementSystem;
