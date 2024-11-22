import { Alert, Button, Form, Input, message, Spin, Tooltip } from "antd";
import React, { useState } from "react";
import styles from "@/styles/Login.module.scss";
import { signIn, useSession } from "next-auth/react";
import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
import { authConstants, capitalizeFirstLetter, getCookieName } from "@/lib/utils";
import Image from "next/image";
import getLoginMethods from "@/lib/auth/loginMethods";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import AuthService from "@/services/auth/AuthService";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const LoginPage: NextPage<{ loginMethods: { available: string[]; configured: string[] } }> = ({ loginMethods }) => {
  const router = useRouter();
  const [gitHubLoading, setGitHubLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [emailSignup, setSignupWithEmail] = useState(false);
  const [loginError, setLoginError] = React.useState("");
  const { data: session, status: sessionStatus } = useSession();
  const [signupForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    console.log(loginMethods);
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
  const handleSignup = () => {
    console.log(signupForm.getFieldsValue());

    AuthService.signup(
      { ...signupForm.getFieldsValue() },
      (r) => {
        messageApi.success(r.message);
        router.push("/login?provider=email");
      },
      (err) => {
        console.log(`error: ${err}`);
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
    <div className={styles.login_page_wrapper}>
      {contextHolder}
      <div className={styles.social_login_container}>
        <Image src={"/icon/torqbit.png"} height={60} width={60} alt={"logo"} />
        <h3>Welcome to {appConstant.platformName}</h3>

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
              <Input placeholder="Enter your name" style={{ height: 40, background: "transparent" }} />
            </Form.Item>
            <Form.Item
              name="email"
              label=""
              rules={[{ required: true, message: "Email is required" }, { type: "email" }]}
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                style={{ height: 40, background: "transparent" }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label=""
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be atleast 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter your password" style={{ height: 40, background: "transparent" }} />
            </Form.Item>
            <Button
              onClick={() => {
                signupForm.submit();
              }}
              type="primary"
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

        {!emailSignup &&
          loginMethods.configured.map((provider) => {
            if (provider === authConstants.CREDENTIALS_AUTH_PROVIDER) {
              return (
                <>
                  <Button
                    onClick={() => {
                      setSignupWithEmail(true);
                    }}
                    type="primary"
                    className={styles.google_btn}
                  >
                    Signup with Email
                  </Button>
                </>
              );
            } else {
              return (
                <>
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
                          callbackUrl: router.query.redirect ? `/${router.query.redirect}` : "/dashboard",
                        });
                      }}
                      type="default"
                      disabled={!loginMethods.available.includes(provider)}
                    >
                      Continue with {capitalizeFirstLetter(provider)}
                    </Button>
                  </Tooltip>
                </>
              );
            }
          })}

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

  const loginMethods = getLoginMethods();
  const { site } = getSiteConfig();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  } else if (!user && !site.updated) {
    return {
      redirect: {
        permanent: false,
        destination: "/onboard",
      },
    };
  }
  return { props: { loginMethods } };
};

export default LoginPage;
