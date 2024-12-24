import { getCookieName } from "@/lib/utils";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import StandardTemplate from "@/templates/standard/StandardTemplate";

import { StateType, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC, useEffect, useState } from "react";
import { getSiteConfig } from "@/services/getSiteConfig";
import ProgramService from "@/services/ProgramService";
import { ICourseCard } from "@/types/landing/courses";
import { message } from "antd";
import { convertSecToHourandMin } from "../content";

const PreviewPage: FC<{ user: User; siteConfig: PageSiteConfig }> = ({ user, siteConfig }) => {
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);

  const [courseList, setCourseList] = useState<ICourseCard[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const getCourseList = () => {
    ProgramService.getCoursesByAuthor(
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
  };

  useEffect(() => {
    if (siteConfig.sections?.courses?.enable) {
      getCourseList();
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SITE_CONFIG") {
        setConfig(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      {contextHolder}
      <StandardTemplate user={user} siteConfig={config} previewMode courseList={courseList} />
    </>
  );
};
export default PreviewPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const { site } = getSiteConfig();
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  return {
    props: {
      user,
      siteConfig: site,
    },
  };
};
