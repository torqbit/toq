import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { User } from "@prisma/client";
import { FC } from "react";

import { useMediaQuery } from "react-responsive";
import SetupPlatform from "./components/Setup/SetupPlatform";
import Hero from "./components/Hero/Hero";
import Blogs from "@/templates/standard/components/Blog/Blogs";
import Features from "./components/Feature/Features";
import CourseList from "@/templates/standard/components/Courses/Courses";
interface IStandardTemplateProps {
  user: User;
  siteConfig: PageSiteConfig;
  previewMode?: boolean;
}

const StandardTemplate: FC<IStandardTemplateProps> = ({ user, siteConfig, previewMode }) => {
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

      {siteConfig.sections?.courses && (
        <CourseList title={"Courses"} description={"Description on courses"} courseList={[]} previewMode={true} />
      )}
      {siteConfig.sections?.blog && <Blogs title={"Blogs"} description={"Description on blogs"} blogList={[]} />}
    </MarketingLayout>
  );
};

export default StandardTemplate;
