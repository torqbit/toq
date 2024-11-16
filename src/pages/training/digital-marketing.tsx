import { useAppContext } from "@/components/ContextApi/AppContext";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import StaticCourseTemplate from "@/components/Marketing/Courses/StaticCourseTemplate";
import HeroCoursePreview from "@/components/Marketing/Courses/HeroCoursePreview";
import { getCookieName } from "@/lib/utils";
import { ResourceContentType, Theme, User } from "@prisma/client";

import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";

import { FC, useEffect } from "react";
import appConstant from "@/services/appConstant";

const DigitalMarketing: FC<{ user: User }> = ({ user }) => {
  const { dispatch } = useAppContext();
  const details = {
    authorImage: "https://lh3.googleusercontent.com/a/ACg8ocL5CcMo3dM-wmENI59uakOetimQSCa9WvM7I0xK0li7M9EbkAw=s96-c",
    authorName: "MD MEHRAB ALAM ",
    coursePrice: 999,
    description: "Description about the Digital Marketing ",
    difficultyLevel: "Intermediate",
    name: "History of Git",
    thumbnail: "https://cdn.torqbit.com/static//courses/banners/History-of-Git_banner-1722974067410.png",

    chapters: [
      {
        chapterName: "Digital Analysis",
        chapterSeq: 1,
        lessons: [
          {
            contentType: ResourceContentType.Video,
            isWatched: false,
            lessonId: 1,
            title: "Lesson 1",
            videoDuration: 27,
          },
          {
            contentType: ResourceContentType.Video,
            isWatched: false,
            lessonId: 1,
            title: "Lesson 2",
            videoDuration: 27,
          },
          {
            contentType: ResourceContentType.Assignment,
            isWatched: false,
            lessonId: 1,
            title: "Lesson 3",
            videoDuration: 0,
          },
        ],
      },
    ],
  };

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

  return (
    <>
      <MarketingLayout
        user={user}
        heroSection={
          <HeroCoursePreview
            courseName={"Digital Marketing"}
            authorImage={"https://cdn.torqbit.com/static//user/profile/MD-MEHRAB-ALAM_profile-1724237296553.jpg"}
            authorName={"MD MEHRAB ALAM"}
            courseTrailer={"https://iframe.mediadelivery.net/embed/227219/8ca1cded-c33c-4810-bb61-796778c147bf"}
          />
        }
      >
        <StaticCourseTemplate details={details} />
      </MarketingLayout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  return { props: { user } };
};

export default DigitalMarketing;
