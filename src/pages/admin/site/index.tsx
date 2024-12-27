import BlogList from "@/components/Admin/Content/BlogList";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import PreviewSite from "@/components/PreviewCode/PreviewSite";
import SiteBuilder from "@/components/SiteBuilder/SiteBuilder";
import SvgIcons from "@/components/SvgIcons";
import { getSiteConfig } from "@/services/getSiteConfig";
import { postFetch } from "@/services/request";
import { PageSiteConfig } from "@/services/siteConstant";
import { Button, Flex, MenuProps, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "@/components/Layouts/SiteBuilder.module.scss";

const SiteDesign: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [messageApi, contexHolder] = message.useMessage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>("design");
  const [selectedMenu, setSelectedMenu] = useState<string>("blogs");

  const onChangeMenu = (value: string) => {
    switch (value) {
      case "updates":
        setSelectedMenu("updates");
        return router.push(`/admin/site?tab=content&content=updates`);

      default:
        setSelectedMenu("blogs");
        return router.push(`/admin/site?tab=content&content=blogs`);
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
        <i className={selectedMenu === "blogs" ? styles.selected__menu__icon : styles.content__menu__icon}>
          {SvgIcons.newsPaper}
        </i>
      ),
    },
    {
      label: "Updates",
      key: "updates",
      icon: (
        <i className={selectedMenu === "updates" ? styles.selected__menu__icon : styles.content__menu__icon}>
          {SvgIcons.update}
        </i>
      ),
    },
  ];

  useEffect(() => {
    sendMessageToIframe();
  }, [config]);

  useEffect(() => {
    if (typeof router.query.tab === "string") {
      onChange(router.query.tab);
    }
  }, []);

  const onChange = (value: string) => {
    switch (value) {
      case "content":
        setSelectedTab("content");
        typeof router.query.content === "string" && setSelectedMenu(router.query.content);
        return router.push(
          `/admin/site?tab=content&content=${router.query.content ? router.query.content : selectedMenu}`
        );

      default:
        setSelectedTab("design");
        return router.push("/admin/site?tab=design");
    }
  };

  return (
    <SiteBuilderLayout
      siteConfig={config}
      sideBar={
        <SiteBuilder
          selectedMenu={selectedMenu}
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
        <Flex vertical gap={10}>
          <h4 style={{ paddingTop: 5 }}>{selectedMenu === "updates" ? "Updates" : "Blogs"}</h4>

          <BlogList contentType={selectedMenu === "updates" ? "UPDATE" : "BLOG"} />
        </Flex>
      )}
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
