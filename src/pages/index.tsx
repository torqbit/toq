import React, { FC, useEffect, useState } from "react";
import { StateType, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { PageSiteConfig } from "@/services/siteConstant";
import StandardTemplate from "@/templates/standard/StandardTemplate";
import { getSiteConfig } from "@/services/getSiteConfig";
import { ICourseCard } from "@/types/landing/courses";
import ProgramService from "@/services/ProgramService";
import { convertSecToHourandMin } from "./admin/content";
import { message } from "antd";

interface IProps {
  user: User;
  siteConfig: PageSiteConfig;
}

const LandingPage: FC<IProps> = ({ user, siteConfig }) => {
  const [courseList, setCourseList] = useState<ICourseCard[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (siteConfig.sections?.courses?.enable) {
      ProgramService.getCourseList(
        true,
        (res) => {
          let listData =
            res.courses.length > 0
              ? res.courses
                  .filter((c) => c.state === StateType.ACTIVE)
                  .map((course: any) => {
                    let totalDuration = 0;
                    course.chapters.forEach((chap: any) => {
                      chap.resource.forEach((r: any) => {
                        if (r.video) {
                          totalDuration = totalDuration + r.video?.videoDuration;
                        } else if (r.assignment) {
                          totalDuration = totalDuration + Number(r.assignment.estimatedDuration) * 60;
                        }
                      });
                    });
                    let duration = convertSecToHourandMin(totalDuration);
                    return {
                      title: course.name,
                      thumbnail: course.thumbnail || "",
                      duration: `${duration}`,
                      description: course.description,
                      link: `/courses/${course.slug}`,
                      courseType: course.courseType,
                      price: Number(course.coursePrice),
                      difficulty: course.difficultyLevel,
                    };
                  })
              : [];

          setCourseList(listData);
        },
        (err) => {
          messageApi.error(`Unable to get the courses due to ${err}`);
        }
      );
    }
  }, []);
  return (
    <>
      {contextHolder}
      <StandardTemplate user={user} siteConfig={siteConfig} courseList={courseList} />
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const { site } = getSiteConfig();
  const siteConfig = site;

  return {
    props: {
      user,
      siteConfig,
    },
  };
};
export default LandingPage;
