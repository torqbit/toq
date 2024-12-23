import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { courseDifficultyType, StateType, User } from "@prisma/client";
import { FC, useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import SetupPlatform from "./components/Setup/SetupPlatform";
import Hero from "./components/Hero/Hero";
import Blogs from "@/templates/standard/components/Blog/Blogs";
import Features from "./components/Feature/Features";
import CourseList from "@/templates/standard/components/Courses/Courses";
import ProgramService from "@/services/ProgramService";
import { ICourseCard } from "@/types/landing/courses";
import { message } from "antd";
import { convertSecToHourandMin } from "@/pages/admin/content";
interface IStandardTemplateProps {
  user: User;
  siteConfig: PageSiteConfig;
  previewMode?: boolean;
}

const StandardTemplate: FC<IStandardTemplateProps> = ({ user, siteConfig, previewMode }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const [loading, setLoading] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<ICourseCard[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const featureInfo = siteConfig.sections?.features;

  useEffect(() => {
    if (siteConfig.sections?.courses?.enable) {
      setLoading(true);
      ProgramService.getCoursesByAuthor(
        true,
        (res) => {
          let listData =
            res.courses.length > 0
              ? res.courses
                  .filter((c) => c.state === StateType.ACTIVE)
                  .map((course: any) => {
                    let totalDuration = 0;
                    course.chapters.forEach((chap: any) => {
                      chap.resource.forEach((r: any) => {
                        if (r.video) {
                          totalDuration = totalDuration + r.video?.videoDuration;
                        } else if (r.assignment) {
                          totalDuration = totalDuration + Number(r.assignment.estimatedDuration) * 60;
                        }
                      });
                    });
                    let duration = convertSecToHourandMin(totalDuration);
                    return {
                      title: course.name,
                      thumbnail: course.thumbnail || "",
                      duration: `${duration}`,
                      description: course.description,
                      link: `/courses/${course.slug}`,
                      courseType: course.courseType,
                      price: Number(course.coursePrice),
                      difficulty: course.difficultyLevel as courseDifficultyType,
                    };
                  })
              : [];

          setCourseList(listData);
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          messageApi.error(`Unable to get the courses due to ${err}`);
        }
      );
    }
  }, []);

  return (
    <MarketingLayout
      user={user}
      siteConfig={siteConfig}
      heroSection={<Hero siteConfig={siteConfig} isMobile={isMobile} user={user} />}
    >
      {/* <SetupPlatform /> */}
      {contextHolder}
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
          loading={loading}
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
          blogList={[]}
          previewMode={previewMode}
        />
      )}
    </MarketingLayout>
  );
};

export default StandardTemplate;
