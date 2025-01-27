import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import { getUserEnrolledCoursesId } from "@/actions/getEnrollCourses";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

import { Role, User } from "@prisma/client";
import prisma from "@/lib/prisma";

import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import LessonView from "@/components/Courses/LessonView/LessonView";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";

const LessonPage: NextPage<{ siteConfig: PageSiteConfig; courseId: number; userRole?: Role }> = ({
  siteConfig,
  courseId,
  userRole,
}) => {
  const { data: user } = useSession();
  return (
    <>
      {typeof userRole === "undefined" || userRole === Role.STUDENT ? (
        <>
          <MarketingLayout
            mobileHeroMinHeight={60}
            siteConfig={siteConfig}
            showFooter={false}
            navBarWidth={"100%"}
            user={
              userRole
                ? ({
                    id: user?.id,
                    name: user?.user?.name || "",
                    email: user?.user?.email || "",
                    phone: user?.phone || "",
                    role: userRole,
                  } as User)
                : undefined
            }
          >
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
    const hasAccess = await getCourseAccessRole(user?.role, user?.id, Number(courseInfo.courseId));
    const isEnrolled = await getUserEnrolledCoursesId(courseInfo?.courseId, user?.id);
    if (!isEnrolled && user.id !== courseAuthor?.authorId && hasAccess.role === Role.NOT_ENROLLED) {
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
