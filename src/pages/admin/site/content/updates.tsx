import Site from "@/components/SiteBuilder/Site";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { GetServerSidePropsContext, NextPage } from "next";

const SiteContent: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return <Site siteConfig={siteConfig} contentType="content" />;
};

export default SiteContent;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();

  return {
    props: {
      siteConfig: siteConfig.site,
    },
  };
};
