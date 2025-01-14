import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import ContentNavigation from "@/components/SiteBuilder/ContentNavigation";
import BasicInfoForm from "@/components/SiteBuilder/sections/BasicInfoForm/BasicInfoForm";
import { getSiteConfig } from "@/services/getSiteConfig";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import AddFAQ from "@/templates/standard/components/FAQ/AddFAQ";
import { Button, Flex, Form, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";

const FAQPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contentHolder] = message.useMessage();
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const updateYamlFile = async () => {
    setLoading(true);
    const res = await postFetch({ config }, "/api/v1/admin/site/site-info/update");
    const result = await res.json();
    if (res.ok) {
      setLoading(false);

      messageApi.success("FAQs has been updated");
    } else {
      setLoading(false);
      messageApi.error(result.error);
    }
  };
  const onSaveBasicInfo = () => {
    siteConfig.sections?.faq &&
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          faq: {
            ...siteConfig.sections?.faq,
            title: form.getFieldsValue().title,
            description: form.getFieldsValue().description,
          },
        },
      });
  };

  return (
    <SiteBuilderLayout siteConfig={siteConfig} siteContent={<ContentNavigation activeMenu={"faq"} />}>
      {contentHolder}

      <Flex vertical gap={20}>
        <h4 style={{ margin: "0px 0 0 0" }}> FAQ</h4>

        <BasicInfoForm
          form={form}
          onFinish={onSaveBasicInfo}
          extraContent={
            <Button type="primary" onClick={updateYamlFile}>
              Save
            </Button>
          }
          initialValue={{
            title: siteConfig.sections?.faq?.title,
            description: siteConfig.sections?.faq?.description,
          }}
        />
        <Flex align="center" justify="space-between" style={{ marginBottom: 20, maxWidth: 1000 }}>
          {" "}
          <h4 style={{ margin: "0px 0 0 0" }}> Add FAQ</h4>
          <Button style={{ margin: "5px 0 0 0" }} type="primary" loading={loading} onClick={updateYamlFile}>
            Save
          </Button>
        </Flex>
      </Flex>

      <AddFAQ siteConfig={siteConfig} setConfig={setConfig} />
    </SiteBuilderLayout>
  );
};

export default FAQPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
