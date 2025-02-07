import React, { FC } from "react";
import styles from "@/styles/Dashboard.module.scss";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { GetServerSidePropsContext } from "next";
import { PageSiteConfig } from "@/services/siteConstant";
import NotificationList from "@/components/Notification/NotificationList";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

const Dashboard: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <AppLayout siteConfig={siteConfig}>
      <section className={styles.notification__page__wrapper}>
        <h3>Notifications</h3>

        <NotificationList popOver={false} limit={10} siteConfig={siteConfig} />
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
  if (user?.role == Role.STUDENT) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {
      siteConfig: site,
    },
  };
};
