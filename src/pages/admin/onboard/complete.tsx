import { useAppContext } from "@/components/ContextApi/AppContext";
import SiteSetup from "@/components/OnBoarding/SiteSetup/SiteSetup";
import antThemeConfig from "@/services/antThemeConfig";
import darkThemeConfig from "@/services/darkThemeConfig";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { ISiteSetupCard } from "@/types/setup/siteSetup";
import { Theme } from "@/types/theme";
import { ConfigProvider } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";

const SiteSetupPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { globalState, dispatch } = useAppContext();

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

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };
  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (siteConfig.brand?.themeSwitch && currentTheme) {
      localStorage.setItem("theme", currentTheme);
    } else {
      if (siteConfig.brand?.defaultTheme) {
        localStorage.setItem("theme", siteConfig.brand?.defaultTheme);
      } else {
        localStorage.setItem("theme", "light");
      }
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);
  };
  useEffect(() => {
    onCheckTheme();
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
