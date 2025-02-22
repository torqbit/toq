import ContentList from "@/components/Admin/Content/ContentList";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import ContentNavigation from "@/components/SiteBuilder/ContentNavigation";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { Flex } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";

const UpdateContent: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <SiteBuilderLayout siteConfig={siteConfig} siteContent={<ContentNavigation activeMenu={"updates"} />}>
      <Flex vertical style={{ marginTop: 10 }} justify="center" align="center">
        <ContentList contentType={"UPDATE"} />
      </Flex>
    </SiteBuilderLayout>
  );
};

export default UpdateContent;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
