import { useSiteConfig } from "@/components/ContextApi/SiteConfigContext";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { User } from "@prisma/client";
import { FC } from "react";

import { useMediaQuery } from "react-responsive";
import SetupPlatform from "./components/Setup/SetupPlatform";
import Hero from "./components/Hero/Hero";
interface IStandardTemplateProps {
  user: User;
  siteConfig: PageSiteConfig;
}

const StandardTemplate: FC<IStandardTemplateProps> = ({ user, siteConfig }) => {
  const { sections } = useSiteConfig();
  let featureInfo = siteConfig?.sections?.feature?.featureInfo ?? DEFAULT_THEME.sections.feature.featureInfo;
  let FeatureComponent = sections?.feature?.component ?? DEFAULT_THEME.sections.feature.component;
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <MarketingLayout
      user={user}
      siteConfig={siteConfig}
      heroSection={<Hero siteConfig={siteConfig} isMobile={isMobile} user={user} />}
    >
      <SetupPlatform />
      <FeatureComponent
        title={featureInfo?.title}
        description={featureInfo?.description}
        featureList={featureInfo?.featureList}
      />
    </MarketingLayout>
  );
};

export default StandardTemplate;
