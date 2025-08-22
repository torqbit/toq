import { AuthAPIResponse } from "@/types/auth/api";
import { getFetch, postFetch } from "../request";
import { Role, ServiceType, TenantRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { SignJWT } from "jose";

const authErrorMessage = "Failed to authenticate";
class AuthService {
  signup = (
    userData: {
      name: string;
      email: string;
      password: string;
    },
    onSuccess: (response: AuthAPIResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(userData, `/api/v1/user/signup`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as AuthAPIResponse;
        apiResponse.success ? onSuccess(apiResponse) : onFailure(apiResponse.error || authErrorMessage);
      });
    });
  };

  getAuthenticationProviderDetail = (
    onSuccess: (response: AuthAPIResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/admin/config/auth/get`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as AuthAPIResponse;
        apiResponse.success ? onSuccess(apiResponse) : onFailure(apiResponse.error || authErrorMessage);
      });
    });
  };

  checkSiteStatus = async (
    userId: string,
    userRole: Role,
    domain: string,
    tenantId: string,
    redirectUrl?: string,
    forceLogin: boolean = false
  ) => {
    let redirectUrlFinal = redirectUrl;
    if (redirectUrl && redirectUrl.startsWith("/")) {
      redirectUrlFinal = redirectUrl.substring(1);
    }

    if (userRole === Role.ADMIN) {
      return redirectUrl !== "undefined" ? `/${redirectUrlFinal}` : "/dashboard";
    } else if (userRole === Role.CUSTOMER) {
      const userTenantResult = await prisma.userTenant.findUnique({
        select: {
          id: true,
          tenant: {
            select: {
              domain: true,
            },
          },
        },
        where: {
          userId_tenantId: {
            userId: userId,
            tenantId: tenantId,
          },
          tenant: {
            domain: domain,
          },
        },
      });

      if (!userTenantResult || process.env.NEXTAUTH_URL?.includes(userTenantResult.tenant.domain)) {
        return `/login/sso`;
      } else {
        if (!forceLogin) {
          return redirectUrl !== "undefined" ? `/${redirectUrlFinal}` : "/dashboard";
        }
        const destination = `http://${userTenantResult.tenant.domain}/auth/callback`;
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        const ssoToken = await new SignJWT({ id: userId, role: userRole, tenantId: tenantId })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("5m")
          .sign(secret);
        console.log(`redirecting to ${destination}?ssoToken=${ssoToken}`);
        return `${destination}?ssoToken=${ssoToken}`;
      }
    } else {
      return redirectUrl !== "undefined" ? `/${redirectUrlFinal}` : "/dashboard";
    }
  };

  getTenantsByUserId = async (userId: string, role?: TenantRole) => {
    //filter based on the role
    const userTenants = await prisma.userTenant.findMany({
      where: {
        userId: userId,
        role: role,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
      },
    });
    return userTenants;
  };
}

export default new AuthService();
