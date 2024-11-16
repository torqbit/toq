import { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma";
import { CourseState, Theme, User } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import CoursePreview from "@/components/Marketing/Courses/CoursePreview";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { useAppContext } from "@/components/ContextApi/AppContext";
import HeroCoursePreview from "@/components/Marketing/Courses/HeroCoursePreview";
import { ICoursePageDetail } from "@/types/courses/Course";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import appConstant from "@/services/appConstant";
import getCourseDetail, { extractLessonAndChapterDetail } from "@/actions/getCourseDetail";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import { PageThemeConfig } from "@/services/themeConstant";

interface IProps {
  user: User;
  courseId: number;
  courseDetails: ICoursePageDetail;
  themeConfig: PageThemeConfig;
}

const CourseDetailPage: FC<IProps> = ({ user, courseId, courseDetails, themeConfig }) => {
  const { dispatch } = useAppContext();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [nextLessonId, setNextLessonId] = useState<number>();

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme || currentTheme === "dark") {
      localStorage.setItem("theme", "dark");
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "light");
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);

    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  useEffect(() => {
    onCheckTheme();
  }, []);

  const getNextLessonId = async (courseId: number) => {
    ProgramService.getNextLessonId(
      courseId,
      (result) => {
        setNextLessonId(result.nextLessonId);
      },
      (error) => {}
    );
  };

  useEffect(() => {
    getNextLessonId(courseDetails?.courseId);
  }, [router.query.slug, session]);

  return (
    <>
      <MarketingLayout
        themeConfig={themeConfig}
        user={user}
        heroSection={
          courseDetails ? (
            <HeroCoursePreview
              courseName={courseDetails?.name}
              authorImage={String(courseDetails?.authorImage)}
              authorName={String(courseDetails?.authorName)}
              courseTrailer={courseDetails?.tvUrl}
            />
          ) : (
            <SpinLoader />
          )
        }
      >
        {courseDetails && (
          <CoursePreview courseId={courseId} user={user} nextLessonId={nextLessonId} courseDetails={courseDetails} />
        )}
      </MarketingLayout>
    </>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  const courseDetail = await prisma.course.findUnique({
    where: {
      slug: String(params?.slug),
    },
    select: {
      courseId: true,
    },
  });
  const themeConfig = useThemeConfig();

  if (courseDetail && courseDetail?.courseId) {
    const detail = await getCourseDetail(Number(courseDetail.courseId), user?.role, user?.id);

    if (detail?.courseDetail && detail?.courseDetail.length > 0) {
      const result = extractLessonAndChapterDetail(
        detail.courseDetail,
        detail?.userStatus as CourseState,
        detail.userRole
      );

      const courseLessonDetail = {
        courseId: courseDetail?.courseId,
        state: result.courseInfo.courseState,
        name: result.courseInfo.name,
        description: result.courseInfo.description,
        thumbnail: result.courseInfo.thumbnail,
        difficultyLevel: result.courseInfo.difficultyLevel,
        tvUrl: result.courseInfo.courseTrailer,
        chapters: result.chapterLessons,
        userRole: result.courseInfo.userRole,
        progress: result.progress,
        courseType: result.courseInfo.courseType,
        coursePrice: result.courseInfo.coursePrice,
        authorName: result.courseInfo.authorName,
        authorImage: result.courseInfo.authorImage,
        previewMode: result.courseInfo.previewMode,
        userStatus: result.courseInfo.userStatus ? result.courseInfo.userStatus : null,
        videoThumbnail: result.courseInfo.videoThumbnail,
      };
      return {
        props: {
          courseId: courseDetail?.courseId,
          user,
          courseDetails: courseLessonDetail,
          themeConfig: {
            ...themeConfig,
            navBar: {
              ...themeConfig.navBar,
              component: themeConfig.navBar?.component?.name as any,
            },
          },
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,

          destination: "/",
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/",
      },
    };
  }
};
export default CourseDetailPage;
