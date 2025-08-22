import { FC, useState } from "react";
import styles from "./SiteConfigure.module.scss";

import { Button, Flex, Form, Input, message } from "antd";
import Link from "next/link";
import SvgIcons from "../../SvgIcons";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { postFetch } from "@/services/request";
import { useRouter } from "next/router";
import AiLoader from "@/components/AiLoader";
import { useAppContext } from "@/components/ContextApi/AppContext";

const BasicInfo: FC<{ title: string; description: string; siteConfig: PageSiteConfig }> = ({
  title,
  description,
  siteConfig,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { globalState } = useAppContext();
  const [messageApi, contexHolder] = message.useMessage();

  const onFinish = async () => {
    setLoading(true);
    const res = await postFetch(
      {
        ...form.getFieldsValue(),
      },
      "/api/v1/admin/tenants/setup"
    );
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        router.push(result.destination);
      } else {
        messageApi.error(result.message);
      }
    } else {
      const result = await res.json();
      setLoading(false);
      form.resetFields();
      messageApi.error(result.message);
    }
  };

  const wordRotateMessages = [
    "Fetching details about the product.",
    "Extracting the logos, icons and images from the website.",
    "Understanding more about your brand.",
    "We are almost there, hold on for few more seconds.",
    "Generating FAQs for your product.",
  ];

  return (
    <section className={styles.basic__info__container}>
      {contexHolder}
      {loading ? (
        <>
          <AiLoader showWordRotate wordRotateMessages={wordRotateMessages} minHeight="100vh" />
        </>
      ) : (
        <div className={styles.basic__info}>
          <Link href={"/"}>
            <Flex align="center" gap={5}>
              <img
                src={globalState.theme == "dark" ? `${siteConfig.brand?.darkLogo}` : `${siteConfig?.brand?.logo}`}
                style={{ height: "40px" }}
                height={40}
                width={"auto"}
                alt={"logo"}
                loading="lazy"
              />
            </Flex>
          </Link>
          <h3>{title}</h3>
          <Form
            initialValues={{
              brandColor: DEFAULT_THEME.brand.brandColor,
            }}
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className={styles.form__container}
          >
            <Form.Item
              name={"domain"}
              style={{ width: "100%" }}
              label="Enter your company URL"
              rules={[{ required: true, message: "company URL is required" }]}
            >
              <Input type="url" placeholder="https://acme.com " style={{ width: "100%" }} />
            </Form.Item>
            <Button loading={loading} htmlType="submit" type="primary">
              Continue <i style={{ fontSize: 18, lineHeight: 0 }}> {SvgIcons.arrowRight}</i>
            </Button>
          </Form>
        </div>
      )}
    </section>
  );
};

export default BasicInfo;
