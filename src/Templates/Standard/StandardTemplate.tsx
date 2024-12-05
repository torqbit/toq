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
        title={featureInfo?.title ? featureInfo.title : DEFAULT_THEME.sections.feature.featureInfo.title}
        description={
          featureInfo?.description ? featureInfo.description : DEFAULT_THEME.sections.feature.featureInfo.description
        }
        featureList={featureInfo?.featureList && featureInfo?.featureList.length > 0 ? featureInfo?.featureList : []}
      />

      {siteConfig.sections?.courses && (
        <CourseList
          title={
            siteConfig.sections.courses.title ? siteConfig.sections.courses.title : DEFAULT_THEME.sections.courses.title
          }
          description={
            siteConfig.sections.courses.description
              ? siteConfig.sections.courses.description
              : DEFAULT_THEME.sections.courses.description
          }
          courseList={[]}
          previewMode={previewMode}
        />
      )}
      {siteConfig.sections?.blog && (
        <Blogs
          title={siteConfig.sections.blog.title ? siteConfig.sections.blog.title : DEFAULT_THEME.sections.blog.title}
          description={
            siteConfig.sections.blog.description
              ? siteConfig.sections.blog.description
              : DEFAULT_THEME.sections.blog.description
          }
          blogList={[]}
          previewMode={previewMode}
        />
      )}
    </MarketingLayout>
  );
};

export default StandardTemplate;
