import { Alert, Button, Checkbox, ConfigProvider, Flex, Form, Input, message, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Login.module.scss";
import { signIn } from "next-auth/react";
import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import DOMPurify from "isomorphic-dompurify";

import { authConstants, capitalizeFirstLetter, getCookieName, isValidImagePath } from "@/lib/utils";
import Image from "next/image";
import getLoginMethods from "@/lib/auth/loginMethods";
import SvgIcons from "@/components/SvgIcons";
import AuthService from "@/services/auth/AuthService";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import antThemeConfig from "@/services/antThemeConfig";
import darkThemeConfig from "@/services/darkThemeConfig";
import { useAppContext } from "@/components/ContextApi/AppContext";
import Link from "next/link";
import { Theme } from "@/types/theme";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { AuthProvider } from "@prisma/client";
import appConstant from "@/services/appConstant";
import SupportClientService from "@/services/client/tenant/SupportClientService";
const LoginPage: NextPage<{
  loginMethods: { available: string[]; configured: string[] };
  siteConfig: PageSiteConfig;
}> = ({ loginMethods, siteConfig }) => {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [signupLoading, setSignupLoading] = useState<boolean>(false);
  const [emailSignup, setSignupWithEmail] = useState(
    router.query.provider == "email" ||
      (loginMethods.configured.length == 1 && loginMethods.configured[0].toLocaleUpperCase() == AuthProvider.EMAIL)
  );
  const [loginError, setLoginError] = React.useState("");
  const [signupForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { globalState, dispatch } = useAppContext();
  const [checked, setChecked] = useState<boolean>(false);
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

  React.useEffect(() => {
    if (router.query.error) {
      if (router.query.error === "OAuthAccountNotLinked") {
        setLoginError("You have already signed in with a different provider.");
      }
      if (router.query.error === "AccessDenied") {
        setLoginError("Sorry, You don't have an early access. Please contact us at train@torqbit.com");
      }
    }
  }, [router.query]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--btn-primary", `${siteConfig.brand?.brandColor}`);
  }, []);

  const handleEmailSignUp = async () => {
    setSignupLoading(true);
    signIn("email", {
      email: signupForm.getFieldValue("email"),
      redirect: false,
      mode: "signup",
      loginIntent: "login",
    }).then(async (response) => {
      if (response && response.ok && response.url) {
        setSignupLoading(false);
        setEmailSent(true);
      }
      if (response && !response.ok) {
        setSignupLoading(false);
        if (response.status === 401 && response.error?.includes("Illegal arguments")) {
          messageApi.error("Try a different login method");
        } else {
          messageApi.error(response.error);
        }
      }
    });
    signupForm.resetFields();
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

  const createStateWithOrigin = () => {
    const callbackUrl = `/login/redirect?redirect=${router.query.redirect}`;
    const origin = window.location.hostname;
    const stateObj = {
      origin,
      callbackUrl: callbackUrl,
    };

    // Convert to Base64
    return Buffer.from(JSON.stringify(stateObj)).toString("base64");
  };

  const validateUserEmail = async () => {
    return await SupportClientService.validateUserSignup(signupForm.getFieldValue("email"));
  };

  return (
    <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
      <Head>
        <title>{`Sign up to ${siteConfig.brand?.name}`}</title>

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
          {emailSent && <h3>Verify your email</h3>}
          {!emailSent && <h3>Welcome to {siteConfig.brand?.name}</h3>}

          {emailSent && (
            <p style={{ width: 250 }}>
              Please check your email inbox, {signupForm.getFieldValue("email")} to verify your account and continue to
              signup.
            </p>
          )}

          {!emailSent && emailSignup && (
            <Form
              form={signupForm}
              onFinish={async () => {
                if (checked) {
                  setSignupLoading(true);
                  const emailValidationResponse = await validateUserEmail();

                  if (!emailValidationResponse.success) {
                    signupForm.setFields([
                      {
                        name: "email",
                        errors: [emailValidationResponse.message],
                      },
                    ]);
                    setSignupLoading(false);
                  } else {
                    handleEmailSignUp();
                  }
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
                  onPressEnter={() => checked && signupForm.submit()}
                  placeholder="Enter your email address"
                  style={{ height: 40, width: "100%" }}
                />
              </Form.Item>

              <Flex align="start" gap={10}>
                <Checkbox
                  checked={checked}
                  disabled={signupLoading}
                  onChange={(v) => {
                    setChecked(v.target.checked);
                  }}
                />
                <div style={{ marginBottom: 20 }}>
                  I agree with the{" "}
                  <a href={`${appConstant.websiteUrl}/terms-and-conditions`} target="_blank">
                    Terms and Conditions
                  </a>{" "}
                  <br /> and{" "}
                  <a target="_blank" href={`${appConstant.websiteUrl}/privacy-policy`}>
                    Privacy Policy
                  </a>{" "}
                </div>
              </Flex>

              <Button
                onClick={() => {
                  checked && signupForm.submit();
                }}
                disabled={!checked}
                loading={signupLoading}
                type="primary"
                style={{ width: 270, height: 40, display: "flex" }}
                className={styles.google_btn}
              >
                Signup with Email
              </Button>

              {loginMethods.configured.length == 1 &&
              loginMethods.configured[0].toLocaleUpperCase() === AuthProvider.EMAIL ? (
                <></>
              ) : (
                <Button
                  type="link"
                  icon={SvgIcons.arrowLeft}
                  iconPosition="start"
                  style={{ width: 250, marginTop: 10 }}
                  onClick={(_) => setSignupWithEmail(false)}
                >
                  Back to Signup
                </Button>
              )}
            </Form>
          )}

          {!emailSent && !emailSignup && (
            <>
              {loginMethods.configured.map((provider, i) => {
                if (provider === authConstants.EMAIL_AUTH_PROVIDER) {
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
                              state: createStateWithOrigin(),
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
            </>
          )}
          {!emailSent && (
            <Flex gap={5}>
              <p>Already have an account?</p>
              <Link href={"/login"}>Sign in</Link>
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
  let cookieName = getCookieName();
  const domain = req.headers.host || "";

  const loginMethods = await getLoginMethods(req);
  const { site } = await getSiteConfig(ctx.res, domain);
  const user = await getServerSession(req, res, await authOptions(req));

  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
  return { props: { loginMethods, siteConfig: site } };
};

export default LoginPage;
