import React, { FC } from "react";
import { Role, StateType, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { PageSiteConfig } from "@/services/siteConstant";
import StandardTemplate from "@/templates/standard/StandardTemplate";
import { getSiteConfig } from "@/services/getSiteConfig";
import getBlogList from "@/actions/getBlogList";
import { IBlogCard } from "@/types/landing/blog";
import { ICourseListItem } from "@/types/courses/Course";
import { listCourseListItems } from "@/actions/courses";
import StudentDashboard from "@/components/Dashboard/StudentDashboard";
import { useMediaQuery } from "react-responsive";
import learningPath from "@/actions/learningPath";
import { ILearningPathDetail } from "@/types/learingPath";

interface IProps {
  user: User;
  siteConfig: PageSiteConfig;
  courseList: ICourseListItem[];
  blogList: IBlogCard[];
  learningList: ILearningPathDetail[];
}

const LandingPage: FC<IProps> = ({ user, siteConfig, courseList, blogList, learningList }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <>
      {user && user.role == Role.STUDENT ? (
        <StudentDashboard
          coursesList={courseList.length > 0 ? courseList.filter((c) => c.state == StateType.ACTIVE) : []}
          pathList={learningList.length > 0 ? learningList.filter((l) => l.state == StateType.ACTIVE) : []}
          siteConfig={siteConfig}
          userRole={user.role}
        />
      ) : (
        <StandardTemplate
          user={user}
          learningList={learningList.length > 0 ? learningList.filter((l) => l.state == StateType.ACTIVE) : []}
          courseList={courseList.length > 0 ? courseList.filter((c) => c.state == StateType.ACTIVE) : []}
          siteConfig={siteConfig}
          blogList={blogList}
        />
      )}
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const { site } = getSiteConfig();
  const siteConfig = site;
  const courselist: ICourseListItem[] | undefined =
    siteConfig.sections?.courses?.enable && (await listCourseListItems(user));
  const blogList = siteConfig.sections?.blog?.enable && (await getBlogList());
  const pathListResponse = await learningPath.listLearningPath(user?.role, user?.id);
  return {
    props: {
      user,
      siteConfig,
      courseList: courselist || [],
      blogList: blogList || [],
      learningList: pathListResponse.body ? pathListResponse.body : [],
    },
  };
};
export default LandingPage;
