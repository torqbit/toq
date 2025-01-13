import ContentList from "@/components/Admin/Content/ContentList";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import ContentNavigation from "@/components/SiteBuilder/ContentNavigation";
import BasicInfoForm from "@/components/SiteBuilder/sections/BasicInfoForm/BasicInfoForm";
import { getSiteConfig } from "@/services/getSiteConfig";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import { Form, message, Button } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";

const BlogContent: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contentHolder] = message.useMessage();

  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [form] = Form.useForm();
  const updateYamlFile = async () => {
    const res = await postFetch({ config }, "/api/v1/admin/site/site-info/update");
    const result = await res.json();
    if (res.ok) {
      messageApi.success("Blogs basic info has been updated");
    } else {
      messageApi.error(result.error);
    }
  };
  const onSaveBasicInfo = () => {
    siteConfig.sections?.blog &&
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          blog: {
            ...siteConfig.sections?.blog,
            title: form.getFieldsValue().title,
            description: form.getFieldsValue().description,
          },
        },
      });
  };
  return (
    <SiteBuilderLayout siteConfig={siteConfig} siteContent={<ContentNavigation activeMenu={"blogs"} />}>
      {contentHolder}
      <h4 style={{ margin: "0 0 20px 0" }}>Blogs</h4>
      <BasicInfoForm
        form={form}
        onFinish={onSaveBasicInfo}
        extraContent={
          <Button type="primary" onClick={updateYamlFile}>
            Save
          </Button>
        }
        initialValue={{
          title: siteConfig.sections?.blog?.title,
          description: siteConfig.sections?.blog?.description,
        }}
      />
      <ContentList contentType={"BLOG"} />
    </SiteBuilderLayout>
  );
};

export default BlogContent;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
