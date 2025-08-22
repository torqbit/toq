import React from "react";
import { useRouter } from "next/router";
import { Button } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSiteConfig } from "@/services/getSiteConfig";
import Blank, { OverlapNumber } from "@/components/Layouts/Blank";
import { PageSiteConfig } from "@/services/siteConstant";

const AuthErrorPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const router = useRouter();
  const { error } = router.query;

  if (error === "Verification") {
    return (
      <Blank siteConfig={siteConfig}>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <OverlapNumber number={403} />
          <h1>Verification Error</h1>
          <p>The sign in link is no longer valid. It may have been used already or it may have expired.</p>
          <Button type="primary" onClick={() => router.push("/")}>
            Go Back to Home
          </Button>
        </div>
      </Blank>
    );
  }

  return null;
};

export default AuthErrorPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const domain = ctx.req.headers.host || "";

  const siteConfig = await getSiteConfig(ctx.res, domain);
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
