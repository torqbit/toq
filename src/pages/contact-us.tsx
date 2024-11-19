import React, { FC } from "react";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import DefaulttHero from "@/components/Marketing/Blog/DefaultHero";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { Flex, Space } from "antd";
import styles from "@/styles/Marketing/Contact/ContactUs.module.scss";
import appConstant from "@/services/appConstant";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import { PageThemeConfig } from "@/services/themeConstant";

const ContactUsPage: FC<{ user: User; themeConfig: PageThemeConfig }> = ({ user, themeConfig }) => {
  return (
    <MarketingLayout
      themeConfig={themeConfig}
      user={user}
      heroSection={
        <DefaulttHero
          title="Contact Us"
          description="For any queries and concerns, you can contact us at this address"
        />
      }
    >
      <div className={styles.contact_wrapper}>
        <Flex vertical align="center" justify="center">
          <Space size={20} direction="vertical">
            {appConstant.contacts.map((detail, i) => {
              return (
                <Flex key={i} gap={10}>
                  <div className={styles.detail_title}>{detail.title}</div>
                  <span>:</span>
                  <div className={styles.detail_description}>{detail.description}</div>
                </Flex>
              );
            })}
          </Space>
        </Flex>
      </div>
    </MarketingLayout>
  );
};

export default ContactUsPage;
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const themeConfig = useThemeConfig();

  return {
    props: {
      user,
      themeConfig: {
        ...themeConfig,
        navBar: {
          ...themeConfig.navBar,
          component: themeConfig.navBar?.component?.name as any,
        },
      },
    },
  };
};
