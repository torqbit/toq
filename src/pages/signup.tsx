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
import AuthService from "@/services/auth/AuthService";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import antThemeConfig from "@/services/antThemeConfig";
import darkThemeConfig from "@/services/darkThemeConfig";
import prisma from "@/lib/prisma";
import { useAppContext } from "@/components/ContextApi/AppContext";
import Link from "next/link";

const LoginPage: NextPage<{
  loginMethods: { available: string[]; configured: string[] };
  siteConfig: PageSiteConfig;
}> = ({ loginMethods, siteConfig }) => {
  const router = useRouter();
  const [gitHubLoading, setGitHubLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [signupLoading, setSignupLoading] = useState<boolean>(false);

  const [emailSignup, setSignupWithEmail] = useState(false);
  const [loginError, setLoginError] = React.useState("");
  const { data: session, status: sessionStatus } = useSession();
  const [signupForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { globalState } = useAppContext();

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

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${siteConfig.brand?.brandColor}`);
  }, []);

  const handleSignup = () => {
    setSignupLoading(true);

    AuthService.signup(
      { ...signupForm.getFieldsValue() },
      (r) => {
        setSignupLoading(false);

        messageApi.success(r.message);
        router.push("/login?provider=email");
      },
      (err) => {
        setSignupLoading(false);
        messageApi.error(err);
      }
    );
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
      <div className={`${styles.login_page_wrapper} bg__${globalState.theme}`}>
        {contextHolder}
        <div className={styles.social_login_container}>
          {siteConfig.brand?.icon && typeof siteConfig.brand.icon === "string" ? (
            <object type="image/png" data={siteConfig.brand.icon} height={60} width={60} aria-label={`Brand icon`}>
              <Image src={"/icon/torqbit.png"} height={60} width={60} alt={"logo"} />
            </object>
          ) : (
            <Image src={"/icon/torqbit.png"} height={60} width={60} alt={"logo"} />
          )}
          <h3>Welcome to {siteConfig.brand?.name}</h3>

          {emailSignup && (
            <Form
              form={signupForm}
              onFinish={handleSignup}
              layout="vertical"
              requiredMark="optional"
              autoComplete="off"
              validateMessages={validateMessages}
              validateTrigger="onSubmit"
            >
              <Form.Item name="name" label="" rules={[{ required: true, message: "Name is required" }]}>
                <Input placeholder="Enter your name" style={{ height: 40 }} />
              </Form.Item>
              <Form.Item
                name="email"
                label=""
                rules={[{ required: true, message: "Email is required" }, { type: "email" }]}
              >
                <Input type="email" placeholder="Enter your email address" style={{ height: 40 }} />
              </Form.Item>
              <Form.Item
                name="password"
                label=""
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be atleast 6 characters" },
                ]}
              >
                <Input.Password placeholder="Enter your password" style={{ height: 40 }} />
              </Form.Item>
              <Button
                onClick={() => {
                  signupForm.submit();
                }}
                loading={signupLoading}
                type="primary"
                style={{ width: 250, height: 40, display: "block" }}
                className={styles.google_btn}
              >
                Signup with Email
              </Button>

              <Button
                type="link"
                icon={SvgIcons.arrowLeft}
                iconPosition="start"
                style={{ width: 250, marginTop: 10 }}
                onClick={(_) => setSignupWithEmail(false)}
              >
                Back to Signup
              </Button>
            </Form>
          )}

          {!emailSignup && (
            <>
              {loginMethods.configured.map((provider, i) => {
                if (provider === authConstants.CREDENTIALS_AUTH_PROVIDER) {
                  return (
                    <div key={i}>
                      <Button
                        onClick={() => {
                          setSignupWithEmail(true);
                        }}
                        type="primary"
                        className={styles.google_btn}
                        style={{ width: 250, height: 40, display: "block" }}
                      >
                        Signup with Email
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
                            : `Signup method disabled for ${capitalizeFirstLetter(
                                provider
                              )} due to missing environment variables`
                        }
                      >
                        <Button
                          style={{ width: 250, height: 40 }}
                          onClick={() => {
                            signIn(provider, {
                              callbackUrl: `/login/redirect?redirect=${router.query.redirect}`,
                            });
                          }}
                          type="default"
                          disabled={!loginMethods.available.includes(provider)}
                        >
                          Continue with {capitalizeFirstLetter(provider)}
                        </Button>
                      </Tooltip>
                    </div>
                  );
                }
              })}
              <Flex gap={5}>
                <p>Already have an account?</p>
                <Link href={"/login"}>Sign in</Link>
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

  const loginMethods = getLoginMethods();
  const { site } = getSiteConfig();
  const totalUser = await prisma.account.count();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  } else if (!user && !site.updated && totalUser === 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/onboard",
      },
    };
  }
  return { props: { loginMethods, siteConfig: site } };
};

export default LoginPage;
