import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { User } from "@prisma/client";
import { FC, useEffect } from "react";

import { useMediaQuery } from "react-responsive";
import Hero from "./components/Hero/Hero";
import Blogs from "@/templates/standard/components/Blog/Blogs";
import Features from "./components/Feature/Features";
import CourseList from "@/templates/standard/components/Courses/Courses";
import { IBlogCard } from "@/types/landing/blog";
import FAQ from "./components/FAQ/FAQ";
import Testimonial from "./components/Testimonials/Testimonials";
import styles from "./StandardTemplate.module.scss";
import { ICourseListItem } from "@/types/courses/Course";
import LearningList from "./components/Academy/AcademyItemsList";
import { ILearningPathDetail } from "@/types/learingPath";

interface IStandardTemplateProps {
  user: User;
  siteConfig: PageSiteConfig;
  previewMode?: boolean;
  courseList: ICourseListItem[];
  blogList: IBlogCard[];
  learningList: ILearningPathDetail[];
}

const StandardTemplate: FC<IStandardTemplateProps> = ({
  user,
  siteConfig,
  courseList,
  previewMode,
  blogList,
  learningList,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const featureInfo = siteConfig.sections?.features;

  let featuresItems = previewMode
    ? featureInfo?.items.map((item) => {
        return {
          ...item,
          link: "#features",
        };
      })
    : featureInfo?.items;

  return (
    <MarketingLayout
      user={previewMode ? undefined : user}
      siteConfig={siteConfig}
      previewMode={previewMode}
      homeLink={previewMode ? "#" : "/"}
      heroSection={<Hero siteConfig={siteConfig} isMobile={isMobile} user={user} />}
    >
      {/* <SetupPlatform /> */}
      {featureInfo?.enabled && (
        <section className={styles.section__wrapper} id="features">
          <Features
            title={featureInfo?.title ? featureInfo.title : DEFAULT_THEME.sections.features.title}
            description={
              featureInfo?.description ? featureInfo.description : DEFAULT_THEME.sections.features.description
            }
            items={featuresItems && featuresItems.length > 0 ? featuresItems : []}
            enabled={featureInfo?.enabled}
          />
        </section>
      )}

      {siteConfig.sections?.courses?.enable && siteConfig.brand && (previewMode || courseList.length > 0) && (
        <section className={styles.section__wrapper} id="courses">
          <CourseList
            title={
              siteConfig.sections.courses.title
                ? siteConfig.sections.courses.title
                : DEFAULT_THEME.sections.courses.title
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
        </section>
      )}

      {siteConfig.sections?.learning?.enabled && siteConfig.brand && (previewMode || learningList.length > 0) && (
        <section className={styles.section__wrapper} id="learning">
          <LearningList
            title={
              siteConfig.sections.learning.title
                ? siteConfig.sections.learning.title
                : DEFAULT_THEME.sections.learning.title
            }
            description={
              siteConfig.sections.learning.description
                ? siteConfig.sections.learning.description
                : DEFAULT_THEME.sections.learning.description
            }
            learningList={learningList}
            previewMode={previewMode}
            brand={siteConfig.brand}
          />
        </section>
      )}
      {siteConfig.sections?.blog?.enable && (previewMode || blogList.length > 0) && (
        <section className={styles.section__wrapper} id="blogs">
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
        </section>
      )}
      {siteConfig.sections?.faq?.enabled && (
        <section
          id="faq"
          className={
            previewMode || (siteConfig.sections.faq.items && siteConfig.sections.faq.items.length > 0)
              ? styles.section__wrapper
              : ""
          }
        >
          <FAQ previewMode={previewMode} siteConfig={siteConfig} faqList={siteConfig.sections.faq.items} />
        </section>
      )}
      {siteConfig.sections?.testimonials?.enabled && (
        <section
          id="testimonials"
          className={
            previewMode || (siteConfig.sections.testimonials.items && siteConfig.sections.testimonials.items.length > 0)
              ? styles.section__wrapper
              : ""
          }
        >
          <Testimonial
            siteConfig={siteConfig}
            previewMode={previewMode}
            testimonialList={siteConfig.sections.testimonials.items || DEFAULT_THEME.sections.tesimonials.items}
          />
        </section>
      )}
    </MarketingLayout>
  );
};

export default StandardTemplate;
