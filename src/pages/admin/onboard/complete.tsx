import { useAppContext } from "@/components/ContextApi/AppContext";
import SiteSetup from "@/components/OnBoarding/SiteSetup/SiteSetup";
import antThemeConfig from "@/services/antThemeConfig";
import darkThemeConfig from "@/services/darkThemeConfig";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { ISiteSetupCard } from "@/types/setup/siteSetup";
import { ConfigProvider } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";

const SiteSetupPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { globalState } = useAppContext();

  const setupOptions: ISiteSetupCard[] = [
    {
      icon: "/img/landing/site-design.png",
      title: "Site Design",
      description:
        "Customize your site to suit your brand's color theme, add content to your landing page and much more",
      link: "/admin/site/design",
    },
    {
      icon: "/img/landing/video-stream.png",
      title: "Content Management",
      description:
        "Configure video streaming, image and other file storage that will be used when creating lessons, assignments and certificates",
      link: "/admin/settings?tab=cms",
    },
    {
      icon: "/img/landing/payment.png",
      title: "Payments System",
      description: "Configure your payment gateway through which you can earn instantly from all the course sales",
      link: "/admin/settings?tab=pms",
    },
  ];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${siteConfig.brand?.brandColor}`);
  }, []);

  return (
    <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
      <SiteSetup siteConfig={siteConfig} setupOptions={setupOptions} />;
    </ConfigProvider>
  );
};
export default SiteSetupPage;
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { site } = getSiteConfig();
  const siteConfig = site;

  return {
    props: {
      siteConfig,
    },
  };
};
