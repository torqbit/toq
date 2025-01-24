import React, { useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { Flex, Switch } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { Role } from "@prisma/client";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import StudentDashboard from "@/components/Dashboard/StudentDashboard";
import AdminDashboard from "@/components/Dashboard/Admin/AdminDashboard";

const Dashboard: NextPage<{ siteConfig: PageSiteConfig; userRole: Role }> = ({ siteConfig, userRole }) => {
  const [viewMode, setViewMode] = useState<Role>(userRole);

  return (
    <AppLayout siteConfig={siteConfig}>
      <section className={styles.dashboard_content}>
        <Flex justify="space-between">
          <h3>{viewMode === Role.ADMIN ? "Admin Dashboard" : "Dashboard"}</h3>
          <>
            {userRole === Role.ADMIN && (
              <Flex gap={50} align="center">
                <div>
                  <h5>Student Mode</h5>
                  <p style={{ margin: 0 }}>View the dashboard as student</p>
                </div>
                <Switch
                  size="small"
                  checked={viewMode !== Role.ADMIN}
                  onChange={(value) => {
                    setViewMode(value ? Role.STUDENT : Role.ADMIN);
                  }}
                />
              </Flex>
            )}
          </>
        </Flex>
        {viewMode === Role.ADMIN ? (
          <AdminDashboard siteConfig={siteConfig} />
        ) : (
          <StudentDashboard siteConfig={siteConfig} userRole={viewMode} />
        )}
      </section>
    </AppLayout>
  );
};

export default Dashboard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const siteConfig = getSiteConfig();

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const { site } = siteConfig;

  if (user) {
    if (user.role === Role.STUDENT) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    } else {
      return {
        props: {
          siteConfig: site,
          userRole: user.role,
        },
      };
    }
  } else {
    return {
      props: {
        siteConfig: site,
      },
    };
  }
};
