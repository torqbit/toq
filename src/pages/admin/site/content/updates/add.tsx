import ContentForm from "@/components/Admin/Content/ContentForm";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import ContentNavigation from "@/components/SiteBuilder/ContentNavigation";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { StateType } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";

const AddUpdate: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <SiteBuilderLayout siteConfig={siteConfig} siteContent={<ContentNavigation activeMenu={"updates"} />}>
      <ContentForm contentType={"UPDATE"} htmlData={""} bannerImage={""} title={""} state={StateType.DRAFT} />
    </SiteBuilderLayout>
  );
};

export default AddUpdate;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
