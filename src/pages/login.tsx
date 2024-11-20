import { Alert, Button, Form, Input, Spin, Tooltip } from "antd";
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

const LoginPage: NextPage<{ loginMethods: { available: string[]; configured: string[] } }> = ({ loginMethods }) => {
  const router = useRouter();
  const [gitHubLoading, setGitHubLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [emailLogin, setLoginWithEmail] = useState(false);
  const [loginError, setLoginError] = React.useState("");
  const [loginForm] = Form.useForm();
  const { data: session, status: sessionStatus } = useSession();

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

  const handleLogin = () => {
    loginForm.validateFields().then();
    signIn("credentials", {
      callbackUrl: router.query.redirect ? `/${router.query.redirect}` : "/dashboard",
      password: loginForm.getFieldValue("password"),
      email: loginForm.getFieldValue("email"),
      rememberMe: false,
    });
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
      <div className={styles.social_login_container}>
        <Image src={"/icon/torqbit.png"} height={60} width={60} alt={"logo"} />
        <h3>Welcome back to {appConstant.platformName}</h3>

        {emailLogin && (<Form
          form={loginForm}
          onFinish={handleLogin}
          layout='vertical'
          requiredMark='optional'
          autoComplete="off"
          validateMessages={validateMessages}
          validateTrigger='onSubmit'>
          <Form.Item name='email' label='' rules={[{ required: true, message: "Email is required" }, { type: "email" }]}>
            <Input type='email' placeholder='Enter your email address..' style={{ height: 40, background: "transparent" }} />
          </Form.Item>
          <Form.Item name='password' label='' rules={[{ required: true, message: "Password is required" }]}>
            <Input.Password placeholder='Enter your password' style={{ height: 40, background: "transparent" }} />
          </Form.Item>
          <Button
            onClick={() => {
              loginForm.submit();
            }}
            type='primary'
            className={styles.google_btn}>
            Login with Email
          </Button>
        </Form>)}


        {!emailLogin && loginMethods.configured.map((provider) => {
          if (provider === authConstants.CREDENTIALS_AUTH_PROVIDER) {
            return (
              <>
                <Button
                  onClick={() => {
                    setLoginWithEmail(true);
                  }}
                  type='primary'
                  className={styles.google_btn}>
                  Login with Email
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
                      : `Login method disabled for ${capitalizeFirstLetter(provider)} due to missing environment variables`
                  }>
                  <Button
                    style={{ width: 240, height: 40 }}
                    onClick={() => {
                      signIn(provider, {
                        callbackUrl: router.query.redirect ? `/${router.query.redirect}` : "/dashboard",
                      });
                    }}
                    type='default'
                    disabled={!loginMethods.available.includes(provider)}>
                    Login with {capitalizeFirstLetter(provider)}
                  </Button>
                </Tooltip>
              </>
            );
          }
        })}

        {loginError && (
          <Alert message='Login Failed!' description={loginError} type='error' showIcon closable className={styles.alertMessage} />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  let cookieName = getCookieName();

  const loginMethods = getLoginMethods();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
  return { props: { loginMethods } };
};

export default LoginPage;
