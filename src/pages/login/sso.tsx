import { Role, TenantRole } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";

import { SignJWT } from "jose";
import AuthService from "@/services/auth/AuthService";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const RedirectPage: NextPage = () => {
  return <></>;
};

export default RedirectPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;
  const user = await getServerSession(req, res, await authOptions(req));

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  if (user?.role === Role.ADMIN) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
  // get the list of tenants a user is part of where domain isn't same as domain of NEXTAUTH_URL
  const tenants = await AuthService.getTenantsByUserId(user?.id || "", TenantRole.OWNER);
  //match it with the NEXTAUTH_URL domain name with port
  const tenantsWithOwnerRole = tenants.find((tenant) => !process.env.NEXTAUTH_URL?.includes(tenant.tenant.domain));

  if (tenantsWithOwnerRole) {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const destination = `${protocol}://${tenantsWithOwnerRole.tenant.domain}/dashboard`;

    return {
      redirect: {
        permanent: false,
        destination: destination,
      },
    };
  }

  const tenantsWithMember = await AuthService.getTenantsByUserId(user?.id || "", TenantRole.MEMBER);
  const tenantsWithMemberRole = tenantsWithMember.find(
    (tenant) => !process.env.NEXTAUTH_URL?.includes(tenant.tenant.domain)
  );
  if (!tenantsWithMemberRole) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  if (tenantsWithMemberRole) {
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized",
      },
    };
  }
};
