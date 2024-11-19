import { Alert, Button, Spin } from "antd";
import React, { useState } from "react";
import styles from "@/styles/Login.module.scss";
import { signIn, useSession } from "next-auth/react";
import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
import { getCookieName } from "@/lib/utils";

import Image from "next/image";
import { useSiteConfig } from "@/components/ContextApi/SiteConfigContext";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [gitHubLoading, setGitHubLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = React.useState("");
  const { data: session, status: sessionStatus } = useSession();
  const { brand } = useSiteConfig();

  React.useEffect(() => {
    if (router.query.error) {
      if (router.query.error === "OAuthAccountNotLinked") {
        closeLoading();
        setLoginError("You have already signed in with a different provider.");
      }
      if (router.query.error === "AccessDenied") {
        setLoginError("Sorry, You don't have an early access. Please contact us at train@torqbit.com");
        closeLoading();
      }
    }
    closeLoading();
  }, [router.query]);

  const closeLoading = () => {
    setGitHubLoading(false);
    setGoogleLoading(false);
  };

  if (sessionStatus === "loading") {
    return <SpinLoader />;
  }

  return (
    <div className={styles.login_page_wrapper}>
      <div className={styles.social_login_container}>
        <Image src={"/icon/torqbit.png"} height={60} width={60} alt={"logo"} />
        <h3>Login to {brand.name}</h3>

        <Button
          onClick={() => {
            setGoogleLoading(true);
            signIn("google", {
              callbackUrl: router.query.redirect ? `/${router.query.redirect}` : "/dashboard",
            });
          }}
          icon={<img src="./img/google.svg" width={25} />}
          type="default"
          loading={googleLoading}
          className={styles.google_btn}
        >
          Login with Google
        </Button>
        <Button
          style={{ backgroundColor: "#000" }}
          onClick={() => {
            setGitHubLoading(true);
            signIn("github", {
              callbackUrl: router.query.redirect ? `/${router.query.redirect}` : "/dashboard",
            });
          }}
          loading={gitHubLoading}
          icon={<img src="./icon/github.png" width={35} />}
          type="primary"
          className={styles.github_btn}
        >
          Login with GitHub
        </Button>
        {loginError && (
          <Alert
            message="Login Failed!"
            description={loginError}
            type="error"
            showIcon
            closable
            className={styles.alertMessage}
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
  return { props: {} };
};

export default LoginPage;
