import Users from "@/components/Admin/Users/Users";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { GetServerSidePropsContext, NextPage } from "next";

const UsersPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <>
      <Users siteConfig={siteConfig} />
    </>
  );
};
export default UsersPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
