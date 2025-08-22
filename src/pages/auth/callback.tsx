import { capitalizeFirst } from "@/lib/utils";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { GetServerSidePropsContext } from "next";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

const SSOCallback: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const router = useRouter();
  const { ssoToken, provider, domain, action } = router.query;

  useEffect(() => {
    if (ssoToken) {
      if (typeof ssoToken === "string") {
        signIn("credentials", {
          ssoToken: ssoToken,
          callbackUrl: `${window.location.protocol}//${window.location.host}/dashboard/`,
        });
      }
    }
    if (provider && domain) {
      //create the callback url based on the current domain and protocol
      const callbackUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/login/redirect?redirect=/&domain=${domain}`;
      signIn(String(provider), {
        callbackUrl: callbackUrl,
      });
    }

    if (action === "logout" && domain) {
      setTimeout(() => {
        signOut({
          redirect: false,
        }).then((response) => {
          window.location.href = `${window.location.protocol}//${domain}/login/`;
        });
      }, 2500);
    }
  }, [ssoToken, provider, action, router]);

  return (
    <section
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {ssoToken && <h2>Signing you in {siteConfig.brand?.name} </h2>}
      {provider && <h2>Redirecting you to {capitalizeFirst(provider as string)} </h2>}
      {action === "logout" && <h2>Signing you out from {domain} </h2>}
      <Spin
        spinning={true}
        indicator={<LoadingOutlined style={{ color: siteConfig.brand?.brandColor }} spin />}
        size="large"
      />
    </section>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res, query } = ctx;

  const domain = (query.domain as string) || req.headers.host || "";
  console.log(`domain: ${domain}, query: ${JSON.stringify(query)}`);
  const { site } = await getSiteConfig(res, domain);
  const siteConfig = site;
  res.setHeader("Set-Cookie", `loginState=${JSON.stringify({ domain })}; Path=/; HttpOnly; SameSite=Lax`);

  return { props: { siteConfig } };
};

export default SSOCallback;
