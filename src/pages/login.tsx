import { Alert, Button, ConfigProvider, Flex, Form, Input, message, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Login.module.scss";
import { signIn, useSession } from "next-auth/react";
import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { getToken } from "next-auth/jwt";
import { authConstants, capitalizeFirstLetter, getCookieName } from "@/lib/utils";
import Image from "next/image";

import getLoginMethods from "@/lib/auth/loginMethods";
import SvgIcons from "@/components/SvgIcons";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import prisma from "@/lib/prisma";
import { useAppContext } from "@/components/ContextApi/AppContext";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import Link from "next/link";

const LoginPage: NextPage<{
  loginMethods: { available: string[]; configured: string[] };
  siteConfig: PageSiteConfig;
}> = ({ loginMethods, siteConfig }) => {
  const { globalState } = useAppContext();
  const router = useRouter();
  const [gitHubLoading, setGitHubLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const [loading, setLoginProgress] = useState<{ provider?: string }>();
  const [emailLogin, setLoginWithEmail] = useState(router.query.provider == "email");
  const [loginError, setLoginError] = React.useState("");
  const [loginForm] = Form.useForm();
  const { data: session, status: sessionStatus } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const { brand } = siteConfig;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${brand?.brandColor}`);
  }, []);

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

  const handleLogin = async () => {
    setLoginLoading(true);
    signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      password: loginForm.getFieldValue("password"),
      email: loginForm.getFieldValue("email"),
    }).then(async (response) => {
      if (response && !response.ok) {
        setLoginLoading(false);
        if (response.status === 401 && response.error?.includes("Illegal arguments")) {
          messageApi.error("Try a different login method ");
        } else {
          messageApi.error(response.error);
        }
      } else if (response && response.ok && response.url) {
        setLoginLoading(false);

        messageApi.loading(`You will be redirected to the platform`);
        router.push(`/login/redirect?redirect=${router.query.redirect}`);
      }
    });
    loginForm.resetFields();
  };

  const validateMessages = {
    required: "Field is required!",
    types: {
      email: "This is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  return (
    <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
      <div
        className={`${styles.login_page_wrapper} ${styles[`bg__${globalState.theme === "dark" ? "dark" : "light"}`]}`}
      >
        {contextHolder}
        <div className={styles.social_login_container}>
          {siteConfig.brand?.icon && typeof siteConfig.brand.icon === "string" ? (
            <object type="image/png" data={siteConfig.brand.icon} height={60} width={60} aria-label={`Brand icon`}>
              <Image src={"/img/brand/torqbit-icon.png"} height={60} width={60} alt={"logo"} />
            </object>
          ) : (
            <Image src={"/img/brand/torqbit-icon.png"} height={60} width={60} alt={"logo"} />
          )}

          <h3>Welcome back to {brand?.name}</h3>

          {emailLogin && (
            <Form
              form={loginForm}
              onFinish={handleLogin}
              layout="vertical"
              requiredMark="optional"
              autoComplete="off"
              validateMessages={validateMessages}
              validateTrigger="onSubmit"
            >
              <Form.Item
                name="email"
                label=""
                rules={[{ required: true, message: "Email is required" }, { type: "email" }]}
              >
                <Input type="email" placeholder="Enter your email address.." style={{ height: 40 }} />
              </Form.Item>
              <Form.Item name="password" label="" rules={[{ required: true, message: "Password is required" }]}>
                <Input.Password placeholder="Enter your password" style={{ height: 40 }} />
              </Form.Item>
              <Button
                loading={loginLoading}
                style={{ width: 250, height: 40, display: "block" }}
                onClick={() => {
                  loginForm.submit();
                }}
                type="primary"
                className={styles.google_btn}
              >
                Login with Email
              </Button>

              <Button
                type="link"
                icon={SvgIcons.arrowLeft}
                iconPosition="start"
                style={{ width: 250, marginTop: 10 }}
                onClick={(_) => setLoginWithEmail(false)}
              >
                Back to Login
              </Button>
            </Form>
          )}

          {!emailLogin && (
            <>
              {loginMethods.configured.map((provider, i) => {
                if (provider === authConstants.CREDENTIALS_AUTH_PROVIDER) {
                  return (
                    <div key={i}>
                      <Button
                        style={{ width: 250, height: 40 }}
                        onClick={() => {
                          setLoginWithEmail(true);
                        }}
                        type="primary"
                        className={styles.google_btn}
                      >
                        Login with Email
                      </Button>
                    </div>
                  );
                } else {
                  return (
                    <div key={i}>
                      <Tooltip
                        title={
                          loginMethods.available.includes(provider)
                            ? ``
                            : `Login method disabled for ${capitalizeFirstLetter(
                                provider
                              )} due to missing environment variables`
                        }
                      >
                        <Button
                          style={{ width: 250, height: 40 }}
                          onClick={async () => {
                            signIn(provider, {
                              callbackUrl: `/login/redirect?redirect=${router.query.redirect}`,
                            });
                          }}
                          type="default"
                          loading={loading && loading?.provider == provider}
                          disabled={!loginMethods.available.includes(provider)}
                        >
                          Login with {capitalizeFirstLetter(provider)}
                        </Button>
                      </Tooltip>
                    </div>
                  );
                }
              })}
              <Flex gap={5}>
                <p>Don&apos;t have an account?</p>
                <Link href={"/signup"}>Sign up</Link>
              </Flex>
            </>
          )}

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
    </ConfigProvider>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  const { site } = getSiteConfig();
  const siteConfig = site;

  const loginMethods = getLoginMethods();

  const totalUser = await prisma.account.count();

  if (totalUser === 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/signup",
      },
    };
  }

  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }

  return { props: { loginMethods, siteConfig } };
};

export default LoginPage;
