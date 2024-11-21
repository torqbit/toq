import BasicInfo from "@/components/SiteConfigure/BasicInfo";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { GetServerSidePropsContext, NextPage } from "next";

const OnboardPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <>
      <BasicInfo
        title={"Set up your site."}
        description={"Don't worry, you can always change this later."}
        siteConfig={siteConfig}
      />
    </>
  );
};

export default OnboardPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { site } = getSiteConfig();
  const siteConfig = site;
  if (siteConfig.updated) {
    return {
      redirect: {
        permanent: false,
        destination: "/signup",
      },
    };
  }
  return {
    props: {
      siteConfig,
    },
  };
};
