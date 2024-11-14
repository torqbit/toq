import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Theme, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { useMediaQuery } from "react-responsive";
import DefaulttHero from "@/components/Marketing/Blog/DefaultHero";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { Flex, Space } from "antd";
import styles from "@/styles/Marketing/Contact/ContactUs.module.scss";
import appConstant from "@/services/appConstant";

const ContactUsPage: FC<{ user: User }> = ({ user }) => {
  const { dispatch, globalState } = useAppContext();
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
    onCheckTheme();
  }, []);

  return (
    <MarketingLayout
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

  return { props: { user } };
};
