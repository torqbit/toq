import type { GetServerSidePropsContext, NextPage } from "next";
import React from "react";
import { Role } from "@prisma/client";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import learningPath from "@/actions/learningPath";
import { ILearningPathDetail } from "@/types/learingPath";
import { ICourseListItem } from "@/types/courses/Course";
import { getCouseListItems } from "@/actions/getCourseListItems";
import Academy from "@/components/Academy/Academy";
const AcademyPage: NextPage<{
  siteConfig: PageSiteConfig;
  userRole: Role;
  pathList: ILearningPathDetail[];
  coursesList: ICourseListItem[];
}> = ({ siteConfig, userRole, pathList, coursesList }) => {
  return (
    <Academy
      siteConfig={siteConfig}
      userRole={userRole}
      pathList={pathList}
      coursesList={coursesList}
      getProgress={() => {}}
      studentItems={undefined}
    />
  );
};

export default AcademyPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const pathListResponse = await learningPath.listLearningPath(user?.role, user?.id);
  const courseResponse = await getCouseListItems({ role: user?.role, id: user?.id });

  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  if (user) {
    if (user.role === Role.STUDENT) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
    return {
      props: {
        siteConfig: site,
        userRole: user?.role,
        pathList: pathListResponse && pathListResponse.success ? pathListResponse.body : [],
        coursesList: courseResponse && courseResponse.success ? courseResponse.body : [],
      },
    };
  } else {
    return {
      props: {
        siteConfig: site,
        pathList: pathListResponse.success ? pathListResponse.body : [],
        coursesList: courseResponse && courseResponse.success ? courseResponse.body : [],
      },
    };
  }
};
