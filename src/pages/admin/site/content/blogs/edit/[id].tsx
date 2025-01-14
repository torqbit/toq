import ContentForm from "@/components/Admin/Content/ContentForm";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import ContentNavigation from "@/components/SiteBuilder/ContentNavigation";

import BlogService, { IContentData } from "@/services/BlogService";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { LoadingOutlined } from "@ant-design/icons";
import { StateType } from "@prisma/client";
import { Flex, message, Spin } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EditBlog: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [contentData, setContentData] = useState<IContentData>({
    htmlData: "",
    bannerImage: "",
    title: "",
    state: StateType.DRAFT,
  });
  const router = useRouter();
  const contentId = `${router.query.id}`;
  const getContentData = (id: string) => {
    setLoading(true);
    BlogService.getContentInfo(
      id,
      (result) => {
        setContentData(result.contentData);
        setLoading(false);
      },
      (error) => {
        setLoading(false);

        messageApi.error(error);
      }
    );
  };

  useEffect(() => {
    router.query.id && getContentData(contentId);
  }, [contentId]);
  return (
    <SiteBuilderLayout siteConfig={siteConfig} siteContent={<ContentNavigation activeMenu={"blogs"} />}>
      {contextHolder}

      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <ContentForm
          contentType={"BLOG"}
          htmlData={contentData?.htmlData}
          bannerImage={contentData?.bannerImage}
          title={contentData?.title}
          state={contentData?.state}
          contentId={contentId}
        />
      </Spin>
    </SiteBuilderLayout>
  );
};

export default EditBlog;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
