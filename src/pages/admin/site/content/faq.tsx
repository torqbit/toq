import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import ContentNavigation from "@/components/SiteBuilder/ContentNavigation";
import FeatureForm from "@/components/SiteBuilder/sections/Feature/FeatureForm";
import { arraysAreEqual } from "@/lib/utils";
import { getSiteConfig } from "@/services/getSiteConfig";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import AddFAQ from "@/templates/standard/components/FAQ/AddFAQ";
import { Button, Flex, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";

const FAQPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contentHolder] = message.useMessage();
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [loading, setLoading] = useState<boolean>(false);
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
  return (
    <SiteBuilderLayout siteConfig={siteConfig} siteContent={<ContentNavigation activeMenu={"faq"} />}>
      {contentHolder}
      <Flex align="center" justify="space-between" style={{ marginBottom: 20, maxWidth: 1000 }}>
        <h4 style={{ margin: "0" }}> FAQ</h4>
        {config.sections?.faq?.items && config.sections?.faq?.items.length > 0 && (
          <Button type="primary" loading={loading} onClick={updateYamlFile}>
            Save
          </Button>
        )}
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
