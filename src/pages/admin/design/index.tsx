import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import PreviewSite from "@/components/PreviewCode/PreviewSite";
import SiteBuilder from "@/components/SiteBuilder/SiteBuilder";
import { getSiteConfig } from "@/services/getSiteConfig";
import { postFetch } from "@/services/request";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { Button, Flex, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import prisma from "@/lib/prisma";

const SiteDesign: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contexHolder] = message.useMessage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);

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
    const res = await postFetch({ config }, "/api/v1/admin/site/site-info/update");
    const result = await res.json();
    if (res.ok) {
      messageApi.success(result.message);
    } else {
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
            onClick={() => {
              updateYamlFile(config);
            }}
            type="primary"
          >
            Save
          </Button>
        </div>
        <PreviewSite ref={iframeRef} />
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
