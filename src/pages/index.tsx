import React, { FC } from "react";
import { Role, User } from "@prisma/client";
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
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import dashboardStyles from "@/styles/Dashboard.module.scss";
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
        <MarketingLayout
          mobileHeroMinHeight={60}
          user={user}
          siteConfig={siteConfig}
          homeLink={"/"}
          showFooter={!isMobile}
        >
          <section
            className={dashboardStyles.dashboard_content}
            style={{ maxWidth: "var(--marketing-container-width)", margin: "0 auto", padding: "10px  0" }}
          >
            <StudentDashboard siteConfig={siteConfig} userRole={user.role} />
          </section>
        </MarketingLayout>
      ) : (
        <StandardTemplate
          user={user}
          learningList={learningList}
          siteConfig={siteConfig}
          courseList={courseList}
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
