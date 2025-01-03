import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { User } from "@prisma/client";
import { FC } from "react";

import { useMediaQuery } from "react-responsive";
import Hero from "./components/Hero/Hero";
import Blogs from "@/templates/standard/components/Blog/Blogs";
import Features from "./components/Feature/Features";
import CourseList from "@/templates/standard/components/Courses/Courses";
import { ICourseCard } from "@/types/landing/courses";
import { IBlogCard } from "@/types/landing/blog";
import FAQList from "./components/FAQ/FAQList";
import FAQ from "./components/FAQ/FAQ";

interface IStandardTemplateProps {
  user: User;
  siteConfig: PageSiteConfig;
  previewMode?: boolean;
  courseList: ICourseCard[];
  blogList: IBlogCard[];
}

const StandardTemplate: FC<IStandardTemplateProps> = ({ user, siteConfig, courseList, previewMode, blogList }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const featureInfo = siteConfig.sections?.features;

  return (
    <MarketingLayout
      user={user}
      siteConfig={siteConfig}
      heroSection={<Hero siteConfig={siteConfig} isMobile={isMobile} user={user} />}
    >
      {/* <SetupPlatform /> */}
      <Features
        title={featureInfo?.title ? featureInfo.title : DEFAULT_THEME.sections.features.title}
        description={featureInfo?.description ? featureInfo.description : DEFAULT_THEME.sections.features.description}
        items={featureInfo?.items && featureInfo?.items.length > 0 ? featureInfo?.items : []}
      />

      {siteConfig.sections?.courses?.enable && siteConfig.brand && (
        <CourseList
          title={
            siteConfig.sections.courses.title ? siteConfig.sections.courses.title : DEFAULT_THEME.sections.courses.title
          }
          description={
            siteConfig.sections.courses.description
              ? siteConfig.sections.courses.description
              : DEFAULT_THEME.sections.courses.description
          }
          courseList={courseList}
          previewMode={previewMode}
          brand={siteConfig.brand}
        />
      )}
      {siteConfig.sections?.blog?.enable && (
        <Blogs
          title={siteConfig.sections.blog.title ? siteConfig.sections.blog.title : DEFAULT_THEME.sections.blog.title}
          description={
            siteConfig.sections.blog.description
              ? siteConfig.sections.blog.description
              : DEFAULT_THEME.sections.blog.description
          }
          blogList={blogList}
          previewMode={previewMode}
        />
      )}
      {siteConfig.sections?.faq?.enabled && (previewMode || siteConfig.sections.faq.items.length > 0) && (
        <FAQ siteConfig={siteConfig} faqList={siteConfig.sections.faq.items} />
      )}
    </MarketingLayout>
  );
};

export default StandardTemplate;
