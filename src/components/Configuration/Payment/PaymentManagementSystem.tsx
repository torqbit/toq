import { Button, Flex, Form, Input, message, Select, Steps } from "antd";
import ConfigFormLayout from "../ConfigFormLayout";
import ConfigForm from "../ConfigForm";
import { useState } from "react";
import FormDisableOverlay from "../FormDisableOverlay";

const PaymentManagementSystem = () => {
  const [form] = Form.useForm();
  const [infoForm] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState<number>(0);

  const orderCurrency = ["INR", "USD", "EUR"];
  const paymentMethods = [
    { name: "UPI", value: "upi" },
    { name: "App", value: "app" },
    { name: "Debit Card", value: "dc" },
    { name: "Credit Card", value: "cc" },
    { name: "Net Banking", value: "nb" },
  ];

  const paymentSecretItems = [
    {
      title: "Secret Id",
      description: "Choose regions from where the video will be accessed and streamed to the users",
      optional: false,

      input: <Input.Password placeholder="Add secret id" />,
      inputName: "secretId",
    },

    {
      title: "Client Id",
      optional: false,

      description:
        "The list of domains that are allowed to access the videos. If no hostnames are listed all requests will be allowed.",
      input: <Input.Password placeholder="Add client id" />,
      inputName: "clientId",
    },
  ];

  const paymentInfo = [
    {
      title: "Select Currency",
      description: "Choose regions from where the video will be accessed and streamed to the users",
      input: (
        <Select style={{ width: 250 }} placeholder="Select currency ">
          {orderCurrency.map((currency, i) => {
            return (
              <Select.Option key={i} value={`${currency}`}>
                {currency}
              </Select.Option>
            );
          })}
        </Select>
      ),
      inputName: "replicationRegion",
    },
    {
      title: "Payment Methods",
      description: "Use a custom domain that will be used to access images",
      input: (
        <Select
          labelInValue
          optionLabelProp="label"
          style={{ width: 250 }}
          mode="tags"
          placeholder="Select payment methods"
        >
          {paymentMethods.map((methods, i) => {
            return (
              <Select.Option key={i} value={`${methods.value}`}>
                {methods.name}
              </Select.Option>
            );
          })}
        </Select>
      ),
      inputName: "domainNames",
      optional: true,
    },
  ];
  return (
    <>
      {contextHolder}
      <h3>Payment Management System</h3>
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
                extraContent={
                  <Flex align="center" gap={10}>
                    {
                      <Button
                        onClick={() => {
                          form.resetFields();
                        }}
                      >
                        Reset
                      </Button>
                    }

                    <Button onClick={() => form.submit()} type="primary">
                      Connect
                    </Button>
                  </Flex>
                }
                formTitle={"Configure Cashfree"}
              >
                <Form form={form} onFinish={() => {}} requiredMark={false}>
                  {paymentSecretItems.map((item, i) => {
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
                        divider={i === paymentSecretItems.length - 1 ? false : true}
                        inputName={""}
                        optional={item.optional}
                      />
                    );
                  })}
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
                          infoForm.resetFields();
                        }}
                      >
                        Reset
                      </Button>
                    }

                    <Button onClick={() => infoForm.submit()} type="primary">
                      Save
                    </Button>
                  </Flex>
                }
                formTitle={"Payment Information"}
              >
                <Form form={infoForm} onFinish={() => {}} requiredMark={false}>
                  {paymentInfo.map((item, i) => {
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
                        divider={i === paymentInfo.length - 1 ? false : true}
                        inputName={""}
                        optional={item.optional}
                      />
                    );
                  })}
                  {/* {current < 1 && <FormDisableOverlay />} */}
                </Form>
              </ConfigFormLayout>
            ),
          },
        ]}
      />
    </>
  );
};

export default PaymentManagementSystem;
