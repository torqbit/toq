import type { GetServerSidePropsContext, NextPage } from "next";
import styles from "@/styles/Dashboard.module.scss";
import React, { FC, useEffect, useState } from "react";
import { Course, Role, StateType, User } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { Spin, message, Flex, Button } from "antd";

import ProgramService from "@/services/ProgramService";

import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import DefaulttHero from "@/components/Marketing/DefaultHero/DefaultHero";
import { EmptyCourses } from "@/components/SvgIcons";
import { useRouter } from "next/router";
import { getIconTheme } from "@/services/darkThemeConfig";
import { useAppContext } from "@/components/ContextApi/AppContext";

import { useSession } from "next-auth/react";
import { LoadingOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import learningPath from "@/actions/learningPath";
import { ILearningPathDetail } from "@/types/learingPath";
import LearningPathSerivices from "@/services/learningPath/LearningPathSerivices";
import { LearnListView } from "@/components/Admin/LearningPath/LearnListView";

const AcademyPage: NextPage<{ siteConfig: PageSiteConfig; userRole: Role; pathList: ILearningPathDetail[] }> = ({
  siteConfig,
  userRole,
  pathList,
}) => {
  const [pathListData, setPathListData] = useState<ILearningPathDetail[]>(pathList);
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const router = useRouter();
  const { data: user } = useSession();
  const { globalState } = useAppContext();

  const getPathList = (state: StateType) => {
    setLoading(true);
    LearningPathSerivices.listPath(
      "ACTIVE",
      (response) => {
        if (response.success && response.body) {
          setPathListData(response.body);
          setLoading(false);
        } else {
          message.error(response.message);
          setLoading(false);
        }
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  return (
    <>
      {userRole ? (
        <>
          {userRole === Role.STUDENT ? (
            <MarketingLayout
              mobileHeroMinHeight={60}
              showFooter={!isMobile}
              siteConfig={siteConfig}
              heroSection={
                <>
                  {!isMobile && !loading && pathListData && (
                    <DefaulttHero
                      title="Learning Paths"
                      description="Expand Your Knowledge with Comprehensive Learning path"
                    />
                  )}
                </>
              }
              user={{ ...user?.user, role: Role.STUDENT } as User}
            >
              {contextMessageHolder}
              <Spin spinning={loading || !pathListData} indicator={<LoadingOutlined spin />} size="large">
                <section>
                  <div className="page__wrapper">
                    <LearnListView
                      pathList={pathListData || []}
                      loading={loading || !pathListData}
                      siteConfig={siteConfig}
                      currentTheme={globalState.theme || "light"}
                      role={userRole}
                      emptyView={
                        <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />
                      }
                    />
                  </div>
                </section>
              </Spin>
            </MarketingLayout>
          ) : (
            <AppLayout siteConfig={siteConfig}>
              {contextMessageHolder}
              <section>
                <LearnListView
                  pathList={pathListData || []}
                  loading={loading || !pathListData}
                  siteConfig={siteConfig}
                  currentTheme={globalState.theme || "light"}
                  role={userRole}
                  emptyView={
                    <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />
                  }
                />
              </section>
            </AppLayout>
          )}
        </>
      ) : (
        <>
          <MarketingLayout
            siteConfig={siteConfig}
            heroSection={
              <DefaulttHero
                title="Learning Paths"
                description="Expand Your Knowledge with Comprehensive Learning path"
              />
            }
          >
            {contextMessageHolder}
            <Spin spinning={loading || !pathListData} indicator={<LoadingOutlined spin />} size="large">
              <section>
                <div className="page__wrapper">
                  <LearnListView
                    pathList={pathListData || []}
                    loading={loading || !pathListData}
                    siteConfig={siteConfig}
                    currentTheme={globalState.theme || "light"}
                    role={userRole}
                    emptyView={
                      <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", siteConfig.brand)} />
                    }
                  />
                </div>
              </section>
            </Spin>
          </MarketingLayout>
        </>
      )}
    </>
  );
};

export default AcademyPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const pathListResponse = await learningPath.listLearningPath(user?.role, user?.id);
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  if (user) {
    return {
      props: {
        siteConfig: site,
        userRole: user?.role,
        pathList: pathListResponse && pathListResponse.success ? pathListResponse.body : [],
      },
    };
  } else {
    return {
      props: {
        siteConfig: site,
        pathList: pathListResponse.success ? pathListResponse.body : [],
      },
    };
  }
};
