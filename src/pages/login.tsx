import { Alert, Button, Checkbox, ConfigProvider, Flex, Form, Input, message, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Login.module.scss";
import { signIn, useSession } from "next-auth/react";
import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { authConstants, capitalizeFirstLetter, getCookieName, isValidImagePath } from "@/lib/utils";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

import getLoginMethods from "@/lib/auth/loginMethods";
import SvgIcons from "@/components/SvgIcons";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import prisma from "@/lib/prisma";
import { useAppContext } from "@/components/ContextApi/AppContext";
import darkThemeConfig from "@/services/darkThemeConfig";
import antThemeConfig from "@/services/antThemeConfig";
import Link from "next/link";
import { Theme } from "@/types/theme";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { AuthProvider } from "@prisma/client";
import Head from "next/head";
import SupportClientService from "@/services/client/tenant/SupportClientService";

const LoginPage: NextPage<{
  loginMethods: { available: string[]; configured: string[] };
  siteConfig: PageSiteConfig;
}> = ({ loginMethods, siteConfig }) => {
  const { globalState, dispatch } = useAppContext();
  const router = useRouter();
  const [gitHubLoading, setGitHubLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const [loading, setLoginProgress] = useState<{ provider?: string }>();
  const [emailLogin, setLoginWithEmail] = useState(
    router.query.provider == "email" ||
      (loginMethods.configured.length == 1 && loginMethods.configured[0].toLocaleUpperCase() == AuthProvider.EMAIL)
  );
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [loginError, setLoginError] = React.useState("");
  const [userNotExist, setUserNotExist] = useState<boolean>(false);
  const [loginForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { brand } = siteConfig;
  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };
  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (siteConfig.brand?.themeSwitch && currentTheme) {
      localStorage.setItem("theme", currentTheme);
    } else {
      if (siteConfig.brand?.defaultTheme) {
        localStorage.setItem("theme", siteConfig.brand?.defaultTheme);
      } else {
        localStorage.setItem("theme", "light");
      }
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);
  };
  useEffect(() => {
    onCheckTheme();
  }, []);

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

  const checkUserExist = async () => {
    return await SupportClientService.validateUserSignIn(loginForm.getFieldValue("email"));
  };

  const handleEmailLogin = async () => {
    setLoginLoading(true);

    const domain = window.location.port
      ? `${window.location.hostname}:${window.location.port}`
      : window.location.hostname;
    const urlPrefix = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
    const callbackUrl = urlPrefix?.includes(domain) ? `${urlPrefix}/login/sso` : `${urlPrefix}/`;
    signIn("email", {
      email: loginForm.getFieldValue("email"),
      callbackUrl: callbackUrl,
      mode: "login",
      redirect: false,
      loginIntent: "login",
    }).then(async (response) => {
      if (response && response.ok && response.url) {
        setLoginLoading(false);
        setEmailSent(true);
      }
      if (response && !response.ok) {
        setLoginLoading(false);
        if (response.status === 401 && response.error?.includes("Illegal arguments")) {
          messageApi.error("Try a different login method");
        } else {
          messageApi.error(response.error);
        }
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
      <Head>
        <title>{`Login to ${siteConfig.brand?.name}`}</title>
        <meta name="description" content={`${siteConfig?.brand?.description}`.substring(0, 100)} />
        <meta property="og:image" content={siteConfig.brand?.ogImage} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link
          rel="icon"
          href={
            isValidImagePath(`${siteConfig.brand?.favicon}`) ? DOMPurify.sanitize(`${siteConfig.brand?.favicon}`) : ""
          }
        />
      </Head>
      <div
        className={`${styles.login_page_wrapper} ${styles[`bg__${globalState.theme === "dark" ? "dark" : "light"}`]}`}
      >
        {contextHolder}
        <div className={styles.social_login_container}>
          {siteConfig.brand?.icon && typeof siteConfig.brand.icon === "string" ? (
            <object type="image/png" data={siteConfig.brand.icon} height={60} width={60} aria-label={`Brand icon`}>
              <Image src={"/img/brand/brand-icon.png"} height={60} width={60} alt={"logo"} />
            </object>
          ) : (
            <Image src={"/img/brand/brand-icon.png"} height={60} width={60} alt={"logo"} />
          )}

          {emailSent && <h3>Verify your email</h3>}
          {!emailSent && <h3>Welcome back to {brand?.name}</h3>}
          {emailSent && (
            <p style={{ width: 250 }}>
              Please check your email inbox, {loginForm.getFieldValue("email")} to verify your account and continue to
              login.
            </p>
          )}

          {!emailSent && emailLogin && (
            <Form
              form={loginForm}
              onFinish={async () => {
                setLoginLoading(true);
                const validationResponse = await SupportClientService.validateUserSignIn(
                  loginForm.getFieldValue("email")
                );
                if (validationResponse.success) {
                  handleEmailLogin();
                } else {
                  loginForm.setFields([
                    {
                      name: "email",
                      errors: [validationResponse.message],
                    },
                  ]);
                  setLoginLoading(false);
                }
              }}
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
                <Input
                  type="email"
                  placeholder="Enter your email address.."
                  onPressEnter={() => {
                    loginForm.submit();
                  }}
                  style={{ height: 40 }}
                />
              </Form.Item>

              <div>
                <Button
                  loading={loginLoading}
                  style={{ width: 270, height: 40 }}
                  onClick={() => {
                    loginForm.submit();
                  }}
                  type="primary"
                  className={styles.google_btn}
                >
                  Login with Email
                </Button>
              </div>

              {loginMethods.configured.length == 1 &&
              loginMethods.configured[0].toLocaleUpperCase() === AuthProvider.EMAIL ? (
                <></>
              ) : (
                <Button
                  type="link"
                  icon={SvgIcons.arrowLeft}
                  iconPosition="start"
                  style={{ width: 250, marginTop: 10 }}
                  onClick={(_) => setLoginWithEmail(false)}
                >
                  Back to Login
                </Button>
              )}
            </Form>
          )}

          {!emailLogin && (
            <>
              {loginMethods.configured.map((provider, i) => {
                if (provider.toLocaleUpperCase() === AuthProvider.EMAIL) {
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
                            const domain = window.location.port
                              ? `${window.location.hostname}:${window.location.port}`
                              : window.location.hostname;
                            if (process.env.NEXT_PUBLIC_NEXTAUTH_URL?.includes(domain)) {
                              signIn(provider, {
                                callbackUrl: `/login/redirect?redirect=${router.query.redirect}`,
                              });
                            } else {
                              const redirectUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/auth/callback?provider=google&domain=${domain}`;
                              window.location.replace(redirectUrl);
                            }
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
            </>
          )}
          {!emailSent && (
            <Flex gap={5}>
              <p>Don&apos;t have an account?</p>
              <Link href={"/signup"}>Sign up</Link>
            </Flex>
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
  const { req, res } = ctx;
  const session = await getServerSession(req, res, await authOptions(req));
  const domain = req.headers.host || "";

  const { site } = await getSiteConfig(res, domain);
  const siteConfig = site;
  const loginMethods = await getLoginMethods(req);
  if (loginMethods.available.length == 0 && loginMethods.configured.length == 0) {
    return {
      notFound: true,
    };
  }

  const totalUser = await prisma.user.count();

  // Set login state cookie if user is not authenticated
  if (!session) {
    res.setHeader("Set-Cookie", `loginState=${JSON.stringify({ domain })}; Path=/; HttpOnly; SameSite=Lax`);
  }

  if (totalUser === 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/signup",
      },
    };
  }

  if (session) {
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
