import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { User } from "@prisma/client";
import { FC } from "react";

import { useMediaQuery } from "react-responsive";
import SetupPlatform from "./components/Setup/SetupPlatform";
import Hero from "./components/Hero/Hero";
interface IStandardTemplateProps {
  user?: User;
  siteConfig: PageSiteConfig;
}

const StandardTemplate: FC<IStandardTemplateProps> = ({ user, siteConfig }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <MarketingLayout user={user} siteConfig={siteConfig} heroSection={<Hero siteConfig={siteConfig} isMobile={isMobile} user={user} />}>
      <SetupPlatform />
    </MarketingLayout>
  );
};

export default StandardTemplate;
