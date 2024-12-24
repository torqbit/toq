import { getCookieName } from "@/lib/utils";
import { PageSiteConfig } from "@/services/siteConstant";
import StandardTemplate from "@/templates/standard/StandardTemplate";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC, useEffect, useState } from "react";
import { getSiteConfig } from "@/services/getSiteConfig";
import { ICourseCard } from "@/types/landing/courses";
import getCourseList from "@/actions/getCourseList";
import { useRouter } from "next/router";
import { LandingPageTemplates } from "@/types/template";

const PreviewPage: FC<{ user: User; siteConfig: PageSiteConfig; allCourses: ICourseCard[] }> = ({
  user,
  siteConfig,
  allCourses,
}) => {
  const [config, setConfig] = useState<PageSiteConfig>(siteConfig);
  const router = useRouter();
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

  switch (String(router.query.templateId)) {
    case LandingPageTemplates.STANDARD:
      return <StandardTemplate user={user} siteConfig={config} previewMode courseList={allCourses} />;

    default:
      return <StandardTemplate user={user} siteConfig={config} previewMode courseList={allCourses} />;
  }
};
export default PreviewPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const { site } = getSiteConfig();
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  const allCourses = site.sections?.courses?.enable && (await getCourseList());

  return {
    props: {
      user,
      siteConfig: site,
      allCourses: allCourses || [],
    },
  };
};
