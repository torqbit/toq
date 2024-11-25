import ConfigurationSettings from "@/components/Configuration/ConfigurationSettings";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { GetServerSidePropsContext, NextPage } from "next";

const ConfigurationPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return <ConfigurationSettings siteConfig={siteConfig} />;
};

export default ConfigurationPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
