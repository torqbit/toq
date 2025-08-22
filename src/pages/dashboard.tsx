import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { Flex } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { ActivityType, Role, TenantRole } from "@prisma/client";

import { getCookieName } from "@/lib/utils";

import AdminDashboard from "@/components/Dashboard/Admin/AdminDashboard";
import TenantOnboard from "@/components/OnBoarding/TenantOnboard/TenantOnboarding";

import PlatformAdminDashboard from "@/components/Dashboard/PlatformAdminDashboard";
import { UpdateActivitiesStats } from "@/actions/updateActivitiesStats";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { ITenantOnboardStatus } from "@/types/setup/siteSetup";
import { getTenantOnboardStatus } from "@/actions/getTenantOnboardStatus";

const Dashboard: NextPage<{
  siteConfig: PageSiteConfig;
  userRole: Role;
  tenantRole?: TenantRole;
  tenantOnboardStatus: ITenantOnboardStatus;
}> = ({ siteConfig, userRole, tenantOnboardStatus, tenantRole }) => {

  return (
    <AppLayout siteConfig={siteConfig}>
      <section className={styles.dashboard_content}>
        {userRole == Role.CUSTOMER &&
        tenantOnboardStatus &&
        !tenantOnboardStatus.onBoarded &&
        !tenantOnboardStatus.aiAssistant ? (
          <TenantOnboard siteConfig={siteConfig} status={tenantOnboardStatus} />
        ) : (
          <>
            <Flex justify="space-between">
              <h3>Admin Dashboard</h3>
            </Flex>

            <AdminDashboard siteConfig={siteConfig} />
          </>
        )}
      </section>
    </AppLayout>
  );
};

export default Dashboard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res, resolvedUrl } = ctx;
  const domain = req.headers.host || "";

  const siteConfig = await getSiteConfig(res, domain);
  const user = await getServerSession(req, res, await authOptions(req));
  const { site } = siteConfig;

  //TODO:- Need to implement this for page view stats

  if (user) {
    if (user.role === Role.ADMIN || user.role === Role.CUSTOMER) {
      const tenantOnboardStatus = await getTenantOnboardStatus(user.tenant?.tenantId || "");

      return {
        props: {
          userRole: user.role,
          siteConfig: site,
          tenantOnboardStatus,
        },
      };
    } else if (user.tenant?.role === TenantRole.MEMBER) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
  } else {
    return { notFound: true };
  }
};
