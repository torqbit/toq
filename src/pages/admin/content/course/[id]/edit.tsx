import AddCourseForm from "@/components/Admin/Content/AddCourseForm";
import { getCookieName } from "@/lib/utils";
import { Role } from "@prisma/client";

import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";

const SettingPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <>
      <AddCourseForm siteConfig={siteConfig} />
    </>
  );
};

export default SettingPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  const { site } = getSiteConfig();
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user && params) {
    if (user.role == Role.ADMIN) {
      return { props: {} };
    } else if (user.role === Role.AUTHOR) {
      const courseDetail = await prisma?.course.findUnique({
        where: {
          courseId: Number(params.id),
        },
        select: {
          authorId: true,
        },
      });
      if (courseDetail?.authorId === user.id) {
        return {
          props: {
            siteConfig: site,
          },
        };
      } else {
        return {
          redirect: {
            permanent: false,
            message: "you are not Author of this course",
            destination: "/admin/content",
          },
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          message: "you are not Author of this course",
          destination: "/admin/content",
        },
      };
    }
  }
  return {
    props: {
      siteConfig: site,
    },
  };
};
