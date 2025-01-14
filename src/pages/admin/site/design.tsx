import { useAppContext } from "@/components/ContextApi/AppContext";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import PreviewSite from "@/components/PreviewCode/PreviewSite";
import SiteDesigner from "@/components/SiteBuilder/SiteDesigner";
import { getSiteConfig } from "@/services/getSiteConfig";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const SiteDesign: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [activeKey, setActiveKey] = useState<string>("");
  const [messageApi, contentHolder] = message.useMessage();
  const { dispatch } = useAppContext();
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

  useEffect(() => {
    if (activeKey) {
      const iframe = document.getElementById("myIframe") as HTMLIFrameElement;
      const iframeDocument = iframe?.contentWindow?.document;

      if (iframeDocument) {
        iframe.contentWindow.location.hash = activeKey;
      }
    }
  }, [activeKey]);

  useEffect(() => {
    sendMessageToIframe();
  }, [config]);

  const updateYamlFile = async () => {
    const res = await postFetch({ config }, "/api/v1/admin/site/site-info/update");
    const result = await res.json();
    if (res.ok) {
      messageApi.success(result.message);
      router.reload();
    } else {
      messageApi.error(result.error);
    }
  };

  return (
    <SiteBuilderLayout
      updateYamlFile={updateYamlFile}
      siteConfig={{ ...siteConfig, brand: { ...siteConfig.brand, defaultTheme: config.brand?.defaultTheme } }}
      setConfig={setConfig}
      siteDesigner={
        <SiteDesigner setActiveKey={setActiveKey} activeKey={activeKey} config={config} updateSiteConfig={setConfig} />
      }
    >
      {contentHolder}
      <div>
        <PreviewSite
          id="myIframe"
          ref={iframeRef}
          siteConfig={config}
          src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/admin/site/preview/${siteConfig.template}${`#${activeKey}`}`}
        />
      </div>
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
