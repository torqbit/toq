import { Button, Flex, Form, Input, message, Select, Steps } from "antd";
import ConfigFormLayout from "../ConfigFormLayout";
import ConfigForm from "../ConfigForm";
import { useState } from "react";
import FormDisableOverlay from "../FormDisableOverlay";
import { $Enums } from "@prisma/client";
import paymentsClient from "@/lib/admin/payments/payments-client";
import { PaymentAuthConfig } from "@/types/payment";

const PaymentManagementSystem = () => {
  const [paymentAuthForm] = Form.useForm();
  const [paymentInfoForm] = Form.useForm();
  const paymentGateway = $Enums.gatewayProvider.CASHFREE;

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

  const paymentSecretItems = [
    {
      title: "API Key",
      description: "The API Key that will be used to authenticate with the Cashfree service",
      optional: false,

      input: <Input placeholder='Ap1Key123' width={250} />,
      inputName: "apiKey",
    },

    {
      title: "Secret Key",
      optional: false,

      description: "The secret key that will be used to authenticate with the Cashfree service",
      input: <Input.Password placeholder='*********' />,
      inputName: "secretKey",
    },
  ];

  const paymentInfo = [
    {
      title: "Select Currency",
      description: "Choose regions from where the video will be accessed and streamed to the users",
      input: (
        <Select style={{ width: 250 }} placeholder='Select currency '>
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
        <Select labelInValue optionLabelProp='label' style={{ width: 250 }} mode='tags' placeholder='Select payment methods'>
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
      <h3>Payments</h3>
      <Steps
        current={current}
        status='finish'
        size='small'
        progressDot
        direction='vertical'
        items={[
          {
            title: (
              <ConfigFormLayout
                extraContent={
                  <Flex align='center' gap={10}>
                    {
                      <Button
                        onClick={() => {
                          paymentAuthForm.resetFields();
                        }}>
                        Reset
                      </Button>
                    }

                    <Button onClick={() => paymentAuthForm.submit()} type='primary'>
                      Connect
                    </Button>
                  </Flex>
                }
                formTitle={"Configure Cashfree"}>
                <Form form={paymentAuthForm} onFinish={verifyPaymentAuth} requiredMark={false}>
                  {paymentSecretItems.map((item, i) => {
                    return (
                      <ConfigForm
                        input={
                          <Form.Item name={item.inputName} rules={[{ required: !item.optional, message: `Field is required!` }]} key={i}>
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
                  <Flex align='center' gap={10}>
                    {
                      <Button
                        onClick={() => {
                          paymentInfoForm.resetFields();
                        }}>
                        Reset
                      </Button>
                    }

                    <Button onClick={() => paymentInfoForm.submit()} type='primary'>
                      Save
                    </Button>
                  </Flex>
                }
                formTitle={"Payment Information"}>
                <Form form={paymentInfoForm} onFinish={() => {}} requiredMark={false}>
                  {paymentInfo.map((item, i) => {
                    return (
                      <ConfigForm
                        input={
                          <Form.Item name={item.inputName} rules={[{ required: !item.optional, message: `Field is required!` }]} key={i}>
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
