import ContentList from "@/components/Admin/Content/ContentList";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import PreviewSite from "@/components/PreviewCode/PreviewSite";
import SiteBuilder from "@/components/SiteBuilder/SiteBuilder";
import SvgIcons from "@/components/SvgIcons";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import { Button, Flex, MenuProps, message } from "antd";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import styles from "@/components/Layouts/SiteBuilder.module.scss";
import SiteContent from "./SiteContent";

const Site: FC<{ siteConfig: PageSiteConfig; contentType: "design" | "content" }> = ({ siteConfig, contentType }) => {
  const [messageApi, contexHolder] = message.useMessage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>(contentType);
  const activeMenu = router.pathname.includes("blogs") ? "blogs" : "updates";
  const contentId = typeof router.query.id === "string" ? router.query.id : undefined;

  const onChangeMenu = (value: string) => {
    switch (value) {
      case "updates":
        return router.push(`/admin/site/content/updates`);

      default:
        return router.push(`/admin/site/content/blogs`);
    }
  };

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

  const contentMenu: MenuProps["items"] = [
    {
      label: "Blogs",
      key: "blogs",
      icon: (
        <i
          style={{ fontSize: 18 }}
          className={activeMenu === "blogs" ? styles.selected__menu__icon : styles.content__menu__icon}
        >
          {SvgIcons.newsPaper}
        </i>
      ),
    },
    {
      label: "Updates",
      key: "updates",
      icon: (
        <i
          style={{ fontSize: 18 }}
          className={activeMenu === "updates" ? styles.selected__menu__icon : styles.content__menu__icon}
        >
          {SvgIcons.update}
        </i>
      ),
    },
  ];

  useEffect(() => {
    sendMessageToIframe();
  }, [config]);

  const onChange = (value: string) => {
    switch (value) {
      case "content":
        return router.push(`/admin/site/content/blogs`);

      case "design":
        setSelectedTab("design");
        return router.push("/admin/site/design");
    }
  };

  return (
    <SiteBuilderLayout
      siteConfig={config}
      sideBar={
        <SiteBuilder
          selectedMenu={activeMenu}
          setSelectedMenu={onChangeMenu}
          selectedTab={selectedTab}
          contentMenu={contentMenu}
          onChangeTab={onChange}
          config={config}
          updateSiteConfig={setConfig}
        />
      }
    >
      {contexHolder}
      {selectedTab === "design" ? (
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
      ) : (
        <SiteContent activeMenu={activeMenu} contentId={contentId} />
      )}
    </SiteBuilderLayout>
  );
};

export default Site;
