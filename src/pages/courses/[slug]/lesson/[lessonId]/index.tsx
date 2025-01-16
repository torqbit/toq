import SvgIcons from "@/components/SvgIcons";
import ProgramService from "@/services/ProgramService";
import { CourseLessons, IAssignmentDetail, VideoLesson } from "@/types/courses/Course";
import styles from "@/styles/LearnCourses.module.scss";
import sidebar from "@/styles/Sidebar.module.scss";
import {
  Avatar,
  Breadcrumb,
  Button,
  Collapse,
  Flex,
  List,
  MenuProps,
  Segmented,
  Skeleton,
  Space,
  Spin,
  Tabs,
  TabsProps,
  Tag,
  message,
} from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import { IResourceDetail } from "@/lib/types/learn";
import { convertSecToHourandMin } from "@/pages/admin/content";
import QADiscssionTab from "@/components/LearnCourse/AboutCourse/CourseDiscussion/CourseDiscussion";
import { postFetch } from "@/services/request";
import appConstant from "@/services/appConstant";

import { ICourseProgressUpdateResponse } from "@/lib/types/program";
import { getUserEnrolledCoursesId } from "@/actions/getEnrollCourses";
import { generateDayAndYear, getCookieName, getExtension } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

import { $Enums, ResourceContentType, Role } from "@prisma/client";
import prisma from "@/lib/prisma";

import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import LessonView from "@/components/Courses/LessonView/LessonView";
import MarketingLayout from "@/components/Layouts/MarketingLayout";

const LessonPage: NextPage<{ siteConfig: PageSiteConfig; courseId: number; userRole?: Role }> = ({
  siteConfig,
  courseId,
  userRole,
}) => {
  return (
    <>
      {typeof userRole === "undefined" || userRole === Role.STUDENT ? (
        <>
          <MarketingLayout siteConfig={siteConfig}>
            <LessonView siteConfig={siteConfig} courseId={courseId} marketingLayout={true} />
          </MarketingLayout>
        </>
      ) : (
        <AppLayout siteConfig={siteConfig}>
          <LessonView siteConfig={siteConfig} courseId={courseId} />
        </AppLayout>
      )}
    </>
  );
};

export default LessonPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, query } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();
  const { site } = getSiteConfig();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  const courseInfo = await prisma.course.findUnique({
    where: {
      slug: String(query.slug),
    },
    select: {
      courseId: true,
    },
  });

  if (user && courseInfo) {
    const courseAuthor = await prisma?.course.findUnique({
      where: {
        courseId: courseInfo.courseId,
      },
      select: {
        authorId: true,
      },
    });
    const isEnrolled = await getUserEnrolledCoursesId(courseInfo?.courseId, user?.id);
    if (!isEnrolled && user.id !== courseAuthor?.authorId && user.role === Role.STUDENT) {
      return {
        redirect: {
          permanent: false,
          message: "you are not enrolled in this course",
          destination: "/unauthorized?from=lesson",
        },
      };
    }
  } else if (user == null) {
    return {
      redirect: {
        permanent: false,
        message: "You don't have access to the course lesson",
        destination: `/courses/${String(query.slug)}`,
      },
    };
  }
  return {
    props: {
      siteConfig: site,
      courseId: Number(courseInfo?.courseId),
      userRole: user?.role,
    },
  };
};
