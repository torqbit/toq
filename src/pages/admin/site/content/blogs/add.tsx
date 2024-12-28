import ContentForm from "@/components/Admin/Content/ContentForm";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import ContentNavigation from "@/components/SiteBuilder/ContentNavigation";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { StateType } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";

const AddBlog: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <SiteBuilderLayout siteConfig={siteConfig} siteContent={<ContentNavigation activeMenu={"blogs"} />}>
      <ContentForm contentType={"BLOG"} htmlData={""} bannerImage={""} title={""} state={StateType.DRAFT} />
    </SiteBuilderLayout>
  );
};

export default AddBlog;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
