import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import PreviewSite from "@/components/PreviewCode/PreviewSite";
import SiteDesigner from "@/components/SiteBuilder/SiteDesigner";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const SiteDesign: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [activeKey, setActiveKey] = useState<string>("");

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

      // Change the URL of the iframe and scroll to the target section
      if (iframeDocument) {
        iframe.contentWindow.location.hash = activeKey;
      }
    }
  }, [activeKey]);

  useEffect(() => {
    sendMessageToIframe();
  }, [config]);

  return (
    <SiteBuilderLayout
      siteConfig={siteConfig}
      siteDesigner={
        <SiteDesigner setActiveKey={setActiveKey} activeKey={activeKey} config={config} updateSiteConfig={setConfig} />
      }
    >
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
