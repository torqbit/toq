import { AuthAPIResponse } from "@/types/auth/api";
import { postFetch } from "../request";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

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

  checkSiteStatus = async (userRole: Role, redirectUrl?: string) => {
    const cmsExists = await prisma.serviceProvider.count({
      where: { service_type: "cms" },
    });

    const paymentExists = await prisma.serviceProvider.count({
      where: { service_type: "payments" },
    });

    const emailExists = await prisma.serviceProvider.count({
      where: { service_type: "email" },
    });

    const allExist = cmsExists > 0 && paymentExists > 0 && emailExists > 0;
    if (userRole === Role.ADMIN) {
      if (allExist) {
        return redirectUrl !== "undefined" ? redirectUrl : "/dashboard";
      } else {
        return "/admin/onboard/complete";
      }
    } else {
      return redirectUrl !== "undefined" ? redirectUrl : "/dashboard";
    }
  };
}

export default new AuthService();
