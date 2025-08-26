import React, { FC } from "react";

import { GetServerSidePropsContext } from "next";

import { getCookieName } from "@/lib/utils";

import { getSiteConfig } from "@/services/getSiteConfig";

import { IEmailVerificationConfig, ISupportMail } from "@/lib/emailConfig";
import EmailVerificationPage from "@/components/Email/EmailVerificationPage";
import { DEFAULT_THEME } from "@/services/siteConstant";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const EmailPreviewPage: FC<{ configData: IEmailVerificationConfig }> = ({ configData }) => {
  const data: ISupportMail = {
    name: "Admin",
    url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/admin/support`,

    title: "Unable to generate invoices",
    tenantOwnerEmail: "mehrab@mail.com",
    brandName: "StarBucks",
    brandIcon: "https://cdn.torqbit.com/static/toq/logo.png",
    brandColor: "",
  };
  return (
    <EmailVerificationPage
      configData={{
        url: "http://localhost:8080",
        mode: "signup",
        email: "myemail@gmail.com",
        site: DEFAULT_THEME,
      }}
    />
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { res, req } = ctx;

  let cookieName = getCookieName();

  const user = await getServerSession(req, res, await authOptions(req));

  const { site } = await getSiteConfig(res, req.headers.host || "");
  const siteConfig = site;
  return {
    props: {
      configData: {
        name: "Donald",
        brandName: "Amazon",
        tenantOwnerEmail: "bezos@amazon.com",
        url: "http://hello.com.url",
        pdfPath: "",
        site: siteConfig,
      },
    },
  };
};

export default EmailPreviewPage;
