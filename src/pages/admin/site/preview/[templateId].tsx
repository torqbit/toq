import { getCookieName } from "@/lib/utils";
import { PageSiteConfig } from "@/services/siteConstant";
import StandardTemplate from "@/templates/standard/StandardTemplate";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC, useEffect, useState } from "react";
import { getSiteConfig } from "@/services/getSiteConfig";
import { ICourseCard } from "@/types/landing/courses";
import getCourseList from "@/actions/getCourseList";
import getBlogList from "@/actions/getBlogList";
import { IBlogCard } from "@/types/landing/blog";

const PreviewPage: FC<{ user: User; siteConfig: PageSiteConfig; courseList: ICourseCard[]; blogList: IBlogCard[] }> = ({
  user,
  siteConfig,
  courseList,
  blogList,
}) => {
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

  return <StandardTemplate user={user} siteConfig={config} courseList={courseList} blogList={blogList} previewMode />;
};
export default PreviewPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const { site } = getSiteConfig();
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const allCourses = site.sections?.courses?.enable && (await getCourseList());
  const allBlogs = site.sections?.blog?.enable && (await getBlogList());

  return {
    props: {
      user,
      siteConfig: site,
      courseList: allCourses || [],
      blogList: allBlogs || [],
    },
  };
};
