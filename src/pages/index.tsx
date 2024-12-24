import React, { FC } from "react";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { PageSiteConfig } from "@/services/siteConstant";
import StandardTemplate from "@/templates/standard/StandardTemplate";
import { getSiteConfig } from "@/services/getSiteConfig";
import { ICourseCard } from "@/types/landing/courses";
import getCourseList from "@/actions/getCourseList";
interface IProps {
  user: User;
  siteConfig: PageSiteConfig;
  courseList: ICourseCard[];
}

const LandingPage: FC<IProps> = ({ user, siteConfig, courseList }) => {
  return <StandardTemplate user={user} siteConfig={siteConfig} courseList={courseList} />;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const { site } = getSiteConfig();
  const siteConfig = site;
  const courselist = siteConfig.sections?.courses?.enable && (await getCourseList());
  return {
    props: {
      user,
      siteConfig,
      courseList: courselist || [],
    },
  };
};
export default LandingPage;
