import { getCookieName } from "@/lib/utils";
import { Role } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";

import AuthService from "@/services/auth/AuthService";

const RedirectPage: NextPage = () => {
  return <></>;
};

export default RedirectPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  const params = ctx?.query;

  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  const getRedirectUrl = await AuthService.checkSiteStatus(
    user?.role as Role,
    params ? (params.redirect as string) : undefined
  );

  return {
    redirect: {
      permanent: false,
      destination: getRedirectUrl,
    },
  };
};
