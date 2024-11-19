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

const LoginWithEmail: NextPage<{ loginMethods: { available: string[]; configured: string[] } }> = ({ loginMethods }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = React.useState("");
  const { data: session, status: sessionStatus } = useSession();
  const [loginForm] = Form.useForm();
  React.useEffect(() => {
    console.log(loginMethods);
    if (router.query.error) {
      if (router.query.error === "OAuthAccountNotLinked") {
        setLoading(false);
        setLoginError("You have already signed in with a different provider.");
      }
      if (router.query.error === "AccessDenied") {
        setLoginError("Sorry, You don't have an early access. Please contact us at train@torqbit.com");
        setLoading(false);
      }
    }
  }, [router.query]);

  if (sessionStatus === "loading") {
    return <SpinLoader />;
  }

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const handleLogin = () => {
    loginForm.validateFields().then();
    signIn("credentials", {
      callbackUrl: router.query.redirect ? `/${router.query.redirect}` : "/dashboard",
      password: loginForm.getFieldValue("password"),
      email: loginForm.getFieldValue("email"),
      rememberMe: false,
    });
  };

  return (
    <div className={styles.login_page_wrapper}>
      <div className={styles.social_login_container}>
        <Image src={"/icon/torqbit.png"} height={60} width={60} alt={"logo"} />
        <h3>Login to {appConstant.platformName}</h3>

        <Form
          form={loginForm}
          onFinish={handleLogin}
          layout='vertical'
          requiredMark='optional'
          validateMessages={validateMessages}
          validateTrigger='onBlur'>
          <Form.Item name='email' label='Email' rules={[{ required: true, message: "Email is required" }, { type: "email" }]}>
            <Input type='email' placeholder='donald@trump.com' height={40} />
          </Form.Item>
          <Form.Item name='password' label='Password' rules={[{ required: true, message: "Password is required" }]}>
            <Input.Password placeholder='sec3et' height={40} />
          </Form.Item>
          <Button
            onClick={() => {
              loginForm.submit();
            }}
            type='primary'
            className={styles.google_btn}>
            Login with Email
          </Button>
        </Form>

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

export default LoginWithEmail;
