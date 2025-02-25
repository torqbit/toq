import { Button, Flex, Form, Input, message, Select } from "antd";
import ConfigFormLayout from "../ConfigFormLayout";
import ConfigForm from "../ConfigForm";
import { FC, useEffect, useState } from "react";
import { PageSiteConfig } from "@/services/siteConstant";
import { IBusinessInfo } from "@/types/schema";
import { getFetch, postFetch } from "@/services/request";

const BusinessConfiguration: FC<{
  siteConfig: PageSiteConfig;
  active: boolean;
}> = ({ siteConfig, active }) => {
  const [businessForm] = Form.useForm();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [businessReset, setBusinessReset] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const saveBusinessConfiguration = async () => {
    let config = { ...siteConfig, businessInfo: businessForm.getFieldsValue() };
    setSaveLoading(true);
    const res = await postFetch({ config }, "/api/v1/admin/site/site-info/update");
    const result = await res.json();
    if (res.ok) {
      setSaveLoading(false);

      messageApi.success("Business info has been updated");
    } else {
      setSaveLoading(false);
      messageApi.error(result.error);
    }
  };

  const getSiteConfig = async () => {
    const res = await getFetch("/api/v1/admin/site/site-info/get");
    const result = await res.json();
    if (res.status == 200) {
      businessForm.setFieldsValue(result.siteConfig.businessInfo);
    } else {
      messageApi.error(result.error);
    }
  };

  const businessFormList = [
    {
      title: "Gst Number",
      description: "Add your gst number",
      optional: false,

      input: <Input placeholder="XXAAAAA0000X1Z" width={250} />,
      inputName: "gstNumber",
    },
    {
      title: "Pan Number",
      description: "Add your pan number",
      optional: false,

      input: <Input placeholder="AAAAA1234F" width={250} />,
      inputName: "panNumber",
    },

    {
      title: "Country",
      description: "Enter your country",
      optional: false,

      input: <Input placeholder="Enter your country" width={250} />,
      inputName: "country",
    },
    {
      title: "State",
      description: "Add your state",
      optional: false,

      input: <Input placeholder="Enter your state" width={250} />,
      inputName: "state",
    },
    {
      title: "Address",
      description: "Add your address",
      optional: false,
      layout: "vertical",

      input: <Input.TextArea rows={3} placeholder="Enter your address" />,
      inputName: "address",
    },
  ];

  useEffect(() => {
    active && businessForm.setFieldsValue(siteConfig.businessInfo);
  }, [active]);
  return (
    <>
      {contextHolder}
      <h3>Business Information</h3>
      <ConfigFormLayout
        width="1136px"
        extraContent={
          <Flex align="center" gap={10}>
            {businessReset ? (
              <Button
                onClick={() => {
                  setBusinessReset(false);
                  getSiteConfig();
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={() => {
                  businessForm.resetFields();
                  setBusinessReset(true);
                }}
              >
                Reset
              </Button>
            )}

            <Button loading={saveLoading} onClick={() => businessForm.submit()} type="primary">
              Save
            </Button>
          </Flex>
        }
        formTitle={"Configure Business Info"}
      >
        <Form form={businessForm} onFinish={saveBusinessConfiguration} requiredMark={false}>
          {businessFormList.map((item, i) => {
            return (
              <div key={i}>
                <ConfigForm
                  layout={item.layout === "vertical" ? "vertical" : "horizontal"}
                  input={
                    <Form.Item
                      name={item.inputName}
                      rules={[{ required: true, message: `${item.inputName}  is required!` }]}
                    >
                      {item.input}
                    </Form.Item>
                  }
                  title={item.title}
                  description={item.description}
                  divider={i === businessFormList.length - 1 ? false : true}
                  optional={item.optional}
                />
              </div>
            );
          })}
        </Form>
      </ConfigFormLayout>
    </>
  );
};

export default BusinessConfiguration;
