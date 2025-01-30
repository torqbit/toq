import { getCookieName } from "@/lib/utils";
import { PageSiteConfig } from "@/services/siteConstant";
import StandardTemplate from "@/templates/standard/StandardTemplate";
import { StateType, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC, useEffect, useState } from "react";
import { getSiteConfig } from "@/services/getSiteConfig";

import getBlogList from "@/actions/getBlogList";
import { IBlogCard } from "@/types/landing/blog";
import { ICourseListItem } from "@/types/courses/Course";
import { listCourseListItems } from "@/actions/courses";
import learningPath from "@/actions/learningPath";
import { ILearningPathDetail } from "@/types/learingPath";

const PreviewPage: FC<{
  user: User;
  siteConfig: PageSiteConfig;
  courseList: ICourseListItem[];
  blogList: IBlogCard[];
  learningList: ILearningPathDetail[];
}> = ({ user, siteConfig, courseList, blogList, learningList }) => {
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SITE_CONFIG") {
        setConfig(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const socialLinks =
    config.brand?.socialLinks &&
    Object.keys(config.brand?.socialLinks).reduce((acc: any, key) => {
      acc[key] = "#";
      return acc;
    }, {});

  return (
    <StandardTemplate
      user={user}
      learningList={learningList.length > 0 ? learningList.filter((l) => l.state == StateType.ACTIVE) : []}
      courseList={courseList.length > 0 ? courseList.filter((c) => c.state == StateType.ACTIVE) : []}
      siteConfig={{
        ...config,
        navBar: {
          links: config.navBar?.links?.map((navLinks) => {
            return { ...navLinks, link: "#" };
          }),
        },
        heroSection: {
          ...config.heroSection,
          actionButtons: {
            ...config.heroSection?.actionButtons,
            primary: {
              ...config.heroSection?.actionButtons?.primary,
              link: "#",
            },
            secondary: {
              ...config.heroSection?.actionButtons?.secondary,
              link: "#",
            },
          },
        },
        brand: {
          ...config.brand,
          socialLinks: socialLinks,
        },
      }}
      blogList={blogList}
      previewMode={true}
    />
  );
};
export default PreviewPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const { site } = getSiteConfig();
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const allCourses =
    site.sections?.courses?.enable &&
    (await listCourseListItems(user)).map((list, i) => {
      return {
        ...list,
        link: "#courses",
      };
    });
  const allBlogs =
    site.sections?.blog?.enable &&
    (await getBlogList()).map((blog) => {
      return {
        ...blog,
        link: "#blogs",
      };
    });

  const pathListResponse = await learningPath.listLearningPath(user?.role, user?.id);

  return {
    props: {
      user,
      siteConfig: site,
      courseList: allCourses || [],
      blogList: allBlogs || [],
      learningList: pathListResponse.body ? pathListResponse.body : [],
    },
  };
};
