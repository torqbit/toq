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
      icon: "/img/landing/auth.png",
      title: "Authentication",
      description: "Configure authentication with Google, Github or any other",
      link: "#",
      iconBgColor: "red",
    },
    {
      icon: "/img/landing/auth.png",
      title: "Authentication",
      description: "Configure authentication with Google, Github or any other",
      link: "#",
      iconBgColor: "blue",
    },
    {
      icon: "/img/landing/auth.png",
      title: "Authentication",
      description: "Configure authentication with Google, Github or any other",
      link: "#",
      iconBgColor: "green",
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
