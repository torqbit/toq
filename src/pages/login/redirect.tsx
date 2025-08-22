import { getCookieName } from "@/lib/utils";
import { Role } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";

import AuthService from "@/services/auth/AuthService";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const RedirectPage: NextPage = () => {
  return <></>;
};

export default RedirectPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;

  const params = ctx?.query;
  console.log("params", params);
  const user = await getServerSession(req, res, await authOptions(req));

  const getRedirectUrl = await AuthService.checkSiteStatus(
    user?.id || "",
    user?.role as Role,
    (params.domain as string) || req?.headers?.host || "",
    user?.tenant?.tenantId || "",
    params ? (params.redirect as string) : undefined,
    typeof params?.domain !== "undefined"
  );

  console.log("getRedirectUrl", getRedirectUrl);

  return {
    redirect: {
      permanent: false,
      destination: getRedirectUrl,
    },
  };
};
