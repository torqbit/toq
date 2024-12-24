import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import PreviewSite from "@/components/PreviewCode/PreviewSite";
import SiteBuilder from "@/components/SiteBuilder/SiteBuilder";
import { getSiteConfig } from "@/services/getSiteConfig";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import { Button, Flex, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const SiteDesign: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contexHolder] = message.useMessage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const sendMessageToIframe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "SITE_CONFIG",
          payload: config,
        },
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`
      );
    }
  };

  const updateYamlFile = async (config: PageSiteConfig) => {
    setLoading(true);
    const res = await postFetch({ config }, "/api/v1/admin/site/site-info/update");
    const result = await res.json();
    if (res.ok) {
      setLoading(false);

      messageApi.success(result.message);
    } else {
      setLoading(false);

      messageApi.error(result.error);
    }
  };

  useEffect(() => {
    sendMessageToIframe();
  }, [config]);

  return (
    <SiteBuilderLayout siteConfig={config} sideBar={<SiteBuilder config={config} updateSiteConfig={setConfig} />}>
      {contexHolder}
      <Flex vertical align="flex-end" gap={20}>
        <div>
          <Button
            loading={loading}
            onClick={() => {
              updateYamlFile(config);
            }}
            type="primary"
          >
            Save
          </Button>
        </div>
        <PreviewSite
          ref={iframeRef}
          src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/admin/site/preview/${siteConfig.template}`}
        />
      </Flex>
    </SiteBuilderLayout>
  );
};

export default SiteDesign;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
