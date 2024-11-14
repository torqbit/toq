import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { CourseCategory, ICourseCategory } from "@/components/CourseCategory/CourseCategory";
import About from "@/components/Marketing/LandingPage/About";
import Hero from "@/components/Marketing/LandingPage/Hero/Hero";
import { Theme, User } from "@prisma/client";

import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import AOS from "aos";
import GetStarted from "@/components/Marketing/LandingPage/GetStarted";
import Image from "next/image";
import HeroImage from "@/components/Marketing/LandingPage/HeroImage";
import appConstant from "@/services/appConstant";
interface IProps {
  user: User;
}

const LandingPage: FC<IProps> = ({ user }) => {
  const { dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

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
    AOS.init();
    onCheckTheme();
  }, []);

  return <MarketingLayout user={user} heroSection={<Hero isMobile={isMobile} user={user} />}></MarketingLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  return { props: { user } };
};
export default LandingPage;
