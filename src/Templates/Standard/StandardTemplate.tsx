import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { User } from "@prisma/client";
import { FC } from "react";

import { useMediaQuery } from "react-responsive";

import Hero from "./components/Hero/Hero";
import SetupPlatform from "./components/Setup/SetupPlatform";
import Features from "./components/Feature/Features";
interface IStandardTemplateProps {
  user: User;
  siteConfig: PageSiteConfig;
}

const StandardTemplate: FC<IStandardTemplateProps> = ({ user, siteConfig }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const featureInfo = siteConfig.sections?.feature?.featureInfo;

  return (
    <MarketingLayout
      user={user}
      siteConfig={siteConfig}
      heroSection={<Hero siteConfig={siteConfig} isMobile={isMobile} user={user} />}
    >
      <SetupPlatform />
      <Features
        title={featureInfo?.title ? featureInfo.title : ""}
        description={featureInfo?.description ? featureInfo.description : ""}
        featureList={featureInfo?.featureList && featureInfo?.featureList.length > 0 ? featureInfo?.featureList : []}
      />
    </MarketingLayout>
  );
};

export default StandardTemplate;
