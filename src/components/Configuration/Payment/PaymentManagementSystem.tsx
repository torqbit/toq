import { Button, Flex, Form, Input, message, Select, Steps, Tag } from "antd";
import ConfigFormLayout from "../ConfigFormLayout";
import ConfigForm from "../ConfigForm";
import { FC, useEffect, useState } from "react";
import FormDisableOverlay from "../FormDisableOverlay";
import { $Enums } from "@prisma/client";
import paymentsClient from "@/lib/admin/payments/payments-client";
import { PaymentAuthConfig, PaymentInfoConfig } from "@/types/payment";
import SvgIcons from "@/components/SvgIcons";
import { useRouter } from "next/router";

const PaymentManagementSystem: FC<{ active: boolean }> = ({ active }) => {
  const [paymentAuthForm] = Form.useForm();
  const [paymentInfoForm] = Form.useForm();
  const paymentGateway = $Enums.gatewayProvider.CASHFREE;
  const router = useRouter();
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

  const verifyPaymentAuth = () => {
    let data: PaymentAuthConfig = {
      ...paymentAuthForm.getFieldsValue(),
      gateway: paymentGateway,
      apiKey: paymentAuthForm.getFieldsValue().apiKey,
      secretKey: paymentAuthForm.getFieldsValue().secretKey,
    };

    paymentsClient.verifyPaymentGateway(
      data,
      (response) => {
        messageApi.success(response.message);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const savePaymentConfiguration = () => {
    let data: PaymentInfoConfig = {
      ...paymentInfoForm.getFieldsValue(),
      gateway: paymentGateway,
      currency: paymentInfoForm.getFieldsValue().currency,
      paymentMethods: paymentInfoForm
        .getFieldsValue()
        .paymentMethods.map((r: any) => (typeof r !== "object" ? r : r.value)),
    };

    paymentsClient.savePaymentGatewayConfig(
      data,
      (response) => {
        messageApi.success(response.message);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  useEffect(() => {
    active &&
      paymentsClient.getPaymentGatewayConfig(
        paymentGateway,
        (response) => {
          if (response.body) {
          }
          if (response.body && response.body.state == "AUTHENTICATED") {
            setCurrent(1);
          } else if (response.body && response.body.state == "PAYMENT_CONFIGURED") {
            console.log(response.body.config);
            setCurrent(2);
            paymentInfoForm.setFieldsValue({
              currency: response.body.config.currency,
              paymentMethods: response.body.config.paymentMethods,
            });
          }
        },
        (error) => {
          messageApi.error(error);
        }
      );
  }, [active]);

  const paymentSecretItems = [
    {
      title: "API Key",
      description: "The API Key that will be used to authenticate with the Cashfree service",
      optional: false,

      input: <Input placeholder="Ap1Key123" width={250} />,
      inputName: "apiKey",
    },

    {
      title: "Secret Key",
      optional: false,
      description: "The secret key that will be used to authenticate with the Cashfree service",
      input: <Input.Password placeholder="*********" />,
      inputName: "secretKey",
    },
  ];

  const paymentInfo = [
    {
      title: "Select Currency",
      description: "Choose the preferred currency for the end users",
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
      inputName: "currency",
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
      inputName: "paymentMethods",
      optional: true,
    },
  ];
  return (
    <>
      {contextHolder}
      <h3>Payments</h3>
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
                          paymentAuthForm.resetFields();
                        }}
                      >
                        Reset
                      </Button>
                    }

                    {current > 0 ? (
                      <Tag style={{ padding: "5px 10px" }}>
                        <Flex align="center" gap={5}>
                          <i style={{ lineHeight: 0, fontSize: 15 }}>{SvgIcons.checkFilled}</i>
                          <span>Connected</span>
                        </Flex>
                      </Tag>
                    ) : (
                      <Button onClick={() => paymentAuthForm.submit()} type="primary">
                        Connect
                      </Button>
                    )}
                  </Flex>
                }
                formTitle={"Configure Cashfree"}
              >
                <Form form={paymentAuthForm} onFinish={verifyPaymentAuth} requiredMark={false}>
                  {paymentSecretItems.map((item, i) => {
                    return (
                      <ConfigForm
                        input={
                          <Form.Item
                            style={{ width: 250 }}
                            name={item.inputName}
                            rules={[{ required: true, message: "API key is required!" }]}
                          >
                            {<Input.Password disabled={current > 0} placeholder={"***************"} />}
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
                          paymentInfoForm.resetFields();
                        }}
                      >
                        Reset
                      </Button>
                    }

                    <Button onClick={() => paymentInfoForm.submit()} type="primary">
                      Save
                    </Button>
                  </Flex>
                }
                formTitle={"Payment Information"}
              >
                <Form form={paymentInfoForm} onFinish={savePaymentConfiguration} requiredMark={false}>
                  {paymentInfo.map((item, i) => {
                    return (
                      <ConfigForm
                        key={item.inputName}
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
