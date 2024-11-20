import { Alert, Button, Spin, Tooltip } from "antd";
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
    const [loginError, setLoginError] = React.useState("");
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

    return (
        <div className={styles.login_page_wrapper}>
            <div className={styles.social_login_container}>
                <Image src={"/icon/torqbit.png"} height={60} width={60} alt={"logo"} />
                <h3>Welcome to {appConstant.platformName}</h3>

                {loginMethods.configured.map((provider) => {
                    if (provider === authConstants.CREDENTIALS_AUTH_PROVIDER) {
                        return (
                            <>
                                <Button
                                    onClick={() => {
                                        router.push(`/signup/email`);
                                    }}
                                    type='primary'
                                    className={styles.google_btn}>
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
                                            : `Signup method disabled for ${capitalizeFirstLetter(provider)} due to missing environment variables`
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
                                        Continue with {capitalizeFirstLetter(provider)}
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
