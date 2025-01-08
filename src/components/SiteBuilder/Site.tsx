import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import PreviewSite from "@/components/PreviewCode/PreviewSite";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import { Button, Flex, message } from "antd";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import SiteDesigner from "./SiteDesigner";

const Site: FC<{ siteConfig: PageSiteConfig; contentType: "design" | "content" }> = ({ siteConfig, contentType }) => {
  const [messageApi, contexHolder] = message.useMessage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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
    <SiteBuilderLayout siteConfig={config} siteDesigner={<SiteDesigner config={config} updateSiteConfig={setConfig} />}>
      {contexHolder}

      <>
        <Flex vertical align="flex-end" style={{ marginBottom: 20 }} gap={20}>
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
        </Flex>
        <PreviewSite
          ref={iframeRef}
          siteConfig={config}
          src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/admin/site/preview/${siteConfig.template}`}
        />
      </>
    </SiteBuilderLayout>
  );
};

export default Site;
