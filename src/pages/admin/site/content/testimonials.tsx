import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import ContentNavigation from "@/components/SiteBuilder/ContentNavigation";
import BasicInfoForm from "@/components/SiteBuilder/sections/BasicInfoForm/BasicInfoForm";
import { getSiteConfig } from "@/services/getSiteConfig";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import AddTestimonial from "@/templates/standard/components/Testimonials/AddTestimonials";
import { Button, Flex, Form, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";

const Testimonials: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contentHolder] = message.useMessage();
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const updateYamlFile = async (message?: string) => {
    !message && setLoading(true);

    const res = await postFetch({ config }, "/api/v1/admin/site/site-info/update");
    const result = await res.json();
    if (res.ok) {
      setLoading(false);
      messageApi.success(message ? message : "Testimonials has been updated");
    } else {
      setLoading(false);
      messageApi.error(result.error);
    }
  };

  const onSaveBasicInfo = () => {
    siteConfig.sections?.testimonials &&
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          testimonials: {
            ...siteConfig.sections?.testimonials,
            title: form.getFieldsValue().title,
            description: form.getFieldsValue().description,
          },
        },
      });
  };

  return (
    <SiteBuilderLayout siteConfig={siteConfig} siteContent={<ContentNavigation activeMenu={"testimonials"} />}>
      {contentHolder}
      <Flex vertical gap={20}>
        <h4 style={{ margin: "0" }}> Testimonials</h4>

        <BasicInfoForm
          form={form}
          onFinish={onSaveBasicInfo}
          extraContent={
            <Button type="primary" onClick={() => updateYamlFile("Testimonials basic info has been updated")}>
              Save
            </Button>
          }
          initialValue={{
            title: siteConfig.sections?.testimonials?.title,
            description: siteConfig.sections?.testimonials?.description,
          }}
        />
        <Flex align="center" justify="space-between" style={{ marginBottom: 20, maxWidth: 1000 }}>
          <h4 style={{ margin: "0" }}>Add Testimonials</h4>

          <Button type="primary" loading={loading} onClick={() => updateYamlFile()}>
            Save
          </Button>
        </Flex>
        <AddTestimonial siteConfig={config} setConfig={setConfig} />
      </Flex>
    </SiteBuilderLayout>
  );
};

export default Testimonials;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
